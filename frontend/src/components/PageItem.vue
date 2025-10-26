<script setup>
  import { defineProps, defineEmits } from "vue";
  import { ChevronDown, ChevronRight } from 'lucide-vue-next'

  const props = defineProps({
    folder    : Object,
    selectedId: Number
  });
  const emit  = defineEmits(["selected"]);

  function handleData(data, type) {
    if(type === 'P'){
      props.folder.open = !props.folder.open
      if (props.folder.open) {
        emit("selected", props.folder)
      } else {
        emit("selected", null)
      }
    } else {
      emit("selected", data);
    }
  }

</script>

<template>
  <div>
    <div class="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-blue-100 cursor-pointer select-none"
      :class="{ 'bg-blue-200 text-blue-900': selectedId === folder.id }"
      @click.stop="(data) => handleData(data, 'P')">
      <span v-if="!folder.parent_id || folder.children && folder.children.length" class="w-4 text-gray-500 hover:text-gray-800">
        <ChevronDown v-if="folder.open" class="w-4 h-4 text-gray-500" />
        <ChevronRight v-else class="w-4 h-4 text-gray-500" />
      </span>
      <span>{{ folder.open ? '📂' : '📁' }}</span>
      <span class="truncate folder-name">{{ folder.name }}</span>
    </div>

    <div v-if="folder.children && folder.open" class="ml-4 border-l border-gray-200 pl-2">
      <PageItem
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :selectedId="selectedId"
        @selected="(data) => handleData(data, 'C')"
      />
    </div>
  </div>
</template>
