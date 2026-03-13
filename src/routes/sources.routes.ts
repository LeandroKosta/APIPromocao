import { Router } from 'express';
import { providers } from '../providers';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const sources = providers.map(p => ({
      name: p.name,
      displayName: p.displayName,
      isConfigured: p.isConfigured(),
      isActive: p.isConfigured()
    }));
    res.json({ success: true, data: sources });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
