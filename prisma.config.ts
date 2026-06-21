import 'dotenv/config'
import { defineConfig } from '@prisma/config'

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL

export default defineConfig({
  engine: 'classic',
  datasource: {
    url: databaseUrl ?? 'postgresql://user:password@localhost:5432/asa_unik',
  },
})
