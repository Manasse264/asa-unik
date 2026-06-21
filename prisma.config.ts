import 'dotenv/config'
import { defineConfig } from '@prisma/config'

const databaseUrl = process.env.DATABASE_URL

export default defineConfig({
  engine: 'classic',
  datasource: {
    url: databaseUrl ?? 'postgresql://user:password@localhost:5432/asa_unik',
  },
})
