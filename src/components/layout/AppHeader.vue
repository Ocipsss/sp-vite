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
      <GlobalSearch 
        v-if="!isNotOnMainPages"
        v-model="cart.searchQuery" 
        placeholder="Cari barang..." 
      />
      
      <div v-else class="px-2">
        <h2 class="text-sm font-black text-slate-700 uppercase tracking-widest italic">
          {{ route.name }}
        </h2>
      </div>
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
import { useCartStore } from '@/stores/cart';
import GlobalSearch from './GlobalSearch.vue';

const props = defineProps<{ isSidebarOpen: boolean }>();
const emit = defineEmits(['toggle-sidebar']);

const cart = useCartStore();
const route = useRoute();
const router = useRouter();

const isNotOnMainPages = computed(() => {
  const currentName = route.name as string;
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



<!-- 
DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen AppHeader yang berfungsi sebagai bilah navigasi atas (top bar) untuk aplikasi Sinar Pagi POS. Header ini bersifat dinamis; ia dapat berubah tampilan tergantung pada halaman mana pengguna berada. Fitur utamanya mencakup tombol kontrol sidebar, kolom pencarian global yang terhubung dengan state manajemen (Pinia), serta tombol navigasi pintar yang berganti fungsi antara tombol scanner barcode dan tombol keranjang belanja sesuai konteks halaman.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Pembungkus utama header dengan styling Tailwind untuk tinggi tetap (h-16), latar putih, garis bawah, dan pengaturan tata letak flexbox.
Baris 3-10: Tombol toggle sidebar yang menggunakan event @click.stop untuk mencegah bubbling dan mengubah ikon menu secara dinamis (fold/unfold) berdasarkan status sidebar.
Baris 12-23: Area tengah header yang bersifat kondisional; menampilkan komponen GlobalSearch jika berada di halaman utama (Penjualan/Daftar Produk), atau menampilkan nama halaman saat ini jika berada di halaman lain.
Baris 14: Menghubungkan kolom pencarian langsung ke properti searchQuery di dalam Pinia Store agar pencarian barang tersinkronisasi secara global.
Baris 25-50: Area kanan header yang berisi logika tombol aksi pintar.
Baris 27-41: Tombol Keranjang (Warna Hijau); muncul di halaman selain Penjualan. Menampilkan indikator angka (badge) merah jika ada barang di keranjang dan akan mengarahkan pengguna ke halaman Kasir jika diklik.
Baris 43-49: Tombol Scanner (Warna Biru); muncul hanya di halaman Penjualan atau Daftar Produk untuk memicu fungsi kamera scanner barcode.
Baris 54-58: Import dependensi Vue (computed), Vue Router (route/router), Pinia Store (cart), dan komponen pendukung (GlobalSearch).
Baris 60-61: Definisi Props untuk menerima status sidebar dan Emits untuk mengirimkan aksi klik toggle ke komponen induk (App.vue).
Baris 63-65: Inisialisasi akses ke store keranjang, informasi rute saat ini, dan fungsi navigasi router.
Baris 68-72: Computed isNotOnMainPages; logika untuk mengecek apakah halaman aktif saat ini termasuk dalam kategori halaman utama atau bukan.
Baris 74-76: Fungsi handleToggle yang memicu pengiriman event ke komponen induk untuk membuka/tutup sidebar.
Baris 78-80: Fungsi goToPenjualan untuk berpindah halaman ke menu kasir (Penjualan) secara terprogram.
Baris 83-91: Styling CSS khusus untuk memberikan animasi fade-in yang halus pada badge angka keranjang belanja saat jumlah barang bertambah.
-->