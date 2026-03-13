import { PrismaClient } from '@prisma/client';
import { StandardPromotion } from '../types/promotion';
import { PromotionMapper } from '../mappers/promotion.mapper';
import { PromotionListResponseDTO, PromotionDTO } from '../dtos/promotion.dto';

const prisma = new PrismaClient();

export class PromotionService {
  async getAll(filters?: {
    category?: string;
    city?: string;
    source?: string;
    type?: 'local' | 'online';
    isActive?: boolean;
    isFeatured?: boolean;
    orderBy?: 'discount' | 'recent' | 'price';
    page?: number;
    limit?: number;
  }): Promise<PromotionListResponseDTO> {
    const where: any = {};
    
    if (filters?.category) where.category = filters.category;
    if (filters?.city) where.city = filters.city;
    if (filters?.source) where.source = filters.source;
    if (filters?.type) where.type = filters.type;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.isFeatured !== undefined) where.isFeatured = filters.isFeatured;

    let orderBy: any = { createdAt: 'desc' };
    if (filters?.orderBy === 'discount') orderBy = { discountPercent: 'desc' };
    if (filters?.orderBy === 'recent') orderBy = { importedAt: 'desc' };
    if (filters?.orderBy === 'price') orderBy = { newPrice: 'asc' };

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      prisma.promotion.count({ where })
    ]);

    return PromotionMapper.toPaginatedResponse(promotions, page, limit, total);
  }

  async getById(id: string): Promise<PromotionDTO | null> {
    const promotion = await prisma.promotion.findUnique({ where: { id } });
    return promotion ? PromotionMapper.toDTO(promotion) : null;
  }

  async getFeatured(limit = 10): Promise<PromotionDTO[]> {
    const promotions = await prisma.promotion.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { discountPercent: 'desc' },
      take: limit
    });
    return PromotionMapper.toDTOList(promotions);
  }

  async upsertPromotion(data: StandardPromotion) {
    return prisma.promotion.upsert({
      where: {
        source_sourceItemId: {
          source: data.source,
          sourceItemId: data.sourceItemId
        }
      },
      update: {
        ...data,
        updatedAt: new Date()
      },
      create: data
    });
  }

  async disableExpired() {
    const result = await prisma.promotion.updateMany({
      where: {
        isActive: true,
        expiresAt: { lt: new Date() }
      },
      data: { isActive: false }
    });
    return result.count;
  }
}
