import dotenv from "dotenv";
dotenv.config({ path: "C:/Users/Usuario/Desktop/APIPromocao/.env" });
console.log("DATABASE_URL:", process.env.DATABASE_URL);
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.promotion.count({ where: { isActive: true } }).then(n => { console.log("Ativas no banco:", n); p.$disconnect(); }).catch(e => { console.error(e.message); p.$disconnect(); });
