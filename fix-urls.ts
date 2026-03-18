import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const fixes = [
    { sourceItemId: "MLB123456", productUrl: "https://www.mercadolivre.com.br/smart-tvs", isFeatured: true },
    { sourceItemId: "AMZ789012", productUrl: "https://www.amazon.com.br/s?k=notebook+gamer", isFeatured: true },
    { sourceItemId: "LOCAL001",  productUrl: "https://www.ifood.com.br", isFeatured: true },
    { sourceItemId: "SHP345678", productUrl: "https://shopee.com.br/search?keyword=fone+bluetooth", isFeatured: true },
    { sourceItemId: "MLB999999", productUrl: "https://www.mercadolivre.com.br", isFeatured: false },
  ];
  for (const f of fixes) {
    const r = await prisma.promotion.updateMany({ where: { sourceItemId: f.sourceItemId }, data: { productUrl: f.productUrl, isFeatured: f.isFeatured } });
    console.log("OK", f.sourceItemId, r.count);
  }
  const expired = await prisma.promotion.updateMany({ where: { expiresAt: { lt: new Date() }, isActive: true }, data: { isActive: false } });
  console.log("Expiradas desativadas:", expired.count);
  await prisma.$disconnect();
}
main().catch(console.error);
