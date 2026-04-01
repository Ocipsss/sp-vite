<template>
  <aside class="fixed inset-y-0 left-0 w-[70%] h-full p-6 text-white flex flex-col overflow-y-auto no-scrollbar z-0 bg-[#0f172a]">
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
import { MENU_GROUPS } from '@/constants/menu';

defineProps<{ isPulling: boolean }>();
defineEmits(['navigate', 'sync']);

const route = useRoute();
const activePage = computed(() => route.name as string);

const getMenuClass = (page: string) => [
  'flex items-center gap-4 px-5 py-3 rounded-2xl cursor-pointer transition-all duration-200 group',
  activePage.value === page 
    ? 'text-[#fbbf24] bg-[#fbbf24]/10 shadow-[0_0_20px_rgba(251,191,36,0.1)] font-bold' 
    : 'text-slate-400 hover:text-white hover:bg-white/5'
];
</script>



<!-- 
DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen Sidebar yang berfungsi sebagai pusat navigasi utama dan kontrol sinkronisasi data untuk aplikasi Sinar Pagi POS. Sidebar ini dirancang khusus untuk penggunaan mobile dengan lebar 70% dari layar, menggunakan skema warna gelap yang elegan (#0f172a). Komponen ini secara dinamis merender menu berdasarkan pengelompokan yang sudah ditentukan, memberikan indikator visual untuk halaman yang sedang aktif, serta menyediakan tombol khusus untuk memicu proses sinkronisasi database cloud (Firebase) ke penyimpanan lokal.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Pembungkus utama Sidebar (aside) dengan posisi tetap (fixed), lebar 70%, dan fitur scroll otomatis yang disembunyikan (no-scrollbar).
Baris 3-10: Bagian Branding; menampilkan nama aplikasi "SINAR PAGI" dengan tipografi tebal (black), warna kuning emas, dan efek bayangan cahaya (drop-shadow) untuk kesan premium.
Baris 12-25: Area Navigasi Utama; menggunakan perulangan (v-for) ganda untuk merender grup menu dan item menu di dalamnya secara dinamis.
Baris 15-18: Item Menu; menangani aksi klik untuk berpindah halaman dan menerapkan kelas CSS dinamis untuk menandai menu mana yang sedang aktif.
Baris 20-22: Garis pemisah (divider); menampilkan garis tipis antar grup menu kecuali pada grup terakhir agar tampilan tetap rapi.
Baris 28-44: Bagian Footer Sidebar; berisi tombol "Update Data" untuk memicu sinkronisasi cloud.
Baris 32-35: Logika tombol sinkronisasi; berubah warna dan status menjadi disabled (non-aktif) saat proses pulling data sedang berlangsung.
Baris 37-39: Ikon awan (cloud); menggunakan animasi bounce (memantul) saat proses sinkronisasi aktif untuk memberikan umpan balik visual kepada pengguna.
Baris 40-45: Teks status tombol; menampilkan pesan "Proses..." atau "Update Data" berdasarkan status variabel isPulling.
Baris 49-51: Bagian script setup; mengimpor reaktivitas Vue, rute saat ini, dan konstanta daftar menu (MENU_GROUPS).
Baris 53-54: Definisi Props (isPulling) dan Emits (navigate, sync) sebagai sarana komunikasi data dengan komponen induk.
Baris 56-57: Inisialisasi rute dan variabel computed activePage untuk mendeteksi nama halaman yang sedang dibuka oleh pengguna.
Baris 59-65: Fungsi getMenuClass; logika penentu gaya CSS. Memberikan warna kuning emas dan latar belakang transparan jika menu cocok dengan halaman aktif, atau warna abu-abu (slate) jika tidak aktif.
-->