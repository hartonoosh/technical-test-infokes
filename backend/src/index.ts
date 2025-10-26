import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { urlRoutes } from './routes/index';
import { config } from "dotenv";

const envFile = process.env.ENV === "test" ? ".env.test" : ".env";
config({ path: envFile });

const PORT = Number(process.env.APP_PORT) || 3000;

const app = new Elysia()
  .use(cors())
  .use(urlRoutes)
  .listen(PORT);

console.log(`Server running at http://localhost:3000`);
