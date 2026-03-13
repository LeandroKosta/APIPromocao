import express from 'express';
import dotenv from 'dotenv';
import promotionsRoutes from './routes/promotions.routes';
import importRoutes from './routes/import.routes';
import sourcesRoutes from './routes/sources.routes';
import { startImportCron } from './cron/import.cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/promotions', promotionsRoutes);
app.use('/promotions', importRoutes);
app.use('/sources', sourcesRoutes);

if (process.env.NODE_ENV !== 'test') {
  startImportCron();
}

app.listen(PORT, () => {
  console.log(`🚀 Promotions API running on port ${PORT}`);
});

export default app;
