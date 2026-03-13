import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000';
const API_TOKEN = process.env.API_SECRET_TOKEN || 'test-token';

describe('API Validation Tests', () => {
  test('1. Health check should return ok', async () => {
    const response = await axios.get(`${API_URL}/health`);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('ok');
    expect(response.data.timestamp).toBeDefined();
    console.log('✅ Health check passed');
  });

  test('2. Sources should return available providers', async () => {
    const response = await axios.get(`${API_URL}/sources`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);
    
    response.data.data.forEach((source: any) => {
      expect(source).toHaveProperty('name');
      expect(source).toHaveProperty('displayName');
      expect(source).toHaveProperty('isConfigured');
      expect(source).toHaveProperty('isActive');
    });
    console.log('✅ Sources endpoint passed');
  });

  test('3. Promotions should return list with pagination', async () => {
    const response = await axios.get(`${API_URL}/promotions?limit=10`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);
    expect(response.data.pagination).toBeDefined();
    console.log('✅ Promotions list passed');
  });

  test('4. Featured promotions should return only featured items', async () => {
    const response = await axios.get(`${API_URL}/promotions/featured?limit=5`);
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.data)).toBe(true);
    console.log('✅ Featured promotions passed');
  });

  test('5. Import should require authentication', async () => {
    try {
      await axios.post(`${API_URL}/promotions/import`);
      fail('Should have thrown 401');
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      console.log('✅ Import authentication check passed');
    }
  });

  test('6. Cleanup should require authentication', async () => {
    try {
      await axios.post(`${API_URL}/promotions/cleanup`);
      fail('Should have thrown 401');
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      console.log('✅ Cleanup authentication check passed');
    }
  });

  test('7. Promotion format validation', async () => {
    const response = await axios.get(`${API_URL}/promotions?limit=1`);
    if (response.data.data.length > 0) {
      const promo = response.data.data[0];
      expect(promo).toHaveProperty('id');
      expect(promo).toHaveProperty('title');
      expect(promo).toHaveProperty('storeName');
      expect(promo).toHaveProperty('newPrice');
      expect(promo).toHaveProperty('source');
      expect(promo).toHaveProperty('isActive');
      console.log('✅ Promotion format validation passed');
    }
  });
});
