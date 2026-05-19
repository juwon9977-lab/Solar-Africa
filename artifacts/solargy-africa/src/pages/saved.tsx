import { useSavedVendors } from "@/lib/saved";
import { useListVendors, getListVendorsQueryKey } from "@workspace/api-client-react";
import { VendorCard } from "@/components/vendor-card";
import { Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedPage() {
  const { savedIds } = useSavedVendors();
  
  const { data: vendors, isLoading } = useListVendors({}, {
    query: { 
      queryKey: getListVendorsQueryKey({}),
      enabled: savedIds.length > 0 
    }
  });

  const savedVendors = vendors?.filter(v => savedIds.includes(v.id)) || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Vendors</h1>
          <p className="text-muted-foreground">Vendors you've bookmarked for later</p>
        </div>
      </div>

      {savedIds.length === 0 ? (
        <div className="text-center py-24 px-4 bg-muted/10 rounded-2xl border border-dashed">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-semibold mb-3">No saved vendors</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
            You haven't bookmarked any vendors yet. Explore the directory and save the ones you're interested in.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/">
              <Search className="h-4 w-4 mr-2" />
              Explore Directory
            </Link>
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}
