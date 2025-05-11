import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    // @ts-expect-error TODO: Remove this once drizzle-kit is updated
    journal: 'database',
  },
});
