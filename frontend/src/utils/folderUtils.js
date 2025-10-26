export function normalize(listArray) {
  return listArray.map(x => ({
    ...x,
    open: false,
    children: x.children ? normalize(x.children) : [],
  }));
}

export function searchFolderPath(listArray, id, currentPath = []) {
  for (const folder of listArray) {
    const newPath = [...currentPath, folder.name];
    if (folder.id === id) return newPath;
    if (folder.children?.length) {
      const result = searchFolderPath(folder.children, id, newPath);
      if (result) return result;
    }
  }
  return null;
}

export function searchFolderName(listArray, keyword, currentPath = [], matches = []) {
  const lower = keyword.toLowerCase();

  for (const folder of listArray) {
    const newPath = [...currentPath, folder.name];
    if (folder.name.toLowerCase().includes(lower)) {
      matches.push({ ...folder, path: newPath });
    }
    if (folder.children?.length) {
      searchFolderName(folder.children, keyword, newPath, matches);
    }
  }

  return matches;
}

export function findFolderById(listArray, id) {
  for (const folder of listArray) {
    if (folder.id === id) return folder;
    if (folder.children?.length) {
      const found = findFolderById(folder.children, id);
      if (found) return found;
    }
  }
  return null;
}
