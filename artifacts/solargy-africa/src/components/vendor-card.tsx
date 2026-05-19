import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, CheckCircle2, MapPin, Phone, Star } from "lucide-react";
import { useSavedVendors } from "@/lib/saved";
import { Vendor } from "@workspace/api-client-react/src/generated/api.schemas";
import { Link } from "wouter";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const { isSaved, toggleSaved } = useSavedVendors();
  const saved = isSaved(vendor.id);

  return (
    <Card
      className="flex flex-col h-full overflow-hidden transition-all border-border hover:border-primary/50 hover:shadow-md group"
      data-testid={`card-vendor-${vendor.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {vendor.logo || vendor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg leading-none tracking-tight flex items-center gap-1 group-hover:text-primary transition-colors">
              {vendor.name}
              {vendor.verified && (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{vendor.category}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -mr-2 -mt-2 rounded-full hover:text-primary"
          onClick={(e) => { e.preventDefault(); toggleSaved(vendor.id); }}
          data-testid={`button-save-${vendor.id}`}
        >
          {saved
            ? <BookmarkCheck className="h-5 w-5 text-primary fill-primary/20" />
            : <Bookmark className="h-5 w-5" />}
        </Button>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {vendor.city}, {vendor.state}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-medium text-foreground">
              {vendor.rating ? vendor.rating.toFixed(1) : "New"}
            </span>
            {vendor.reviewCount > 0 && <span>({vendor.reviewCount})</span>}
          </div>
        </div>

        <p className="text-sm line-clamp-2 text-muted-foreground mb-4">
          {vendor.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {vendor.services.split(",").slice(0, 3).map((service, i) => (
            <Badge variant="secondary" key={i} className="text-xs font-normal">
              {service.trim()}
            </Badge>
          ))}
          {vendor.services.split(",").length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{vendor.services.split(",").length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t bg-muted/20 px-6 py-4 flex gap-2">
        <Button variant="outline" className="flex-1 bg-background" asChild data-testid={`button-view-${vendor.id}`}>
          <Link href={`/vendor/${vendor.id}`}>View Details</Link>
        </Button>
        <Button className="flex-1 gap-2" asChild data-testid={`button-call-${vendor.id}`}>
          <a href={`tel:${vendor.phone}`}>
            <Phone className="h-4 w-4" /> Call
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
