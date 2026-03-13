import { Router } from 'express';
import { PromotionService } from '../services/promotion.service';

const router = Router();
const promotionService = new PromotionService();

router.get('/', async (req, res) => {
  try {
    const filters = {
      category: req.query.category as string,
      city: req.query.city as string,
      source: req.query.source as string,
      type: req.query.type as 'local' | 'online',
      isActive: req.query.isActive === 'true',
      isFeatured: req.query.isFeatured === 'true',
      orderBy: req.query.orderBy as 'discount' | 'recent' | 'price',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const result = await promotionService.getAll(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const promotions = await promotionService.getFeatured(limit);
    res.json({ data: promotions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const promotion = await promotionService.getById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ success: false, error: 'Promotion not found' });
    }
    res.json({ data: promotion });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
