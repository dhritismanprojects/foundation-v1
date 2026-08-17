import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/authentication/infrastructure/persistence/UserSchema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});