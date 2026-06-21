import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

// Manually load .env
const envContent = readFileSync('.env', 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim();
  process.env[key] = val;
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes('placeholder')) {
  console.error('DATABASE_URL not set properly');
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log('Connecting to Neon...');

  await sql`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" serial PRIMARY KEY NOT NULL,
      "clerk_id" text UNIQUE,
      "name" text,
      "email" text NOT NULL UNIQUE,
      "first_name" text,
      "last_name" text,
      "image_url" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )
  `;
  console.log('users table - OK');

  await sql`
    CREATE TABLE IF NOT EXISTS "posts" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" text NOT NULL,
      "content" text,
      "author_id" integer,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `;
  console.log('posts table - OK');

  await sql`
    CREATE TABLE IF NOT EXISTS "board_shares" (
      "id" serial PRIMARY KEY NOT NULL,
      "board_id" text NOT NULL,
      "email" text NOT NULL,
      "shared_by" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    )
  `;
  console.log('board_shares table - OK');

  console.log('\nAll tables created!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
