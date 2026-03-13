export interface StandardPromotion {
  title: string;
  description?: string;
  storeName: string;
  companyId?: string;
  imageUrl?: string;
  productUrl: string;
  affiliateUrl?: string;
  oldPrice?: number;
  newPrice: number;
  discountPercent?: number;
  couponCode?: string;
  type: 'local' | 'online';
  source: string;
  sourceItemId: string;
  category?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  expiresAt?: Date;
}

export interface ProviderConfig {
  name: string;
  isActive: boolean;
}

export interface ImportResult {
  source: string;
  status: 'success' | 'error' | 'partial';
  totalFetched: number;
  totalInserted: number;
  totalUpdated: number;
  totalDisabled: number;
  message?: string;
}
