import { PrismaClient } from '@prisma/client';
import { BaseProvider } from '../providers/base.provider';
import { PromotionService } from './promotion.service';
import { ImportResult } from '../types/promotion';

const prisma = new PrismaClient();

export class ImportService {
  private promotionService = new PromotionService();

  async importFromProvider(provider: BaseProvider): Promise<ImportResult> {
    const result: ImportResult = {
      source: provider.name,
      status: 'success',
      totalFetched: 0,
      totalInserted: 0,
      totalUpdated: 0,
      totalDisabled: 0
    };

    try {
      const promotions = await provider.fetchPromotions();
      result.totalFetched = promotions.length;

      for (const promo of promotions) {
        try {
          const existing = await prisma.promotion.findUnique({
            where: {
              source_sourceItemId: {
                source: promo.source,
                sourceItemId: promo.sourceItemId
              }
            }
          });

          await this.promotionService.upsertPromotion(promo);
          
          if (existing) {
            result.totalUpdated++;
          } else {
            result.totalInserted++;
          }
        } catch (error) {
          console.error(`Error upserting promotion ${promo.sourceItemId}:`, error);
        }
      }

      result.totalDisabled = await this.promotionService.disableExpired();
      
      await this.saveLog(result);
    } catch (error: any) {
      result.status = 'error';
      result.message = error.message;
      await this.saveLog(result);
    }

    return result;
  }

  async importAll(providers: BaseProvider[]): Promise<ImportResult[]> {
    const results: ImportResult[] = [];
    
    for (const provider of providers) {
      if (provider.isConfigured()) {
        const result = await this.importFromProvider(provider);
        results.push(result);
      }
    }

    return results;
  }

  private async saveLog(result: ImportResult) {
    await prisma.importLog.create({
      data: {
        source: result.source,
        status: result.status,
        totalFetched: result.totalFetched,
        totalInserted: result.totalInserted,
        totalUpdated: result.totalUpdated,
        totalDisabled: result.totalDisabled,
        message: result.message
      }
    });
  }

  async getLogs(source?: string, limit = 20) {
    return prisma.importLog.findMany({
      where: source ? { source } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}
