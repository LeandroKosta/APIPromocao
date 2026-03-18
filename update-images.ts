import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const updates = [
    { sourceItemId: "MLB123456", imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
    { sourceItemId: "AMZ789012", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    { sourceItemId: "SHP345678", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { sourceItemId: "LOCAL001",  imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
  ];
  for (const u of updates) {
    const r = await prisma.promotion.updateMany({ where: { sourceItemId: u.sourceItemId }, data: { imageUrl: u.imageUrl } });
    console.log("OK", u.sourceItemId, r.count);
  }
  await prisma.$disconnect();
}
main().catch(console.error);