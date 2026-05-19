import { useGetBlogPost, getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useGetBlogPost(slug || "", {
    query: { 
      enabled: !!slug,
      queryKey: getGetBlogPostQueryKey(slug || "")
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <Button variant="ghost" asChild className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
        <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to all articles</Link>
      </Button>

      <div className="flex gap-2 mb-6">
        {post.tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">{tag}</Badge>
        ))}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-10 pb-8 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span className="font-medium text-foreground">{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{post.readMinutes} min read</span>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
        <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
      </div>

      <div className="mt-16 pt-8 border-t">
        <div className="bg-muted/30 rounded-xl p-8 text-center">
          <h3 className="font-semibold text-xl mb-2">Looking for solar experts?</h3>
          <p className="text-muted-foreground mb-6">Browse our directory of verified installers and suppliers in Nigeria.</p>
          <Button asChild size="lg">
            <Link href="/">Search Directory</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
