
<script setup>
  import { reactive, watch } from "vue";
  import { folderService, fileService } from "@/services";
  import { folderUtils } from "@/utils";
  import { CirclePlus } from 'lucide-vue-next'

  const state = reactive({
    children    : [],
    files       : [],
    loadingChild: false,
    loadingFiles: false,
  });

  const props = defineProps({
    selectedFolder: Object,
    selectedId    : Number,
    folders       : { type: Array, default: () => [] },
  });
  const emit  = defineEmits(["selected"]);

  watch(() => props.selectedFolder, async (newData) => {
      if (!newData) {
        state.children= [];
        state.files   = [];
        return;
      }
      state.loadingChild = true;
      state.loadingFiles = true;

      try {
        const [folder, file] = await Promise.all([
          folderService.getChildren(newData.id),
          fileService.getFiles(newData.id),
        ]);
        state.children= folder || [];
        state.files   = file || [];
      } finally {
        state.loadingChild = false;
        state.loadingFiles = false;
      }
    },
    { immediate: true }
  );

  async function addFiles() {
    if (!props.selectedFolder) return alert("Select a folder first!");

    const input   = document.createElement("input");
    input.type    = "file";
    input.multiple= true;
    input.onchange= async (e) => {
      const files = e.target.files;
      if (!files.length) return;
      try {
        const uploaded = await fileService.uploadFiles(props.selectedFolder.id, files);
        state.files.push(...uploaded);
      } catch (err) {
        console.error("Failed to upload files", err);
        alert("Upload file failed");
      }
    };
    input.click();
  }

  function handleData(folder) {
    if (!folder) return;

    const path = folderUtils.searchFolderPath(props.folders || [], folder.id) || [];
    emit("selected", { ...folder, path });
  }
</script>

<template>
  <div>
    <div v-if="selectedFolder" class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">{{ selectedFolder ? selectedFolder.name : '' }}</h2>
      <span class="flex items-center text-black text-sm px-2 py-1 rounded hover:bg-gray-300 cursor-pointer" 
        @click="addFiles">
        <CirclePlus class="w-4 h-4 text-gray-500"/>
        <span class="ml-2">Add Files</span>
      </span>
    </div>

    <div v-if="!selectedFolder" class="text-gray-400 text-center py-10">
      <p>Select a folder to view contents.</p>
    </div>

    <div v-else>
      <div v-if="state.loadingChild || state.loadingFiles" class="text-gray-500 italic">
        Loading...
      </div>
      <div v-else>
        <div v-if="(!state?.children || state.children.length === 0) && (!state?.files || state.files.length === 0)" 
          class="text-gray-400 text-center py-10">
          <p>Empty folder and file</p>
        </div>
        <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
          <div v-for="folder in state.children"
            class="flex flex-col items-center bg-blue-50 hover:bg-blue-100 rounded-lg p-3 cursor-pointer"
            :class="{ 'bg-blue-200 text-blue-900': selectedId === folder.id }"
            :key="folder.id"
            @click="handleData(folder)">
            <span class="text-4xl">📁</span>
            <span class="text-sm text-gray-800 mt-1 truncate max-w-[50px] sm:max-w-[60px] lg:max-w-20" :title="folder.name">
              {{ folder.name }}
            </span>
          </div>
  
          <div v-for="file in state.files" :key="file.id"
            class="flex flex-col items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-3 cursor-pointer">
            <span class="text-4xl">📄</span>
            <span class="text-sm text-gray-700 mt-1 truncate max-w-[50px] sm:max-w-[60px] lg:max-w-20" :title="file.name">
              {{ file.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

