import { Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Product", href: "/product" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold">3legant</h2>
            <span className="text-primary-foreground/60">|</span>
            <span className="text-primary-foreground/60">E-Commerce Store</span>
          </div>
          <nav className="w-full md:w-auto">
            <ul className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="bg-primary-foreground/10" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6 md:mb-0 text-center md:text-left">
            <span className="text-primary-foreground/60 text-sm">
              Copyright © {new Date().getFullYear()} 3legant. All rights
              reserved
            </span>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
          <div className="flex gap-4">
            {socialLinks.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="icon"
                asChild
                className="h-9 w-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
              >
                <a href={item.href} aria-label={item.name}>
                  <item.icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
