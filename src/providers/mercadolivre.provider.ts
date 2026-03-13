import axios from 'axios';
import { BaseProvider } from './base.provider';
import { StandardPromotion } from '../types/promotion';

export class MercadoLivreProvider extends BaseProvider {
  name = 'mercadolivre';
  displayName = 'Mercado Livre';
  private accessToken: string;
  private baseUrl = 'https://api.mercadolibre.com';

  constructor() {
    super();
    this.accessToken = process.env.MERCADOLIVRE_ACCESS_TOKEN || '';
  }

  isConfigured(): boolean {
    return !!this.accessToken;
  }

  async authenticate(): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Mercado Livre credentials not configured');
    }
  }

  async fetchPromotions(): Promise<StandardPromotion[]> {
    try {
      await this.authenticate();
      
      const response = await axios.get(`${this.baseUrl}/sites/MLB/search`, {
        params: {
          q: 'ofertas',
          limit: 50,
          sort: 'price_asc',
          official_store: 'all'
        }
      });

      return response.data.results.map((item: any) => this.mapToStandard(item));
    } catch (error) {
      console.error('Error fetching Mercado Livre promotions:', error);
      return [];
    }
  }

  private mapToStandard(item: any): StandardPromotion {
    const oldPrice = item.original_price || item.price * 1.2;
    const newPrice = this.sanitizePrice(item.price);

    return {
      title: item.title,
      description: item.title,
      storeName: item.seller?.nickname || 'Mercado Livre',
      imageUrl: item.thumbnail,
      productUrl: item.permalink,
      affiliateUrl: item.permalink,
      oldPrice: oldPrice,
      newPrice: newPrice,
      discountPercent: this.calculateDiscount(oldPrice, newPrice),
      type: 'online',
      source: this.name,
      sourceItemId: item.id,
      category: item.category_id,
      isActive: true,
      isFeatured: item.official_store_id ? true : false
    };
  }
}
