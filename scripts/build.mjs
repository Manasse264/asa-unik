import { execSync } from "node:child_process";

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL ??
  "";

const hasHostedDatabase =
  databaseUrl &&
  !databaseUrl.includes("localhost") &&
  !databaseUrl.includes("127.0.0.1");

execSync("npx prisma generate", { stdio: "inherit" });

if (hasHostedDatabase) {
  execSync("npx prisma db push", { stdio: "inherit" });
} else {
  console.log("Skipping prisma db push because no hosted database URL is configured.");
}

execSync("npx next build", { stdio: "inherit" });
