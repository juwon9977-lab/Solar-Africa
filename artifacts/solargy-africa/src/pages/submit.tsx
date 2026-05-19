import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateVendor } from "@workspace/api-client-react";
import { NIGERIAN_STATES, VENDOR_CATEGORIES } from "@/lib/constants";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { CheckCircle2, Store } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  category: z.string().min(1, "Category is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  whatsapp: z.string().optional().default(""),
  services: z.string().min(5, "List at least one service (comma separated)"),
  description: z.string().min(20, "Provide a detailed description (min 20 characters)")
});

export default function SubmitPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const createVendor = useCreateVendor();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      state: "",
      city: "",
      phone: "",
      whatsapp: "",
      services: "",
      description: ""
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createVendor.mutate(
      { data: values },
      {
        onSuccess: () => {
          setSubmitted(true);
          window.scrollTo(0, 0);
        },
        onError: () => {
          toast({
            title: "Error submitting listing",
            description: "Please check your inputs and try again.",
            variant: "destructive"
          });
        }
      }
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="h-24 w-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Listing Submitted!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for adding your business to Solargy Africa. Your listing is now live in our directory and awaiting verification.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setLocation("/")} size="lg">Go to Directory</Button>
          <Button onClick={() => { setSubmitted(false); form.reset(); }} variant="outline" size="lg">Submit Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Add Your Business</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Join Nigeria's premier solar directory and connect with thousands of buyers looking for reliable solar solutions.
        </p>
      </div>

      <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Solargy Power Ltd." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VENDOR_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NIGERIAN_STATES.map(st => (
                          <SelectItem key={st} value={st}>{st}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ikeja, Wuse..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="080..." type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="080..." type="tel" {...field} />
                    </FormControl>
                    <FormDescription>For direct WhatsApp messaging</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services Provided</FormLabel>
                  <FormControl>
                    <Input placeholder="Inverter Installation, Battery Sales, Maintenance..." {...field} />
                  </FormControl>
                  <FormDescription>Comma separated list of specific services or products you offer</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell customers about your experience, warranty policies, and what sets you apart..." 
                      className="min-h-[150px] resize-y"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg h-14"
              disabled={createVendor.isPending}
            >
              {createVendor.isPending ? "Submitting..." : "Submit Listing"}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              By submitting, you agree to our verification process.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
