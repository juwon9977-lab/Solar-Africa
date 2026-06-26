export interface Vendor {
  id: number;
  name: string;
  category: string;
  state: string;
  city: string;
  phone: string;
  whatsapp: string;
  services: string;
  description: string;
  logo: string;
  verified: boolean;
  featured: boolean;
  /** @nullable */
  rating?: number | null;
  reviewCount: number;
  createdAt: string;
}
