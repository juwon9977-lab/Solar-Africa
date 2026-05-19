import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, CheckCircle2, MapPin, Phone, Star, StarHalf } from "lucide-react";
import { useSavedVendors } from "@/lib/saved";
import { Vendor } from "@workspace/api-client-react/src/generated/api.schemas";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGetVendorReviews, getGetVendorReviewsQueryKey, useCreateReview, useGetVendor, getGetVendorQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


export function VendorCard({ vendor: initialVendor }: { vendor: Vendor }) {
  const { isSaved, toggleSaved } = useSavedVendors();
  const saved = isSaved(initialVendor.id);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: freshVendor } = useGetVendor(initialVendor.id, {
    query: { enabled: detailsOpen, queryKey: getGetVendorQueryKey(initialVendor.id) }
  });

  const vendor = freshVendor || initialVendor;

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden hover-elevate transition-all border-border hover:border-primary/50 group">
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
            onClick={(e) => { e.stopPropagation(); toggleSaved(vendor.id); }}
          >
            {saved ? <BookmarkCheck className="h-5 w-5 text-primary fill-primary/20" /> : <Bookmark className="h-5 w-5" />}
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
              <span className="font-medium text-foreground">{vendor.rating ? vendor.rating.toFixed(1) : "New"}</span>
              {vendor.reviewCount > 0 && <span>({vendor.reviewCount})</span>}
            </div>
          </div>
          
          <p className="text-sm line-clamp-2 text-muted-foreground mb-4">
            {vendor.description}
          </p>
          
          <div className="flex flex-wrap gap-1.5">
            {vendor.services.split(',').slice(0, 3).map((service, i) => (
              <Badge variant="secondary" key={i} className="text-xs font-normal">
                {service.trim()}
              </Badge>
            ))}
            {vendor.services.split(',').length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{vendor.services.split(',').length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 border-t bg-muted/20 px-6 py-4 flex gap-2">
          <Button variant="outline" className="flex-1 bg-background" onClick={() => setDetailsOpen(true)}>
            View Details
          </Button>
          <Button className="flex-1 gap-2" asChild>
            <a href={`tel:${vendor.phone}`}>
              <Phone className="h-4 w-4" /> Call
            </a>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                  {vendor.logo || vendor.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {vendor.name}
                  {vendor.verified && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </DialogTitle>
                <p className="text-muted-foreground text-lg">{vendor.category}</p>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => toggleSaved(vendor.id)}
              >
                {saved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-muted/10">
                <div className="text-sm text-muted-foreground mb-1">Location</div>
                <div className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {vendor.city}, {vendor.state}
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/10">
                <div className="text-sm text-muted-foreground mb-1">Rating</div>
                <div className="font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {vendor.rating ? vendor.rating.toFixed(1) : "No ratings yet"}
                  {vendor.reviewCount > 0 && <span className="text-muted-foreground font-normal">({vendor.reviewCount} reviews)</span>}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">About</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{vendor.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">Services</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.services.split(',').map((service, i) => (
                  <Badge variant="secondary" key={i} className="px-3 py-1 text-sm">
                    {service.trim()}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button className="flex-1 text-base h-12 gap-2" asChild>
                <a href={`tel:${vendor.phone}`}>
                  <Phone className="h-5 w-5" /> {vendor.phone}
                </a>
              </Button>
              {vendor.whatsapp && (
                <Button className="flex-1 text-base h-12 gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white" asChild>
                  <a href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
              )}
            </div>

            <VendorReviews vendorId={vendor.id} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const reviewSchema = z.object({
  reviewerName: z.string().min(2, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters")
});

function VendorReviews({ vendorId }: { vendorId: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createReview = useCreateReview();
  
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      reviewerName: "",
      rating: 5,
      comment: ""
    }
  });

  const { data: reviews, isLoading } = useGetVendorReviews(vendorId, {
    query: { enabled: !!vendorId, queryKey: getGetVendorReviewsQueryKey(vendorId) }
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    createReview.mutate(
      { id: vendorId, data: values },
      {
        onSuccess: () => {
          toast({ title: "Review submitted!" });
          queryClient.invalidateQueries({ queryKey: getGetVendorReviewsQueryKey(vendorId) });
          form.reset();
        },
        onError: () => {
          toast({ title: "Failed to submit review", variant: "destructive" });
        }
      }
    );
  }

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  return (
    <div className="pt-6 border-t space-y-8">
      <div>
        <h4 className="font-semibold text-lg mb-4">Write a Review</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="reviewerName" render={({field}) => (
                <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
              )}/>
              <FormField control={form.control} name="rating" render={({field}) => (
                <FormItem><FormLabel>Rating (1-5)</FormLabel><FormControl><Input type="number" min="1" max="5" {...field}/></FormControl><FormMessage/></FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="comment" render={({field}) => (
              <FormItem><FormLabel>Review</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>
            )}/>
            <Button type="submit" disabled={createReview.isPending}>
              {createReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-4">
          Reviews ({reviews?.length || 0})
        </h4>
        
        {!reviews || reviews.length === 0 ? (
          <p className="text-muted-foreground italic">No reviews yet for this vendor.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.reviewerName}</span>
                  <div className="flex items-center text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-primary' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
