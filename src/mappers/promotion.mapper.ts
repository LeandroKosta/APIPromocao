import { Promotion } from '@prisma/client';
import { PromotionDTO, PaginationDTO, PromotionListResponseDTO } from '../dtos/promotion.dto';

export class PromotionMapper {
  static toDTO(promotion: Promotion): PromotionDTO {
    return {
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      storeName: promotion.storeName,
      category: promotion.category,
      newPrice: promotion.newPrice,
      oldPrice: promotion.oldPrice,
      discountPercent: promotion.discountPercent,
      imageUrl: promotion.imageUrl,
      productUrl: promotion.productUrl,
      type: promotion.type as 'local' | 'online',
      source: promotion.source,
      location: {
        city: promotion.city,
        state: promotion.state,
      },
      isFeatured: promotion.isFeatured,
      createdAt: promotion.createdAt.toISOString(),
      expiresAt: promotion.expiresAt?.toISOString() ?? null,
    };
  }

  static toDTOList(promotions: Promotion[]): PromotionDTO[] {
    return promotions.map(this.toDTO);
  }

  static toPaginatedResponse(
    promotions: Promotion[],
    page: number,
    limit: number,
    total: number
  ): PromotionListResponseDTO {
    const totalPages = Math.ceil(total / limit);

    return {
      data: this.toDTOList(promotions),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
