<script setup>
  import { reactive, toRef, onMounted,watch } from "vue";
  import { CirclePlus } from 'lucide-vue-next'
  import { folderService } from "@/services";
  import { folderUtils } from "@/utils";
  import PageItem from "./PageItem.vue";

  const emit  = defineEmits(["selected"]);
  const state = reactive({
    folders   : [],
    loading   : true,
    selectedId: null,
  });
  const props = defineProps({
    folderId  : Number,
  });
  defineExpose({ openPath, searchFolder, folders: toRef(state, "folders") });

  onMounted(async () => {
    try {
      const listArray = await folderService.getFolderData();
      state.folders   = folderUtils.normalize(listArray);
    } catch (err) {
      console.error("Failed to load folders:", err);
    } finally {
      state.loading = false;
    }
  });

  watch(() => props.folderId,
    (val) => {
      state.selectedId = val || null;
    },
    { immediate: true }
  );

  function handleData(folder) {
    if (!folder) {
      state.selectedId = null;
      emit("selected", null);
      return;
    }

    state.selectedId = folder.id;
    const path = folderUtils.searchFolderPath(state.folders, folder.id);
    emit("selected", { ...folder, path });
  }

  function openPath(pathList) {
    if (!Array.isArray(pathList) || !pathList.length) return;

    let currentList = state.folders;
    let target      = null;

    for (const path of pathList) {
      const folder= currentList.find(f => f.name === path);
      if (!folder) break;
      folder.open = true;
      target      = folder;
      currentList = folder.children;
    }

    if (target) {
      handleData(target);
    }
  }

  function searchFolder(keyword) {
    return keyword ? folderUtils.searchFolderName(state.folders, keyword) : [];
  }

  async function addFolder() {
    const name = prompt("Enter new folder name:");
    if (!name) return;

    try {
      const newFolder = await folderService.createFolder(name, state.selectedId);
      const newData   = { ...newFolder, open: false, children: [] };

      if (state.selectedId) {
        const parent = folderUtils.findFolderById(state.folders, state.selectedId);
        if (parent) {
          parent.children.push(newData);
          parent.open = true;
        }
      } else {
        state.folders.push(newData);
      }
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  }
</script>

<template>
  <div class="folder-tree">
    <div class="flex justify-between items-center mb-2">
      <span class="flex items-center text-black text-sm px-2 py-1 rounded hover:bg-gray-300 cursor-pointer" 
        @click="addFolder">
        <CirclePlus class="w-4 h-4 text-gray-500"/>
        <span class="ml-2">New Folder</span>
      </span>
    </div>

    <div v-if="state.loading">Loading folders…</div>
    <div v-else>
      <PageItem
        v-for="folder in state.folders"
        :key="folder.id"
        :folder="folder"
        :selectedId="state.selectedId"
        @selected="handleData"
      />
    </div>
  </div>
</template>
