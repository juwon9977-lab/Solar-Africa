import { useListVendors, useGetVendorStats, getListVendorsQueryKey, getGetVendorStatsQueryKey } from "@workspace/api-client-react";
import { VendorCard } from "@/components/vendor-card";
import { ACTIVE_STATES, NIGERIAN_STATES, VENDOR_CATEGORIES } from "@/lib/constants";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Grid2X2, Settings2, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

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
      <section className="bg-secondary text-secondary-foreground relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10">Nigeria's #1 Solar Directory</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              Find trusted solar professionals in Nigeria.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              We connect homes and businesses with verified installers, panel dealers, and solar experts across the country.
            </p>

            <div className="bg-background rounded-xl p-2 shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, service..." 
                  className="h-12 pl-10 border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="hidden md:block w-px bg-border my-2" />
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-12 pl-10 border-0 bg-transparent text-foreground shadow-none focus:ring-0">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {NIGERIAN_STATES.map(s => (
                      <SelectItem key={s} value={s} disabled={!ACTIVE_STATES.includes(s)}>
                        {s} {!ACTIVE_STATES.includes(s) && "(Soon)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 px-8 text-base shrink-0">Search</Button>
            </div>

            {stats && (
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalVendors}+</div>
                  <div className="text-sm text-muted-foreground">Listed Vendors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.verifiedVendors}</div>
                  <div className="text-sm text-muted-foreground">Verified Experts</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.statesCovered}</div>
                  <div className="text-sm text-muted-foreground">Active States</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalReviews}</div>
                  <div className="text-sm text-muted-foreground">User Reviews</div>
                </div>
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
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Active States
              </h3>
              <div className="space-y-2">
                <div 
                  className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors ${state === 'all' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}
                  onClick={() => setState('all')}
                >
                  All States
                </div>
                {ACTIVE_STATES.map(st => (
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
                <p className="text-xs text-muted-foreground mb-4">Get listed in Nigeria's largest solar directory and reach thousands of buyers.</p>
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
