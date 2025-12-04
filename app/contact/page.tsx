"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Here you would send form data to your API (not implemented)
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-20">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Contact Us</h1>
        {submitted ? (
          <div className="text-center space-y-2">
            <span role="img" aria-label="mail" className="text-4xl">📧</span>
            <p className="text-green-600 font-semibold">
              Thank you for reaching out! We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border-gray-300 rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                type="text"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border-gray-300 rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                type="email"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border-gray-300 rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
