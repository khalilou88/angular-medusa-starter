export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  is_giftcard: boolean;
  status: string;
  images: ProductImage[];
  thumbnail?: string;
  options: ProductOption[];
  variants: ProductVariant[];
  categories?: ProductCategory[];
  collection?: ProductCollection;
  tags?: ProductTag[];
  type?: ProductType;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  metadata?: any;
}

export interface ProductVariant {
  id: string;
  title: string;
  product_id: string;
  sku?: string;
  barcode?: string;
  ean?: string;
  upc?: string;
  variant_rank?: number;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  options: ProductOptionValue[];
  prices: MoneyAmount[];
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  id: string;
  title: string;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: string;
  value: string;
  option_id: string;
  variant_id: string;
}

export interface MoneyAmount {
  id: string;
  currency_code: string;
  amount: number;
  variant_id: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
}

export interface ProductCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
}

export interface ProductTag {
  id: string;
  value: string;
}

export interface ProductType {
  id: string;
  value: string;
}
