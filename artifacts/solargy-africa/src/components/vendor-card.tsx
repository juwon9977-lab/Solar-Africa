import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, CheckCircle2, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { useSavedVendors } from "@/lib/saved";
import { Vendor } from "@/lib/api-client/generated/api.schemas";
import { Link } from "wouter";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const { isSaved, toggleSaved } = useSavedVendors();
  const saved = isSaved(vendor.id);

  return (
    <Card
      className="flex flex-col h-full overflow-hidden transition-all duration-200 border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 group"
      data-testid={`card-vendor-${vendor.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {vendor.logo || vendor.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base leading-tight tracking-tight group-hover:text-primary transition-colors">
              {vendor.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{vendor.category}</p>
            {vendor.verified && (
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary fill-primary/20" />
                <span className="text-xs text-primary font-medium">Verified by Solargy</span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -mr-2 -mt-1 rounded-full hover:text-primary shrink-0"
          onClick={(e) => { e.preventDefault(); toggleSaved(vendor.id); }}
          data-testid={`button-save-${vendor.id}`}
        >
          {saved
            ? <BookmarkCheck className="h-5 w-5 text-primary fill-primary/20" />
            : <Bookmark className="h-5 w-5" />}
        </Button>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{vendor.city}, {vendor.state}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {vendor.rating ? (
              <>
                {[1,2,3,4,5].map(s => (
                  <Star
                    key={s}
                    className={`h-3 w-3 ${s <= Math.round(vendor.rating!) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                  />
                ))}
                <span className="ml-1 font-semibold text-foreground text-xs">{vendor.rating.toFixed(1)}</span>
                {vendor.reviewCount > 0 && (
                  <span className="text-xs">({vendor.reviewCount})</span>
                )}
              </>
            ) : (
              <span className="text-xs italic">No reviews yet</span>
            )}
          </div>
        </div>

        <p className="text-sm line-clamp-2 text-muted-foreground mb-4 leading-relaxed">
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

      <CardFooter className="pt-0 border-t bg-muted/20 px-6 py-3 flex gap-2">
        <Button variant="outline" className="flex-1 bg-background text-xs" asChild data-testid={`button-view-${vendor.id}`}>
          <Link href={`/vendor/${vendor.id}`}>View Full Profile</Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 border-green-500/40 text-green-600 hover:bg-green-50 hover:text-green-700"
          asChild
          title="WhatsApp"
        >
          <a href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
          </a>
        </Button>
        <Button className="flex-1 gap-1.5 text-xs" asChild data-testid={`button-call-${vendor.id}`}>
          <a href={`tel:${vendor.phone}`}>
            <Phone className="h-3.5 w-3.5" /> Get Quote
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
