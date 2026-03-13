import { Router } from 'express';
import { ImportService } from '../services/import.service';
import { getProvider, getActiveProviders } from '../providers';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const importService = new ImportService();

router.post('/import', authMiddleware, async (req, res) => {
  try {
    const { source } = req.body;

    if (source) {
      const provider = getProvider(source);
      if (!provider) {
        return res.status(404).json({ success: false, error: 'Provider not found' });
      }
      if (!provider.isConfigured()) {
        return res.status(400).json({ success: false, error: 'Provider not configured' });
      }
      const result = await importService.importFromProvider(provider);
      return res.json({ success: true, data: result });
    }

    const providers = getActiveProviders();
    const results = await importService.importAll(providers);
    res.json({ success: true, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/cleanup', authMiddleware, async (req, res) => {
  try {
    const promotionService = new (await import('../services/promotion.service')).PromotionService();
    const count = await promotionService.disableExpired();
    res.json({ success: true, message: `${count} promotions disabled` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const source = req.query.source as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const logs = await importService.getLogs(source, limit);
    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
