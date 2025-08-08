import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.rateSnapshot.createMany({ data: [
    { lender: "Sample Lender A", termMonths: 60, rateAPR: 5.29 },
    { lender: "Sample Lender B", termMonths: 36, rateAPR: 5.09 }
  ]});
}
main().catch(e=>{console.error(e); process.exit(1);}).finally(()=>prisma.$disconnect());
