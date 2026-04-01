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

const route = useRoute();

// Mapping Nama Route ke Komponen
const componentsMap: Record<string, any> = {
  'Daftar Produk': markRaw(DaftarProduk),
  'Dashboard': markRaw(Dashboard),
  'Kategori Produk': markRaw(KategoriProduk),
  'Penjualan': markRaw(Penjualan),
  'Riwayat Transaksi': markRaw(RiwayatTransaksi),
  'Stock Monitor': markRaw(StockMonitor),
  'Tambah Produk': markRaw(TambahProduk), // Sinkronkan dengan router
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



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen PageView yang berfungsi sebagai Dynamic Route Wrapper atau "Gerbang Halaman" untuk aplikasi Sinar Pagi POS. Komponen ini bertindak sebagai jembatan cerdas yang secara otomatis merender halaman yang diminta pengguna melalui URL. Uniknya, file ini juga berfungsi sebagai area transisi; jika sebuah fitur sudah selesai dikembangkan (dimigrasi), maka fitur tersebut akan ditampilkan. Namun, jika fitur tersebut masih dalam tahap pengembangan, pengguna akan melihat tampilan informatif "Tahap Migrasi" yang estetis.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-3: Pembungkus utama menggunakan tag <component :is="...">; ini adalah fitur Vue yang memungkinkan pemanggilan komponen secara dinamis berdasarkan data, bukan hardcode.
Baris 5-27: Area Fallback (Tampilan Cadangan); hanya akan muncul jika halaman yang diakses belum terdaftar di dalam sistem mapping (masih dalam tahap pengembangan).
Baris 8-20: Header halaman dinamis; menampilkan ikon dan judul halaman yang diambil langsung dari metadata rute (vue-router).
Baris 22-31: Konten visual "Tahap Migrasi"; memberikan informasi kepada kasir bahwa modul tersebut sedang dipindahkan ke arsitektur Cloud Sync (Firebase) dengan desain kotak putus-putus (dashed border) yang modern.
Baris 35-36: Mengimpor fungsi computed untuk reaktivitas dan markRaw dari Vue untuk mengoptimalkan performa dengan mencegah Vue melacak perubahan reaktif pada komponen halaman yang berat.
Baris 39-43: Mengimpor file komponen asli (Dashboard, Penjualan, dll) yang sudah siap digunakan dalam sistem.
Baris 48-54: Objek componentsMap; sebuah daftar pemetaan (dictionary) yang menghubungkan nama rute di URL dengan file komponen yang telah diimpor di atas.
Baris 56: Computed title; mengambil nama halaman dari rute saat ini untuk ditampilkan sebagai judul besar di UI.
Baris 57: Computed currentIcon; mengambil ikon spesifik dari metadata rute untuk konsistensi visual antara sidebar dan isi halaman.
Baris 58: Computed activeComponent; logika utama yang memutuskan apakah akan merender komponen asli atau menampilkan pesan "Tahap Migrasi" berdasarkan ketersediaan data di componentsMap.
Baris 62-70: Styling CSS scoped untuk animasi slide-up; memberikan efek transisi halus saat pengguna berpindah halaman agar aplikasi terasa lebih responsif dan premium. -->