import { BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Shop",
    links: ["All Books", "Bestsellers", "New Releases", "Coming Soon"],
  },
  {
    title: "Support",
    links: ["Help Center", "Shipping Info", "Returns", "Track Order"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <BookOpen size={24} className="text-gold" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-playfair)] text-gold-gradient">
                Biblion
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your destination for discovering extraordinary books and literary treasures.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2024 Biblion. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
