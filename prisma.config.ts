import 'dotenv/config'
import { defineConfig } from '@prisma/config'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables.')
}

export default defineConfig({
  engine: 'classic',
  datasource: {
    url: databaseUrl,
  },
})
