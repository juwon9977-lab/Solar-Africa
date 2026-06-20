import { Link, useLocation } from "wouter";
import { Sun, Menu, X, ShieldCheck, Facebook, Instagram, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Directory", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Saved", href: "/saved" },
    { name: "Submit Vendor", href: "/submit" },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Sun className="h-6 w-6" />
            <span className="font-bold text-lg tracking-tight text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
              Solargy<span className="text-primary">Africa</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="hidden lg:flex">
              <Link href="/admin">
                <ShieldCheck className="h-4 w-4 mr-2" /> Admin
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/submit">List Your Business</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-b bg-background px-4 py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    location === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/submit">List Your Business</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin">Admin Login</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="border-t bg-muted/30 w-full mt-auto">
        {/* Newsletter strip */}
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Stay updated on Nigerian solar</h3>
              <p className="text-sm text-muted-foreground">Get new vendor listings and solar tips delivered to your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 h-10 px-4 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <Button size="sm" className="shrink-0">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-primary mb-4">
              <Sun className="h-6 w-6" />
              <span className="font-bold text-lg text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
                Solargy<span className="text-primary">Africa</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Nigeria's premier solar vendor directory. Find trusted installers, panel dealers, battery suppliers, and solar consultants across all 37 states.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/191fjQCE3C/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/solargyafrica"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@solargyafrica.com"
                className="h-9 w-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Directory */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wide">Directory</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Browse All Vendors</Link></li>
              <li><Link href="/?verified=true" className="hover:text-primary transition-colors">Verified Experts</Link></li>
              <li><Link href="/submit" className="hover:text-primary transition-colors">Submit a Listing</Link></li>
              <li><Link href="/saved" className="hover:text-primary transition-colors">Saved Vendors</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wide">Resources</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Solar Knowledge Hub</Link></li>
              <li>
                <a href="mailto:info@solargyafrica.com" className="hover:text-primary transition-colors">
                  info@solargyafrica.com
                </a>
              </li>
              <li>
                <a href="mailto:admin@solargyafrica.com" className="hover:text-primary transition-colors">
                  admin@solargyafrica.com
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Access</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="container mx-auto px-4 py-6 border-t text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} Solargy Africa. All rights reserved.</p>
          <p className="text-xs">
            Connecting Nigeria to clean, affordable solar energy — one verified vendor at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
