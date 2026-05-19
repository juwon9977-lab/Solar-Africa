import { useParams, Link } from "wouter";
import { useGetVendor, getGetVendorQueryKey, useGetVendorReviews, getGetVendorReviewsQueryKey, useCreateReview } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, MapPin, Phone, Star, Bookmark, BookmarkCheck, ArrowLeft, MessageCircle } from "lucide-react";
import { useSavedVendors } from "@/lib/saved";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const reviewSchema = z.object({
  reviewerName: z.string().min(2, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vendorId = parseInt(id ?? "0", 10);
  const { isSaved, toggleSaved } = useSavedVendors();
  const saved = isSaved(vendorId);

  const { data: vendor, isLoading, isError } = useGetVendor(vendorId, {
    query: { enabled: !!vendorId, queryKey: getGetVendorQueryKey(vendorId) },
  });

  const { data: reviews, isLoading: reviewsLoading } = useGetVendorReviews(vendorId, {
    query: { enabled: !!vendorId, queryKey: getGetVendorReviewsQueryKey(vendorId) },
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createReview = useCreateReview();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { reviewerName: "", rating: 5, comment: "" },
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    createReview.mutate(
      { id: vendorId, data: values },
      {
        onSuccess: () => {
          toast({ title: "Review submitted. Thank you!" });
          queryClient.invalidateQueries({ queryKey: getGetVendorReviewsQueryKey(vendorId) });
          queryClient.invalidateQueries({ queryKey: getGetVendorQueryKey(vendorId) });
          form.reset();
        },
        onError: () => {
          toast({ title: "Failed to submit review", variant: "destructive" });
        },
      }
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-6">
          <Skeleton className="h-24 w-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !vendor) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-3">Vendor not found</h2>
        <p className="text-muted-foreground mb-6">This vendor listing may have been removed or the link is incorrect.</p>
        <Button asChild>
          <Link href="/">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  const whatsappNumber = vendor.whatsapp.replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8" data-testid="link-back-directory">
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>

        {/* Header */}
        <div className="bg-card border rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20 border-2 border-primary/20 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {vendor.logo || vendor.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-vendor-name">
                  {vendor.name}
                </h1>
                {vendor.verified && (
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-medium" data-testid="badge-verified">
                    <CheckCircle2 className="h-4 w-4" /> Verified
                  </span>
                )}
                {vendor.featured && (
                  <Badge className="text-xs" data-testid="badge-featured">Featured</Badge>
                )}
              </div>

              <p className="text-muted-foreground text-lg mb-4">{vendor.category}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  {vendor.city}, {vendor.state}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">
                    {vendor.rating ? vendor.rating.toFixed(1) : "No rating"}
                  </span>
                  {vendor.reviewCount > 0 && (
                    <span>({vendor.reviewCount} {vendor.reviewCount === 1 ? "review" : "reviews"})</span>
                  )}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full shrink-0"
              onClick={() => toggleSaved(vendor.id)}
              data-testid="button-save-vendor"
            >
              {saved
                ? <BookmarkCheck className="h-5 w-5 text-primary fill-primary/20" />
                : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 h-12 text-base gap-2" asChild data-testid="button-call-vendor">
              <a href={`tel:${vendor.phone}`}>
                <Phone className="h-5 w-5" /> {vendor.phone}
              </a>
            </Button>
            {whatsappNumber && (
              <Button
                className="flex-1 h-12 text-base gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-0"
                asChild
                data-testid="button-whatsapp-vendor"
              >
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* About */}
          <div className="md:col-span-2 bg-card border rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{vendor.description}</p>
          </div>

          {/* Services */}
          <div className="bg-card border rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Services</h2>
            <div className="flex flex-wrap gap-2">
              {vendor.services.split(",").map((service, i) => (
                <Badge variant="secondary" key={i} className="px-3 py-1">
                  {service.trim()}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-card border rounded-2xl p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Reviews
              {reviews && reviews.length > 0 && (
                <span className="text-muted-foreground font-normal text-base ml-2">({reviews.length})</span>
              )}
            </h2>

            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
              </div>
            ) : !reviews || reviews.length === 0 ? (
              <p className="text-muted-foreground italic mb-6">No reviews yet. Be the first to review this vendor.</p>
            ) : (
              <div className="space-y-4 mb-8">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl border bg-muted/20" data-testid={`card-review-${review.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.reviewerName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {new Date(review.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="reviewerName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Chukwuemeka Obi" {...field} data-testid="input-reviewer-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (1–5)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="5" {...field} data-testid="input-rating" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="comment" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell others about your experience with this vendor..."
                        className="resize-none"
                        rows={4}
                        {...field}
                        data-testid="textarea-comment"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={createReview.isPending} className="h-11 px-6" data-testid="button-submit-review">
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
