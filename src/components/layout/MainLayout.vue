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

      <div class="mt-10 mb-4 flex items-center gap-4 p-4 bg-slate-800/30 rounded-2xl border border-white/5 shrink-0">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-900/20">A</div>
        <div>
          <p class="text-sm font-bold">Admin Kasir</p>
          <p class="text-[10px] text-green-500 font-black uppercase tracking-wider">● Online</p>
        </div>
      </div>
    </aside>

    <div 
      :class="[
        'fixed inset-0 bg-[#f1f5f9] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.185)] z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col',
        isSidebarOpen ? 'translate-x-[60%] scale-[0.95] rounded-[40px] cursor-pointer overflow-hidden select-none' : 'translate-x-0 scale-100 rounded-none'
      ]"
      @click="isSidebarOpen ? isSidebarOpen = false : null"
    >
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <button 
          @click.stop="isSidebarOpen = !isSidebarOpen"
          class="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl transition-all border border-slate-100"
        >
          <i :class="isSidebarOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'" class="text-2xl"></i>
        </button>

        <div class="flex items-center gap-3">
          <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">{{ activePage }}</span>
          <div class="w-1 bg-slate-100 h-6"></div>
          <i class="ri-notification-3-line text-xl text-slate-300"></i>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto bg-[#f1f5f9] relative">
        <slot />
        <div v-if="isSidebarOpen" class="absolute inset-0 z-50"></div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// State Sidebar (Buka/Tutup)
const isSidebarOpen = ref(false);

// Inisialisasi Router & Route
const router = useRouter();
const route = useRoute();

/**
 * KUNCI: Mengambil nama halaman aktif langsung dari rute saat ini.
 * Ini memastikan sidebar tetap sinkron meskipun user menekan tombol 'Back' di browser.
 */
const activePage = computed(() => route.name as string);

/**
 * Fungsi Navigasi:
 * Memindahkan halaman dan menutup sidebar secara otomatis jika sedang terbuka.
 */
const navigateTo = (name: string) => {
  router.push({ name });
  isSidebarOpen.value = false; 
};

/**
 * Data Menu Groups (Sesuai Struktur Sinar Pagi POS)
 */
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

/**
 * Styling Class Dinamis (Menggunakan Palette Warna 'sp-')
 */
const menuClass = (page: string) => [
  'flex items-center gap-4 px-5 py-3 rounded-2xl cursor-pointer transition-all duration-200 group',
  activePage.value === page 
    ? 'text-sp-gold bg-sp-gold/10 shadow-[0_0_20px_rgba(251,191,36,0.1)] font-bold' 
    : 'text-sp-muted hover:text-white hover:bg-white/5'
];
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>