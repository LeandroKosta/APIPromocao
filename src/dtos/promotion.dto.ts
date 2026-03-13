export interface PromotionDTO {
  id: string;
  title: string;
  description: string | null;
  storeName: string;
  category: string | null;
  newPrice: number;
  oldPrice: number | null;
  discountPercent: number | null;
  imageUrl: string | null;
  productUrl: string;
  type: 'local' | 'online';
  source: string;
  location: {
    city: string | null;
    state: string | null;
  };
  isFeatured: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PromotionListResponseDTO {
  data: PromotionDTO[];
  pagination: PaginationDTO;
}
