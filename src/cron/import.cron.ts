import cron from 'node-cron';
import { ImportService } from '../services/import.service';
import { getActiveProviders } from '../providers';

const importService = new ImportService();

export function startImportCron() {
  cron.schedule('0 3 * * *', async () => {
    console.log('Starting scheduled import...');
    try {
      const providers = getActiveProviders();
      const results = await importService.importAll(providers);
      console.log('Import completed:', results);
    } catch (error) {
      console.error('Error in scheduled import:', error);
    }
  });

  cron.schedule('0 */6 * * *', async () => {
    console.log('Starting cleanup...');
    try {
      const promotionService = new (await import('../services/promotion.service')).PromotionService();
      const count = await promotionService.disableExpired();
      console.log(`Cleanup completed: ${count} promotions disabled`);
    } catch (error) {
      console.error('Error in cleanup:', error);
    }
  });

  console.log('Cron jobs started');
}
