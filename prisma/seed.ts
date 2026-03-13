import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Inserindo dados de teste...');

  // Criar promoções de teste
  const promotions = [
    {
      title: 'Smart TV 50" 4K UHD',
      description: 'Smart TV com tecnologia 4K e HDR',
      storeName: 'Loja Exemplo',
      imageUrl: 'https://example.com/tv.jpg',
      productUrl: 'https://example.com/tv',
      oldPrice: 2999.90,
      newPrice: 1899.90,
      discountPercent: 37,
      type: 'online',
      source: 'mercadolivre',
      sourceItemId: 'MLB123456',
      category: 'eletronicos',
      city: 'São Paulo',
      state: 'SP',
      isFeatured: true,
      isActive: true,
    },
    {
      title: 'Notebook Gamer 16GB RAM',
      description: 'Notebook para jogos e trabalho',
      storeName: 'Tech Store',
      imageUrl: 'https://example.com/notebook.jpg',
      productUrl: 'https://example.com/notebook',
      oldPrice: 4500.00,
      newPrice: 3200.00,
      discountPercent: 29,
      type: 'online',
      source: 'amazon',
      sourceItemId: 'AMZ789012',
      category: 'informatica',
      city: 'Rio de Janeiro',
      state: 'RJ',
      isFeatured: false,
      isActive: true,
    },
    {
      title: 'Pizza Grande + Refrigerante',
      description: 'Promoção válida de segunda a quinta',
      storeName: 'Pizzaria do Bairro',
      imageUrl: 'https://example.com/pizza.jpg',
      productUrl: 'https://pizzaria.com/promo',
      oldPrice: 65.00,
      newPrice: 45.90,
      discountPercent: 29,
      type: 'local',
      source: 'local',
      sourceItemId: 'LOCAL001',
      category: 'alimentacao',
      city: 'Itanhaém',
      state: 'SP',
      isFeatured: true,
      isActive: true,
      expiresAt: new Date('2026-03-20'),
    },
    {
      title: 'Fone Bluetooth Premium',
      description: 'Cancelamento de ruído ativo',
      storeName: 'Audio Shop',
      imageUrl: 'https://example.com/fone.jpg',
      productUrl: 'https://example.com/fone',
      oldPrice: 599.00,
      newPrice: 399.00,
      discountPercent: 33,
      type: 'online',
      source: 'shopee',
      sourceItemId: 'SHP345678',
      category: 'eletronicos',
      isActive: true,
    },
    {
      title: 'Promoção Expirada',
      description: 'Esta promoção já expirou',
      storeName: 'Loja Teste',
      imageUrl: 'https://example.com/expired.jpg',
      productUrl: 'https://example.com/expired',
      newPrice: 99.90,
      type: 'online',
      source: 'mercadolivre',
      sourceItemId: 'MLB999999',
      isActive: true,
      expiresAt: new Date('2026-03-01'), // Já expirada
    },
  ];

  for (const promo of promotions) {
    await prisma.promotion.create({ data: promo });
  }

  console.log(`✅ ${promotions.length} promoções inseridas`);

  // Criar log de importação
  await prisma.importLog.create({
    data: {
      source: 'seed',
      status: 'success',
      totalFetched: promotions.length,
      totalInserted: promotions.length,
      totalUpdated: 0,
      totalDisabled: 0,
      message: 'Dados de teste inseridos',
    },
  });

  console.log('✅ Log de importação criado');
}

seed()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
