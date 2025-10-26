import { describe, it, expect, beforeAll } from "bun:test";
import { db } from "../../src/utils/connection";
import { getAllFolders, getSubfolders, getFilesInFolder, createFolder } from "../../src/services";

describe("Folder Services", () => {
    let folderId: number;

    beforeAll(async () => {
        const folder = await createFolder("Test Folder", null);
        folderId = folder.id;
    });

    it("should fetch all folders", async () => {
        const folders = await getAllFolders();
        expect(Array.isArray(folders)).toBe(true);
    });

    it("should create a new folder", async () => {
        const folder = await createFolder("Sub Folder", folderId);
        expect(folder.name).toBe("Sub Folder");
        expect(folder.parent_id).toBe(folderId);
    });

    it("should get subfolders by parent_id", async () => {
        const subfolders = await getSubfolders(folderId);
        expect(Array.isArray(subfolders)).toBe(true);
    });

    it("should get files in a folder", async () => {
        const files = await getFilesInFolder(folderId);
        expect(Array.isArray(files)).toBe(true);
    });
});
