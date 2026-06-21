import prisma from "./lib/prisma.ts";

async function main() {
  try {
    const user = await prisma.user.findMany();
    console.log("User count:", user.length);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
