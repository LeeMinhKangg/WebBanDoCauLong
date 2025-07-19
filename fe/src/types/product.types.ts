// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  thumbnail: string;
  images: string[];
  description: string;
  shortDescription?: string;
  categoryId: string;
  categoryName: string;
  stock: number;
  ratings?: {
    average: number;
    count: number;
  };
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  images?: string[];
}

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  values: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
  brand?: string[];
  color?: string[];
  size?: string[];
  [key: string]: any; // For dynamic attribute filters
}
