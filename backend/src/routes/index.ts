import { Elysia } from 'elysia';
import { getAllFolders, getSubfolders, getFilesInFolder, createFolder } from '../services/index';
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from 'node:path';
import { db } from '../utils/connection';

export const urlRoutes = (app: Elysia) =>
  app.group('/api/v1/folders', app =>
    app
      .get('/', async () => {
        const folders = await getAllFolders()
        return folders 
      })

      .get('/:id/children', async ({ params }) => {
          const children = await getSubfolders(Number(params.id));
          return children;
      })

      .get('/:id/files', async ({ params }) => {
          const files = await getFilesInFolder(Number(params.id));
          return files;
      })
      
      .post('/', async ({ body }) => {
        const { name, parent_id = null } = body as { name: string; parent_id?: number | null };

        if (!name?.trim()) {
          return new Response(JSON.stringify({ error: 'Folder name is required' }), { status: 400 });
        }

        return await createFolder(name, parent_id);
      })

      .post('/upload', async ({ request }) => {
        if (!request.body) throw new Error("No body");

        const form      = await request.formData();
        const folderId  = Number(form.get("folder_id"));
        if (!folderId) throw new Error("Missing folder_id");

        const uploadDir = path.join(process.cwd(), "uploads");
        if (!existsSync(uploadDir)) mkdirSync(uploadDir);

        const files     = form.getAll("files") as File[];
        if (!files.length) {
          return new Response(JSON.stringify({ error: 'No files uploaded' }), { status: 400 });
        }
        const saved: any[] = [];

        for (const file of files) {
          const filename= file.name;
          const filePath= path.join(uploadDir, filename);
          const buffer  = Buffer.from(await file.arrayBuffer());
          writeFileSync(filePath, buffer);

          const [result]: any = await db.query(
            "INSERT INTO files (name, folder_id) VALUES (?, ?)",
            [filename, folderId]
          );

          saved.push({ id: result.insertId, name: filename, path: filePath });
        }

        return saved;
      })
  );
