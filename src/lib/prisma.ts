import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let dbUrl = process.env.DATABASE_URL;

// On Vercel Serverless Functions, the filesystem is read-only except /tmp.
// For SQLite, we copy the seeded dev.db to /tmp/dev.db on cold start so both reads and writes succeed.
if (process.env.VERCEL && (!dbUrl || dbUrl.startsWith('file:'))) {
  const tmpDbPath = '/tmp/dev.db';
  dbUrl = `file:${tmpDbPath}`;

  try {
    if (!fs.existsSync(tmpDbPath)) {
      const candidatePaths = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
        path.resolve('./prisma/dev.db'),
        path.resolve('./dev.db'),
      ];

      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          fs.copyFileSync(p, tmpDbPath);
          console.log(`[Vercel Serverless] Seeded SQLite database copied from ${p} to ${tmpDbPath}`);
          break;
        }
      }
    }
  } catch (error) {
    console.warn('[Vercel Serverless] Notice: could not copy dev.db to /tmp:', error);
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
