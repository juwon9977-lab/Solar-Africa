import { useListVendors, useGetVendorStats, getListVendorsQueryKey, getGetVendorStatsQueryKey } from "@/lib/api-client";
import { VendorCard } from "@/components/vendor-card";
import { NIGERIAN_STATES, VENDOR_CATEGORIES } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Grid2X2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80",
    caption: "Solar panels powering Nigerian homes",
  },
  {
    url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1920&q=80",
    caption: "Large-scale solar energy farms",
  },
  {
    url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1920&q=80",
    caption: "Professional solar installation teams",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    caption: "Rooftop solar for homes and businesses",
  },
  {
    url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1920&q=80",
    caption: "Clean energy across Africa",
  },
];

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const queryParams = {
    ...(search ? { q: search } : {}),
    ...(state !== "all" ? { state } : {}),
    ...(category !== "all" ? { category } : {})
  };

  const { data: vendors, isLoading } = useListVendors(queryParams, {
    query: { queryKey: getListVendorsQueryKey(queryParams) }
  });

  const { data: stats } = useGetVendorStats({
    query: { queryKey: getGetVendorStatsQueryKey() }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="text-secondary-foreground relative overflow-hidden py-16 md:py-24 min-h-[520px] flex items-center">
        {/* Carousel background slides */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.url}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${slide.url})`,
              opacity: i === activeSlide ? 1 : 0,
            }}
            aria-hidden="true"
          />
        ))}
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-[#0a1628]/75" />
        {/* Amber gradient accent */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10 w-full pb-10">
          {/* Slide indicator dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="max-w-4xl">
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Africa's Solar Directory — Now Live in Nigeria
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
              Find trusted<br />
              <span className="text-primary">solar professionals</span><br />
              across Africa.
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl leading-relaxed">
              We connect homes and businesses with verified solar installers, panel dealers, and energy experts.
              Currently listing across all 37 Nigerian states — more African countries coming soon.
            </p>

            {/* Search bar */}
            <div className="bg-background/95 backdrop-blur rounded-2xl p-2 shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, service, or keyword..."
                  className="h-12 pl-10 border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="hidden md:block w-px bg-border my-2" />
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-12 pl-10 border-0 bg-transparent text-foreground shadow-none focus:ring-0">
                    <SelectValue placeholder="All Nigerian States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Nigerian States</SelectItem>
                    {NIGERIAN_STATES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 px-8 text-base shrink-0 rounded-xl">Explore Directory</Button>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-4 mb-10">
              <Button variant="outline" className="border-white/20 text-white bg-white/10 hover:bg-white/20 hover:text-white" asChild>
                <Link href="/submit">List Your Business</Link>
              </Button>
              <span className="text-white/40 text-sm">Free to list in Nigeria — more African countries launching soon</span>
            </div>

            {/* Trust stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: `${stats.totalVendors}+`, label: "Listed Vendors" },
                  { value: stats.verifiedVendors, label: "Verified Experts" },
                  { value: stats.statesCovered, label: "Nigerian States" },
                  { value: stats.totalReviews, label: "Client Reviews" },
                ].map(({ value, label }) => (
                  <div key={label} className="border-l-2 border-primary/40 pl-4">
                    <div className="font-stat text-3xl font-bold text-white">{value}</div>
                    <div className="text-sm text-white/60 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Grid2X2 className="h-4 w-4 text-primary" /> Categories
              </h3>
              <div className="space-y-2">
                <div 
                  className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${category === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => setCategory('all')}
                >
                  All Categories
                </div>
                {VENDOR_CATEGORIES.map(cat => (
                  <div 
                    key={cat}
                    className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors flex justify-between items-center ${category === cat ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span>{cat}</span>
                    {stats?.categoryCounts.find(c => c.category === cat)?.count ? (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-foreground/70">
                        {stats.categoryCounts.find(c => c.category === cat)?.count}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Location
              </h3>
              <p className="text-xs text-muted-foreground mb-3">Nigeria — more countries coming soon</p>
              <div className="space-y-2">
                <div 
                  className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${state === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => setState('all')}
                >
                  All Nigerian States
                </div>
                {NIGERIAN_STATES.map(st => (
                  <div 
                    key={st}
                    className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors flex justify-between items-center ${state === st ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                    onClick={() => setState(st)}
                  >
                    <span>{st}</span>
                    {stats?.stateCounts.find(c => c.state === st)?.count ? (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-foreground/70">
                        {stats.stateCounts.find(c => c.state === st)?.count}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-sm">Are you a vendor?</h4>
                <p className="text-xs text-muted-foreground mb-4">Get listed in Africa's growing solar directory and reach thousands of buyers across Nigeria and beyond.</p>
                <Button variant="outline" className="w-full text-xs" asChild>
                  <Link href="/submit">Submit Listing</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {isLoading ? "Loading vendors..." : `${vendors?.length || 0} Vendors Found`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-64 w-full rounded-xl" />
                ))}
              </div>
            ) : vendors?.length === 0 ? (
              <div className="text-center py-24 px-4 bg-muted/20 rounded-xl border border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No vendors found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any vendors matching your current filters. Try adjusting your search or selecting a different category.
                </p>
                <Button variant="outline" onClick={() => { setSearch(""); setState("all"); setCategory("all"); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {vendors?.map(vendor => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
