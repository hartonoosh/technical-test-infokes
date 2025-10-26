import { apiClient } from "../api/apiClient";

export async function getFiles(folderId) {
  try {
    const res = await apiClient.get(`/folders/${folderId}/files`);
    return res.data;
  } catch {
    return [];
  }
}

export async function uploadFiles(folderId, files) {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  formData.append("folder_id", folderId);

  const res = await apiClient.post("/folders/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
