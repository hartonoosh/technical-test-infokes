<script setup>
    import { ref, reactive, onMounted, watch  } from 'vue';
    import { Search } from 'lucide-vue-next'
    import PageLeft from '../../components/PageLeft.vue';
    import PageRight from '../../components/PageRight.vue';

    const state = reactive({
        selectedFolder  : null,
        searchQuery     : '',
        searchResults   : [],
        folderList      : [],
        dropDown        : false,
    });
    const folderDataRef = ref(null);

    function onSelected(folder) {
        state.selectedFolder = folder;
    }

    onMounted(() => {
        watch(() => folderDataRef.value?.folders,
            (val) => {
                state.folderList = val || [];
            },
            { deep: true, immediate: true }
        );
    });

    function goToBack(index) {
        const targetPath = state.selectedFolder.path.slice(0, index + 1);
        folderDataRef.value.openPath(targetPath);
    }

    function searchKeyUp() {
        const keyword = state.searchQuery.trim();
        if (!keyword) {
            state.searchResults = [];
            state.dropDown      = false;
            return;
        }
        const results       = folderDataRef.value.searchFolder(keyword);
        state.searchResults = results;
        state.dropDown      = true;
    }

    function searchEnter() {
        if (state.searchResults.length > 0) {
            searchResults(state.searchResults[0]);
        }
    }

    function searchResults(folder) {
        state.dropDown      = false;
        state.searchQuery   = "";
        folderDataRef.value.openPath(folder.path);
    }
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-100">
    <header class="bg-grey-500 text-black py-2 px-5 flex items-center justify-between shadow">
        <h5 class="text-sm font-semibold flex items-center gap-2 truncate">
            <span class="text-gray-600 font-semibold cursor-default select-none">H:/  InfoKes</span>
            <template v-if="state.selectedFolder?.path">
                <template v-for="(x, i) in state.selectedFolder.path" :key="i">
                    <span>/</span>
                    <span v-if="i === state.selectedFolder.path.length - 1" class="text-gray-600 font-semibold cursor-default select-none">
                        {{ x }}
                    </span>
                    <span v-else class="text-gray-600 cursor-pointer" @click="goToBack(i)">
                        {{ x }}
                    </span>
                </template>
            </template>
        </h5>

        <div class="relative w-64" @click.outside="state.dropDown = false">
            <input type="text" placeholder="Search folders..." class="w-64 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                v-model="state.searchQuery"
                @input="searchKeyUp"
                @keydown.enter="searchEnter"
            />
            <button class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600" @click="searchEnter">
                <Search class="w-4 h-4"/>
            </button>
            <ul v-if="state.searchResults.length && state.dropDown" class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-60 overflow-y-auto text-sm">
                <li v-for="(x, i) in state.searchResults" :key="i" class="px-3 py-1 hover:bg-blue-100 cursor-pointer truncate text-left"
                    @click="searchResults(x)">
                    {{ x.path.join(' / ') }}
                </li>
            </ul>
        </div>
    </header>

    <main class="flex flex-1 overflow-hidden">
      <div class="w-1/3 max-w-sm bg-gray-50 overflow-y-auto p-3">
        <PageLeft 
            ref="folderDataRef" 
            :folderId="state.selectedFolder?.id"
            @selected="onSelected"
        />
      </div>
      <div class="flex-1 bg-white overflow-y-auto p-5">
        <PageRight 
            :selectedFolder="state.selectedFolder" 
            :folders="state.folderList" 
            :selectedId="state.selectedFolder?.id"
            @selected="onSelected"
        />
      </div>
    </main>
  </div>
</template>
