import { describe, it, expect } from "bun:test";
import { buildTree } from "../../src/utils/buildTree";

describe("buildTree()", () => {
    it("should build nested folder structure correctly", () => {
        const input = [
            { id: 1, name: "Root", parent_id: null },
            { id: 2, name: "Child A", parent_id: 1 },
            { id: 3, name: "Child B", parent_id: 1 },
            { id: 4, name: "Subchild", parent_id: 2 },
        ];
        const result = buildTree(input);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Root");
        expect(result[0].children.length).toBe(2);
        expect(result[0].children[0].children[0].name).toBe("Subchild");
    });
});
