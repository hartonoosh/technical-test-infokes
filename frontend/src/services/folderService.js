import { apiClient } from "../api/apiClient";

export async function getFolderData() {
    const response = await apiClient.get('/folders');
    return response.data;
}

export async function getChildren(folderId) {
  const res = await apiClient.get(`/folders/${folderId}/children`);
  return res.data;
}

export async function createFolder(name, parentId = null) {
  const res = await apiClient.post("/folders", {
    name,
    parent_id: parentId,
  });
  return res.data;
}