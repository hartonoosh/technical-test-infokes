import { db } from '../utils/connection';
import { buildTree } from '../utils/buildTree';

export async function getAllFolders() {
  const [rows] = await db.query(`
    SELECT 
      f.id AS folder_id,
      f.name AS folder_name,
      f.parent_id,
      fi.id AS file_id,
      fi.name AS file_name
    FROM folders f
    LEFT JOIN files fi ON fi.folder_id = f.id
    ORDER BY f.parent_id, f.id, fi.id
  `) as [any[], any];

  const map = new Map<number, any>();

  rows.forEach(r => {
    if (!map.has(r.folder_id)) {
      map.set(r.folder_id, {
        id          : r.folder_id,
        name        : r.folder_name,
        parent_id   : r.parent_id,
        open        : false,
        children    : [],
        files       : []
      });
    }

    if (r.file_id) {
      map.get(r.folder_id)?.files.push({
        id  : r.file_id,
        name: r.file_name
      });
    }
  });

  return buildTree(Array.from(map.values()));
}

export async function getSubfolders(parentId: number) {
  const [rows] = await db.query('SELECT * FROM folders WHERE parent_id = ?', [parentId]);
  return rows;
}

export async function getFilesInFolder(folderId: number) {
  const [rows] = await db.query('SELECT * FROM files WHERE folder_id = ?', [folderId]);
  return rows;
}

export async function createFolder(name: string, parentId: number | null = null) {
  const [result]: any = await db.query(
    'INSERT INTO folders (name, parent_id) VALUES (?, ?)',
    [name, parentId]
  );

  const [rows]: any = await db.query('SELECT * FROM folders WHERE id = ?', [result.insertId]);
  return rows[0];
}
