<template>
  <div class="min-h-full w-full">
    <component :is="activeComponent" v-if="activeComponent" />

    <div v-else class="p-8 animate-slide-up h-full flex flex-col">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
          <i :class="currentIcon" class="text-3xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            {{ title }}
          </h1>
          <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Sinar Pagi POS • Modul Sistem</p>
        </div>
      </div>

      <div class="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center text-center p-10 min-h-[60vh]">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
          <i class="ri-hammer-line text-4xl text-slate-200"></i>
        </div>
        <h2 class="text-xl font-black text-slate-400 uppercase tracking-tighter">Tahap Migrasi</h2>
        <p class="text-slate-400 max-w-xs mt-2 text-sm leading-relaxed">
          Modul <span class="text-blue-600 font-bold">"{{ title }}"</span> sedang dalam proses pemindahan ke arsitektur Cloud Sync.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { useRoute } from 'vue-router';

// IMPORT HALAMAN YANG SUDAH MIGRASI
import DaftarProduk from '../components/pages/daftar-produk/DaftarProduk.vue';
import Dashboard from '../components/pages/dashboard/Dashboard.vue';
import KategoriProduk from '../components/pages/kategori/KategoriProduk.vue';
import Penjualan from '../components/pages/penjualan/Penjualan.vue';
import RiwayatTransaksi from '../components/pages/riwayat-transaksi/RiwayatTransaksi.vue';
import StockMonitor from '../components/pages/stock-monitor/StockMonitor.vue';
import TambahProduk from '../components/pages/tambah-produk/TambahProduk.vue';
import LayananDigital from '../components/pages/layanan-digital/LayananDigital.vue';

const route = useRoute();

// Mapping Nama Route ke Komponen
const componentsMap: Record<string, any> = {
  'Daftar Produk': markRaw(DaftarProduk),
  'Dashboard': markRaw(Dashboard),
  'Kategori Produk': markRaw(KategoriProduk),
  'Penjualan': markRaw(Penjualan),
  'Riwayat Transaksi': markRaw(RiwayatTransaksi),
  'Stock Monitor': markRaw(StockMonitor),
  'Tambah Produk': markRaw(TambahProduk),
  'Layanan Digital': markRaw(LayananDigital),// Sinkronkan dengan router
};

const title = computed(() => (route.name as string) || 'Halaman');
const currentIcon = computed(() => (route.meta?.icon as string) || 'ri-bookmark-3-line');
const activeComponent = computed(() => componentsMap[route.name as string]);
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
