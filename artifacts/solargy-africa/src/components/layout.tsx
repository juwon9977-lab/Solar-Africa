import { Link, useLocation } from "wouter";
import { Sun, Bookmark, Menu, X, ShieldCheck } from "lucide-react";
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
            <span className="font-bold text-lg tracking-tight text-foreground">Solargy<span className="text-primary">Africa</span></span>
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

          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="outline" size="sm" className="hidden lg:flex">
              <Link href="/admin">
                <ShieldCheck className="h-4 w-4 mr-2" /> Admin
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/submit">Add Vendor</Link>
            </Button>
          </div>

          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
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
                  <Link href="/submit">Add Vendor</Link>
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

      <footer className="border-t bg-muted/40 py-12 w-full mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-primary mb-4">
              <Sun className="h-6 w-6" />
              <span className="font-bold text-lg text-foreground">Solargy<span className="text-primary">Africa</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Nigeria's premier solar vendor directory. Find trusted installers, panel dealers, battery suppliers, and solar consultants across all 37 Nigerian states.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Directory</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Solar Knowledge Hub</Link></li>
              <li><Link href="/submit" className="hover:text-primary">Submit a Listing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/admin" className="hover:text-primary">Admin Access</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t text-sm text-muted-foreground flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Solargy Africa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
