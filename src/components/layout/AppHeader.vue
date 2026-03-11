<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 shrink-0 z-20 relative">
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

    <div class="flex items-center">
      <button 
        v-if="isNotOnMainPages"
        type="button"
        @click="goToPenjualan"
        class="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-emerald-200 shrink-0 relative"
      >
        <i class="ri-shopping-cart-2-line text-xl"></i>
        <span 
          v-if="cart.items.length > 0" 
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-fade-in"
        >
          {{ cart.items.length }}
        </span>
      </button>

      <button 
        v-else
        type="button"
        @click="cart.toggleScanner(true)"
        class="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-blue-200 shrink-0"
      >
        <i class="ri-qr-scan-2-line text-xl"></i>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import GlobalSearch from './GlobalSearch.vue';

const props = defineProps<{ isSidebarOpen: boolean }>();
const emit = defineEmits(['toggle-sidebar']);

const cart = useCartStore();
const route = useRoute();
const router = useRouter();

// Logika penentuan halaman
const isNotOnMainPages = computed(() => {
  const currentName = route.name as string;
  // Icon Cart muncul jika nama route BUKAN salah satu di bawah ini
  const mainPages = ['Penjualan', 'Daftar Produk'];
  return !mainPages.includes(currentName);
});

const handleToggle = () => {
  emit('toggle-sidebar');
};

const goToPenjualan = () => {
  router.push({ name: 'Penjualan' });
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
</style>