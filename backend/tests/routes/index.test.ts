import { describe, it, expect, beforeAll } from "bun:test";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { urlRoutes } from "../../src/routes/index";

let app: Elysia;
let baseUrl = "http://localhost:3000/api/v1/folders";

describe("Folder Routes API", () => {
    beforeAll(() => {
        app = new Elysia().use(cors()).use(urlRoutes).listen(3000);
    });

    it("GET /api/v1/folders → should return all folders", async () => {
        const res = await fetch(baseUrl);
        expect(res.status).toBe(200);
    });

    it("POST /api/v1/folders → should create new folder", async () => {
        const res = await fetch(baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "UnitTest Folder" }),
        });

        expect(res.status).toBe(200);

        const data: any = await res.json();
        expect(data.name).toBe("UnitTest Folder");
    });

    it("GET /api/v1/folders/:id/children → should return subfolders", async () => {
        const res = await fetch(`${baseUrl}/1/children`);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);
    });

    it("GET /api/v1/folders/:id/files → should return files", async () => {
        const res = await fetch(`${baseUrl}/1/files`);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(Array.isArray(data)).toBe(true);
    });
});
