import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_TOKEN = process.env.API_SECRET_TOKEN || 'test-token';

describe('API Complete Validation Tests', () => {
  
  describe('1. Health and Basic Endpoints', () => {
    test('GET /health should return ok', async () => {
      const response = await axios.get(`${API_URL}/health`);
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('ok');
      expect(response.data.timestamp).toBeDefined();
    });

    test('GET /sources should return available providers', async () => {
      const response = await axios.get(`${API_URL}/sources`);
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      
      if (response.data.data.length > 0) {
        const source = response.data.data[0];
        expect(source).toHaveProperty('name');
        expect(source).toHaveProperty('displayName');
        expect(source).toHaveProperty('isConfigured');
        expect(source).toHaveProperty('isActive');
      }
    });
  });

  describe('2. Promotions Endpoints - DTO Format', () => {
    test('GET /promotions should return paginated list with correct DTO format', async () => {
      const response = await axios.get(`${API_URL}/promotions?limit=10`);
      expect(response.status).toBe(200);
      
      // Validar estrutura da resposta
      expect(response.data).toHaveProperty('data');
      expect(response.data).toHaveProperty('pagination');
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Validar paginação
      const pagination = response.data.pagination;
      expect(pagination).toHaveProperty('page');
      expect(pagination).toHaveProperty('limit');
      expect(pagination).toHaveProperty('total');
      expect(pagination).toHaveProperty('totalPages');
      expect(pagination).toHaveProperty('hasNext');
      expect(pagination).toHaveProperty('hasPrev');
      expect(typeof pagination.hasNext).toBe('boolean');
      expect(typeof pagination.hasPrev).toBe('boolean');
    });

    test('GET /promotions should return promotions with correct DTO fields', async () => {
      const response = await axios.get(`${API_URL}/promotions?limit=1`);
      
      if (response.data.data.length > 0) {
        const promo = response.data.data[0];
        
        // Campos obrigatórios
        expect(promo).toHaveProperty('id');
        expect(promo).toHaveProperty('title');
        expect(promo).toHaveProperty('storeName');
        expect(promo).toHaveProperty('newPrice');
        expect(promo).toHaveProperty('type');
        expect(promo).toHaveProperty('source');
        expect(promo).toHaveProperty('location');
        expect(promo).toHaveProperty('isFeatured');
        expect(promo).toHaveProperty('createdAt');
        
        // Validar tipos
        expect(typeof promo.id).toBe('string');
        expect(typeof promo.title).toBe('string');
        expect(typeof promo.storeName).toBe('string');
        expect(typeof promo.newPrice).toBe('number');
        expect(['local', 'online']).toContain(promo.type);
        expect(typeof promo.source).toBe('string');
        expect(typeof promo.isFeatured).toBe('boolean');
        
        // Validar location
        expect(promo.location).toHaveProperty('city');
        expect(promo.location).toHaveProperty('state');
        
        // Validar formato de data ISO 8601
        expect(promo.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      }
    });

    test('GET /promotions/featured should return only featured promotions', async () => {
      const response = await axios.get(`${API_URL}/promotions/featured?limit=5`);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(Array.isArray(response.data.data)).toBe(true);
      
      // Todas devem ser featured
      response.data.data.forEach((promo: any) => {
        expect(promo.isFeatured).toBe(true);
      });
    });
  });

  describe('3. Filters and Pagination', () => {
    test('GET /promotions?type=online should filter by type', async () => {
      const response = await axios.get(`${API_URL}/promotions?type=online&limit=5`);
      expect(response.status).toBe(200);
      
      response.data.data.forEach((promo: any) => {
        expect(promo.type).toBe('online');
      });
    });

    test('GET /promotions?type=local should filter by type', async () => {
      const response = await axios.get(`${API_URL}/promotions?type=local&limit=5`);
      expect(response.status).toBe(200);
      
      response.data.data.forEach((promo: any) => {
        expect(promo.type).toBe('local');
      });
    });

    test('Pagination should work correctly', async () => {
      const page1 = await axios.get(`${API_URL}/promotions?page=1&limit=5`);
      const page2 = await axios.get(`${API_URL}/promotions?page=2&limit=5`);
      
      expect(page1.data.pagination.page).toBe(1);
      expect(page2.data.pagination.page).toBe(2);
      
      if (page1.data.data.length > 0 && page2.data.data.length > 0) {
        expect(page1.data.data[0].id).not.toBe(page2.data.data[0].id);
      }
    });

    test('orderBy=discount should order by discount', async () => {
      const response = await axios.get(`${API_URL}/promotions?orderBy=discount&limit=10`);
      expect(response.status).toBe(200);
      
      const discounts = response.data.data
        .filter((p: any) => p.discountPercent !== null)
        .map((p: any) => p.discountPercent);
      
      if (discounts.length > 1) {
        for (let i = 0; i < discounts.length - 1; i++) {
          expect(discounts[i]).toBeGreaterThanOrEqual(discounts[i + 1]);
        }
      }
    });

    test('orderBy=price should order by price', async () => {
      const response = await axios.get(`${API_URL}/promotions?orderBy=price&limit=10`);
      expect(response.status).toBe(200);
      
      const prices = response.data.data.map((p: any) => p.newPrice);
      
      if (prices.length > 1) {
        for (let i = 0; i < prices.length - 1; i++) {
          expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
      }
    });
  });

  describe('4. Authentication', () => {
    test('POST /promotions/import should require authentication', async () => {
      try {
        await axios.post(`${API_URL}/promotions/import`);
        fail('Should have thrown 401');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    test('POST /promotions/cleanup should require authentication', async () => {
      try {
        await axios.post(`${API_URL}/promotions/cleanup`);
        fail('Should have thrown 401');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    test('GET /promotions/logs should require authentication', async () => {
      try {
        await axios.get(`${API_URL}/promotions/logs`);
        fail('Should have thrown 401');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });

    test('POST /promotions/import with valid token should work', async () => {
      try {
        const response = await axios.post(
          `${API_URL}/promotions/import`,
          {},
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        );
        expect([200, 500]).toContain(response.status);
      } catch (error: any) {
        // Pode falhar por falta de credenciais dos providers, mas não deve ser 401
        expect(error.response.status).not.toBe(401);
      }
    });
  });

  describe('5. Error Handling', () => {
    test('GET /promotions/:id with invalid ID should return 404', async () => {
      try {
        await axios.get(`${API_URL}/promotions/invalid-uuid-123`);
        fail('Should have thrown 404');
      } catch (error: any) {
        expect([404, 500]).toContain(error.response.status);
      }
    });

    test('GET /invalid-route should return 404', async () => {
      try {
        await axios.get(`${API_URL}/invalid-route`);
        fail('Should have thrown 404');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });
});
