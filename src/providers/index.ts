import { BaseProvider } from './base.provider';
import { MercadoLivreProvider } from './mercadolivre.provider';
import { AmazonProvider } from './amazon.provider';
import { ShopeeProvider } from './shopee.provider';

export const providers: BaseProvider[] = [
  new MercadoLivreProvider(),
  new AmazonProvider(),
  new ShopeeProvider()
];

export function getProvider(name: string): BaseProvider | undefined {
  return providers.find(p => p.name === name);
}

export function getActiveProviders(): BaseProvider[] {
  return providers.filter(p => p.isConfigured());
}
