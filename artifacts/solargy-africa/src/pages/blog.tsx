import { useListBlogPosts, getListBlogPostsQueryKey } from "@/lib/api-client";
import { Link } from "wouter";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const { data: posts, isLoading } = useListBlogPosts({}, {
    query: { queryKey: getListBlogPostsQueryKey({}) }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Solar Knowledge Hub</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Expert guides, industry news, and practical tips for navigating the solar landscape in Nigeria.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full hover-elevate transition-all border-border hover:border-primary/50 cursor-pointer group flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{tag}</Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">{post.title}</h2>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {post.readMinutes} min read
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
