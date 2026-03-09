<template>
  <div class="fixed inset-0 bg-[#0f172a] overflow-hidden">
    <aside class="w-[70%] h-full p-6 text-white flex flex-col overflow-y-auto no-scrollbar">
      <div class="mb-8 shrink-0">
        <h1 class="text-[1.8rem] font-black text-[#fbbf24] tracking-tighter uppercase italic leading-none shadow-[#fbbf24]/40 drop-shadow-[0_0_15px]">
          SINAR PAGI
        </h1>
        <p class="text-[10px] text-slate-500 font-bold tracking-[0.2em] mt-2 italic">POINT OF SALE v1.0</p>
      </div>

      <nav class="flex-1 space-y-6">
        <div v-for="(group, gIndex) in menuGroups" :key="gIndex" class="space-y-1">
          <div 
            v-for="item in group.items" :key="item.name"
            @click="navigateTo(item.name)" 
            :class="menuClass(item.name)"
          >
            <i :class="item.icon" class="text-xl"></i>
            <span class="font-medium text-[15px] whitespace-nowrap">{{ item.name }}</span>
          </div>
          <div v-if="gIndex < menuGroups.length - 1" class="pt-4 pb-2">
            <div class="h-px bg-white/5 w-full"></div>
          </div>
        </div>
      </nav>

      <div class="mt-auto pt-6 border-t border-white/5">
        <button 
          @click="handlePullFirebase" 
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
            <span class="text-[9px] text-gray-400 font-black tracking-[0.3em] uppercase">Sinar Pagi POS System</span>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import GlobalSearch from './GlobalSearch.vue';
import { db } from '../../database';
import { startPullSync } from '../../api/sync';
// Import Composable Baru
import { useScanner } from '../../composables/useScanner';

const cart = useCartStore();
const isSidebarOpen = ref(false);
const isPulling = ref(false);
const router = useRouter();
const route = useRoute();

// Gunakan composable scanner
const { startScanner, stopScanner } = useScanner();

const activePage = computed(() => route.name as string);

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
      alert("✅ Sinkronisasi Cloud Aktif.");
      window.location.reload(); 
    }, 3000);
  } catch (err) {
    alert("Gagal koneksi cloud");
    isPulling.value = false;
  }
};

// Logika ketika scan berhasil
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

// Watcher untuk reaktifitas modal scanner
watch(() => cart.isScannerOpen, (isOpen) => {
  if (isOpen) {
    // Delay 300ms agar elemen "reader" muncul di DOM sebelum di-init
    setTimeout(() => {
      startScanner("reader", onScanSuccess).catch(() => {
        cart.toggleScanner(false);
      });
    }, 300);
  } else {
    stopScanner();
  }
});

// Pembersihan otomatis saat pindah halaman/komponen dihancurkan
onBeforeUnmount(() => stopScanner());

// --- DATA MENU & STYLING ---
const menuGroups = [
  { items: [
    { name: 'Dashboard', icon: 'ri-dashboard-3-line' },
    { name: 'Penjualan', icon: 'ri-calculator-line' },
    { name: 'Layanan Digital', icon: 'ri-smartphone-line' }
  ]},
  { items: [
    { name: 'Riwayat Transaksi', icon: 'ri-history-line' },
    { name: 'Stock Monitor', icon: 'ri-radar-line' },
    { name: 'Piutang Penjualan', icon: 'ri-hand-coin-line' },
    { name: 'Pengeluaran', icon: 'ri-shopping-basket-line' } 
  ]},
  { items: [
    { name: 'Daftar Produk', icon: 'ri-list-settings-line' },
    { name: 'Tambah Produk', icon: 'ri-add-box-line' },
    { name: 'Kategori Produk', icon: 'ri-price-tag-3-line' },
    { name: 'Harga Paket', icon: 'ri-box-3-line' },
    { name: 'Data Jasa', icon: 'ri-customer-service-2-line' },
    { name: 'Data Member', icon: 'ri-user-heart-line' },
    { name: 'Data Kasir', icon: 'ri-user-star-line' }
  ]},
  { items: [
    { name: 'Laporan Harian', icon: 'ri-calendar-event-line' },
    { name: 'Laba Rugi', icon: 'ri-funds-line' },
    { name: 'Arus Uang', icon: 'ri-exchange-funds-line' },
    { name: 'Pengaturan', icon: 'ri-settings-5-line' }
  ]}
];

const menuClass = (page: string) => [
  'flex items-center gap-4 px-5 py-3 rounded-2xl cursor-pointer transition-all duration-200 group',
  activePage.value === page 
    ? 'text-[#fbbf24] bg-[#fbbf24]/10 shadow-[0_0_20px_rgba(251,191,36,0.1)] font-bold' 
    : 'text-slate-400 hover:text-white hover:bg-white/5'
];
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
