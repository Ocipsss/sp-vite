<template>
  <div class="fixed inset-0 bg-[#0f172a] overflow-hidden">
    <Sidebar 
      :is-pulling="isPulling" 
      @navigate="navigateTo" 
      @sync="handlePullFirebase" 
    />

    <div 
      :class="[
        'fixed inset-0 bg-[#f1f5f9] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.185)] z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col',
        isSidebarOpen ? 'translate-x-[70%] scale-[0.95] rounded-[40px] cursor-pointer overflow-hidden select-none' : 'translate-x-0 scale-100 rounded-none overflow-hidden'
      ]"
      @click="isSidebarOpen ? isSidebarOpen = false : null"
    >
      <header class="h-16 bg-white border-b border-slate-200 flex items-center gap-3 px-4 shrink-0">
        <button 
          @click.stop="isSidebarOpen = !isSidebarOpen"
          class="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl transition-all border border-slate-100"
        >
          <i :class="isSidebarOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'" class="text-2xl"></i>
        </button>

        <div class="flex-1">
          <GlobalSearch v-model="cart.searchQuery" placeholder="Cari barang..." />
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-[#f1f5f9] relative h-full min-h-0">
        <slot />
        <div v-if="isSidebarOpen" class="absolute inset-0 z-50 bg-transparent"></div>
      </main>
    </div>

    <div v-if="cart.isScannerOpen" class="fixed inset-0 z-100 bg-white flex flex-col p-6 animate-zoom-in">
        <div class="flex justify-between items-center mb-6">
            <div class="flex flex-col">
                <span class="text-xs font-black uppercase tracking-widest text-blue-600">Scanner Aktif</span>
                <span class="text-[10px] text-gray-400 font-bold uppercase">Arahkan ke Barcode Produk</span>
            </div>
            <button @click="cart.toggleScanner(false)" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i class="ri-close-line text-xl"></i>
            </button>
        </div>
        <div id="reader" class="rounded-[2.5rem] overflow-hidden border-4 border-blue-50 bg-slate-50 aspect-square shadow-inner"></div>
        <div class="mt-auto py-8 text-center">
            <span class="text-[9px] text-gray-400 font-black tracking-[0.3em] uppercase italic">Sinar Pagi POS System</span>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import { db } from '../../database';
import { startPullSync } from '../../api/sync';
import { useScanner } from '../../composables/useScanner';

// Import Sub-Components
import Sidebar from './Sidebar.vue';
import GlobalSearch from './GlobalSearch.vue';

const cart = useCartStore();
const router = useRouter();
const isSidebarOpen = ref(false);
const isPulling = ref(false);

const { startScanner, stopScanner } = useScanner();

const navigateTo = (name: string) => {
  router.push({ name });
  isSidebarOpen.value = false; 
};

const handlePullFirebase = async () => {
  isPulling.value = true;
  try {
    startPullSync();
    setTimeout(() => {
      isPulling.value = false;
      window.location.reload(); 
    }, 3000);
  } catch (err) {
    console.error("Firebase Pull Error:", err);
    isPulling.value = false;
  }
};

const onScanSuccess = async (decodedText: string) => {
  await stopScanner();
  cart.toggleScanner(false);
  
  const product = await db.table('products').where('code').equals(decodedText).first();
  if (product) {
    cart.addToCart(product);
    if (navigator.vibrate) navigator.vibrate(100);
  } else {
    alert(`Barcode ${decodedText} tidak terdaftar.`);
  }
};

watch(() => cart.isScannerOpen, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      startScanner("reader", onScanSuccess).catch(() => cart.toggleScanner(false));
    }, 300);
  } else {
    stopScanner();
  }
});

onBeforeUnmount(() => stopScanner());
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-zoom-in { animation: zoomIn 0.2s ease-out; }
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>