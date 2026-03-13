import { BaseProvider } from './base.provider';
import { StandardPromotion } from '../types/promotion';

export class ShopeeProvider extends BaseProvider {
  name = 'shopee';
  displayName = 'Shopee';

  isConfigured(): boolean {
    return false;
  }

  async authenticate(): Promise<void> {
    throw new Error('Shopee provider not implemented yet');
  }

  async fetchPromotions(): Promise<StandardPromotion[]> {
    return [];
  }
}
