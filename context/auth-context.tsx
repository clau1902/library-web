"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (in real app, this would be MongoDB)
const MOCK_USERS_KEY = "biblion-users";
const AUTH_TOKEN_KEY = "biblion-auth-token";

interface StoredUser extends User {
  password: string;
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveStoredUsers(users: StoredUser[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        try {
          const userData = JSON.parse(atob(token));
          setUser(userData);
        } catch (e) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getStoredUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, error: "No account found with this email" };
    }

    // In real app, use bcrypt to compare passwords
    if (foundUser.password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Create a simple token (in real app, use jose JWT)
    const token = btoa(JSON.stringify(userWithoutPassword));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setUser(userWithoutPassword);

    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getStoredUsers();
    
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists" };
    }

    // Create new user
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In real app, hash with bcrypt
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    
    // Auto login after registration
    const token = btoa(JSON.stringify(userWithoutPassword));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setUser(userWithoutPassword);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

