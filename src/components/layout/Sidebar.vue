<template>
  <aside class="w-[70%] h-full p-6 text-white flex flex-col overflow-y-auto no-scrollbar">
    <div class="mb-8 shrink-0">
      <h1 class="text-[1.8rem] font-black text-[#fbbf24] tracking-tighter uppercase italic leading-none shadow-[#fbbf24]/40 drop-shadow-[0_0_15px]">
        SINAR PAGI
      </h1>
      <p class="text-[10px] text-slate-500 font-bold tracking-[0.2em] mt-2 italic">POINT OF SALE v1.0</p>
    </div>

    <nav class="flex-1 space-y-6">
      <div v-for="(group, gIndex) in MENU_GROUPS" :key="gIndex" class="space-y-1">
        <div 
          v-for="item in group.items" :key="item.name"
          @click="$emit('navigate', item.name)" 
          :class="getMenuClass(item.name)"
        >
          <i :class="item.icon" class="text-xl"></i>
          <span class="font-medium text-[15px] whitespace-nowrap">{{ item.name }}</span>
        </div>
        <div v-if="gIndex < MENU_GROUPS.length - 1" class="pt-4 pb-2">
          <div class="h-px bg-white/5 w-full"></div>
        </div>
      </div>
    </nav>

    <div class="mt-auto pt-6 border-t border-white/5">
      <button 
        @click="$emit('sync')" 
        :disabled="isPulling"
        class="w-full flex items-center gap-4 px-5 py-4 rounded-4xl transition-all active:scale-95 border border-white/5"
        :class="isPulling ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'"
      >
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20">
          <i class="ri-cloud-download-line text-xl" :class="{'animate-bounce': isPulling}"></i>
        </div>
        <div class="text-left">
          <span class="block text-[10px] font-black uppercase tracking-widest leading-none mb-1">
            {{ isPulling ? 'Proses...' : 'Update Data' }}
          </span>
          <span class="block text-[8px] font-bold opacity-60 uppercase tracking-tighter italic">Sinkron Cloud</span>
        </div>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { MENU_GROUPS } from '../../constants/menu';

defineProps<{ isPulling: boolean }>();
const emit = defineEmits(['navigate', 'sync']);

const route = useRoute();
const activePage = computed(() => route.name as string);

const getMenuClass = (page: string) => [
  'flex items-center gap-4 px-5 py-3 rounded-2xl cursor-pointer transition-all duration-200 group',
  activePage.value === page 
    ? 'text-[#fbbf24] bg-[#fbbf24]/10 shadow-[0_0_20px_rgba(251,191,36,0.1)] font-bold' 
    : 'text-slate-400 hover:text-white hover:bg-white/5'
];
</script>