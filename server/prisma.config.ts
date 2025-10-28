// Load environment variables from .env when this config is loaded by the Prisma CLI.
// When a TypeScript Prisma config exists, the CLI will skip automatic .env loading
// — importing dotenv here ensures `env("DATABASE_URL")` works when running
// `prisma` commands from the project root.
import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
