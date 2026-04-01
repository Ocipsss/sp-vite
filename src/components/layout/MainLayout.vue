<template>
  <div class="fixed inset-0 bg-[#0f172a] overflow-hidden font-sans">
    
    <Sidebar 
      :is-pulling="isPulling" 
      @navigate="navigateTo" 
      @sync="handlePullFirebase" 
    />

    <div 
      :class="[
        'fixed inset-0 bg-[#f1f5f9] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.185)] z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col',
        isSidebarOpen 
          ? 'translate-x-[70%] scale-[0.95] rounded-[40px] cursor-pointer overflow-hidden select-none' 
          : 'translate-x-0 scale-100 rounded-none overflow-hidden'
      ]"
      @click="isSidebarOpen && (isSidebarOpen = false)"
    >
      <AppHeader 
        :is-sidebar-open="isSidebarOpen" 
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen" 
      />

      <main class="flex-1 overflow-y-auto bg-[#f1f5f9] relative h-full min-h-0">
        <slot />
        <div v-if="isSidebarOpen" class="absolute inset-0 z-50 bg-transparent"></div>
      </main>
    </div>

    <ScannerOverlay v-if="cart.isScannerOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { startPullSync } from '@/api/sync';

import Sidebar from './Sidebar.vue';
import AppHeader from './AppHeader.vue';
import ScannerOverlay from './ScannerOverlay.vue';

const cart = useCartStore();
const router = useRouter();
const isSidebarOpen = ref(false);
const isPulling = ref(false);

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
  isSidebarOpen.value = false; 
};

const handlePullFirebase = async () => {
  isPulling.value = true;
  try {
    startPullSync();
    setTimeout(() => { isPulling.value = false; }, 2000);
  } catch (err) {
    console.error("Sync Error:", err);
    isPulling.value = false;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>



<!-- 
DESKRIPSI KESELURUHAN FILE:
File ini adalah Layout Utama (Main Layout) atau AppShell yang membungkus seluruh aplikasi Sinar Pagi POS. File ini mengatur struktur visual tingkat atas, termasuk navigasi Sidebar, Header, dan area konten utama. Fitur paling menonjol adalah implementasi "Drawer Menu" bergaya mobile modern, di mana konten utama akan bergeser, mengecil (scale), dan melengkung (rounded) saat Sidebar dibuka, menciptakan efek kedalaman (depth) yang interaktif.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Kontainer root aplikasi dengan latar belakang gelap (#0f172a) yang berfungsi sebagai kanvas di belakang saat konten utama bergeser ke samping.
Baris 4-8: Memanggil komponen Sidebar; mengirimkan status loading sinkronisasi dan menangani event navigasi serta sinkronisasi data dari Firebase.
Baris 10-18: Kontainer Konten Utama; menggunakan binding class dinamis untuk menciptakan animasi transisi yang halus saat Sidebar dibuka atau ditutup.
Baris 14-17: Logika animasi; saat sidebar terbuka (isSidebarOpen), konten akan bergeser ke kanan 70%, mengecil ke skala 0.95, dan memiliki sudut melengkung 40px (rounded).
Baris 19: Event klik pada kontainer utama; jika sidebar sedang terbuka, mengklik area konten akan otomatis menutup kembali sidebar tersebut.
Baris 21-24: Memanggil komponen AppHeader; mengirimkan status sidebar untuk mengubah ikon menu dan menangani aksi toggle (buka/tutup) sidebar.
Baris 26-29: Area utama (Main) yang menggunakan tag slot untuk menampilkan halaman-halaman aplikasi. Dilengkapi overlay transparan saat sidebar terbuka agar interaksi pada konten utama terkunci.
Baris 32: Menampilkan ScannerOverlay secara global di atas semua elemen jika status isScannerOpen di dalam Pinia Store bernilai true.
Baris 36-43: Bagian script setup; mengimpor reaktivitas Vue, router, store keranjang belanja, dan fungsi sinkronisasi database (startPullSync).
Baris 45-48: Inisialisasi variabel reaktif (ref) untuk mengontrol status terbukanya sidebar dan status loading saat proses tarik data (pull) berlangsung.
Baris 50-53: Fungsi navigateTo; digunakan untuk berpindah halaman secara programatik lewat router dan otomatis menutup sidebar setelah berpindah.
Baris 55-65: Fungsi handlePullFirebase; memicu proses sinkronisasi data produk dari cloud ke database lokal dengan indikator loading (isPulling).
Baris 68-71: CSS Scoped untuk menyembunyikan scrollbar bawaan browser agar tampilan aplikasi terlihat lebih bersih dan seperti aplikasi native mobile.
-->