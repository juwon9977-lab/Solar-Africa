import { useState, useEffect } from "react";
import { useAdminLogin, useListVendors, useAdminVerifyVendor, useAdminFeatureVendor, useAdminDeleteVendor, useListBlogPosts, useCreateBlogPost, useDeleteBlogPost, useUpdateBlogPost, getListVendorsQueryKey, getListBlogPostsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, CheckCircle2, Star, Trash2, KeyRound } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

const ADMIN_KEY_STORAGE = "solargy_admin_key";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [loginKey, setLoginKey] = useState("");
  const { toast } = useToast();
  
  const loginMutation = useAdminLogin();

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) setAdminKey(stored);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { key: loginKey } }, {
      onSuccess: (data) => {
        if (data.success) {
          localStorage.setItem(ADMIN_KEY_STORAGE, loginKey);
          setAdminKey(loginKey);
          toast({ title: "Login successful" });
        } else {
          toast({ title: "Invalid admin key", variant: "destructive" });
        }
      },
      onError: () => {
        toast({ title: "Error connecting to server", variant: "destructive" });
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey(null);
  };

  if (!adminKey) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center space-y-2 pb-8">
            <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <KeyRound className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <CardDescription>Enter your admin key to manage the directory</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Admin Key" 
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                className="h-12"
              />
              <Button type="submit" className="w-full h-12" disabled={loginMutation.isPending || !loginKey}>
                {loginMutation.isPending ? "Verifying..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>

      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="vendors" className="px-6 py-2">Vendors</TabsTrigger>
          <TabsTrigger value="blog" className="px-6 py-2">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-6">
          <VendorManager adminKey={adminKey} />
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <BlogManager adminKey={adminKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VendorManager({ adminKey }: { adminKey: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: vendors, isLoading } = useListVendors({});
  
  const verifyMut = useAdminVerifyVendor();
  const featureMut = useAdminFeatureVendor();
  const deleteMut = useAdminDeleteVendor();

  const handleAction = (mutation: any, id: number, actionName: string) => {
    mutation.mutate({ id }, {
      headers: { 'x-admin-key': adminKey },
      onSuccess: () => {
        toast({ title: `Vendor ${actionName} successfully` });
        queryClient.invalidateQueries({ queryKey: getListVendorsQueryKey() });
      },
      onError: () => {
        toast({ title: `Error ${actionName} vendor`, variant: "destructive" });
      }
    });
  };

  if (isLoading) return <div>Loading vendors...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Vendors</CardTitle>
        <CardDescription>Approve, feature, or remove directory listings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors?.map(vendor => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">
                  {vendor.name}
                  <div className="text-xs text-muted-foreground">{vendor.category}</div>
                </TableCell>
                <TableCell>{vendor.city}, {vendor.state}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {vendor.verified && <Badge variant="default" className="bg-green-500 hover:bg-green-600">Verified</Badge>}
                    {vendor.featured && <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">Featured</Badge>}
                    {!vendor.verified && !vendor.featured && <Badge variant="outline">Pending</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant={vendor.verified ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleAction(verifyMut, vendor.id, "verified status changed")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={vendor.featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAction(featureMut, vendor.id, "featured status changed")}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction(deleteMut, vendor.id, "deleted")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const blogSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  author: z.string().min(2),
  tags: z.string().min(2),
  readMinutes: z.coerce.number().min(1)
});

function BlogManager({ adminKey }: { adminKey: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: posts, isLoading } = useListBlogPosts({});
  const deleteMut = useDeleteBlogPost();
  const createMut = useCreateBlogPost();
  const updateMut = useUpdateBlogPost();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "", slug: "", excerpt: "", content: "", author: "Admin", tags: "", readMinutes: 5
    }
  });

  const onSubmit = (values: z.infer<typeof blogSchema>) => {
    const data = {
      ...values,
      tags: values.tags.split(",").map(t => t.trim())
    };
    
    if (editingPostId) {
      updateMut.mutate({ id: editingPostId, data }, {
        headers: { 'x-admin-key': adminKey },
        onSuccess: () => {
          toast({ title: "Post updated successfully" });
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
          setEditingPostId(null);
          form.reset();
        },
        onError: () => {
          toast({ title: "Failed to update post", variant: "destructive" });
        }
      });
    } else {
      createMut.mutate({ data }, {
        headers: { 'x-admin-key': adminKey },
        onSuccess: () => {
          toast({ title: "Post created successfully" });
          queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
          form.reset();
        },
        onError: () => {
          toast({ title: "Failed to create post", variant: "destructive" });
        }
      });
    }
  };

  const handleEdit = (post: any) => {
    setEditingPostId(post.id);
    form.reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      tags: post.tags.join(", "),
      readMinutes: post.readMinutes
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if(!confirm("Delete this post?")) return;
    deleteMut.mutate({ id }, {
      headers: { 'x-admin-key': adminKey },
      onSuccess: () => {
        toast({ title: "Post deleted" });
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        if (editingPostId === id) {
          setEditingPostId(null);
          form.reset();
        }
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{editingPostId ? "Edit Post" : "Create New Post"}</CardTitle>
          {editingPostId && (
            <Button variant="ghost" size="sm" onClick={() => { setEditingPostId(null); form.reset(); }} className="-mt-2 mb-2 w-fit">
              Cancel Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({field}) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="slug" render={({field}) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="author" render={({field}) => (
                <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="readMinutes" render={({field}) => (
                <FormItem><FormLabel>Read Time (mins)</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="tags" render={({field}) => (
                <FormItem><FormLabel>Tags (comma separated)</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="excerpt" render={({field}) => (
                <FormItem><FormLabel>Excerpt</FormLabel><FormControl><Textarea {...field}/></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({field}) => (
                <FormItem><FormLabel>Content (HTML/Text)</FormLabel><FormControl><Textarea className="min-h-[200px]" {...field}/></FormControl></FormItem>
              )} />
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending} className="w-full">
                {editingPostId ? "Update Post" : "Create Post"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <div>Loading...</div> : (
            <div className="space-y-4">
              {posts?.map(post => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{post.title}</h4>
                    <p className="text-sm text-muted-foreground">{format(new Date(post.publishedAt), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
