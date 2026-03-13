import { StandardPromotion } from '../types/promotion';

export abstract class BaseProvider {
  abstract name: string;
  abstract displayName: string;

  abstract authenticate(): Promise<void>;
  abstract fetchPromotions(): Promise<StandardPromotion[]>;
  abstract isConfigured(): boolean;

  protected calculateDiscount(oldPrice?: number, newPrice?: number): number | undefined {
    if (!oldPrice || !newPrice || oldPrice <= newPrice) return undefined;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  }

  protected sanitizePrice(price: any): number {
    const parsed = parseFloat(String(price).replace(/[^\d.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
}
