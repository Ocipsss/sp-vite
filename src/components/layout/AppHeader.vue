<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 shrink-0 z-20">
    <button 
      type="button"
      @click.stop="handleToggle" 
      class="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl transition-all border border-slate-100 active:scale-95 cursor-pointer"
    >
      <i :class="isSidebarOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'" class="text-2xl"></i>
    </button>

    <div class="flex-1">
      <GlobalSearch v-model="cart.searchQuery" placeholder="Cari barang..." />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart';
import GlobalSearch from './GlobalSearch.vue';

const props = defineProps<{ isSidebarOpen: boolean }>();
const emit = defineEmits(['toggle-sidebar']);

const cart = useCartStore();

const handleToggle = () => {
  console.log("Tombol Header Diklik!"); // Untuk debug di console
  emit('toggle-sidebar');
};
</script>