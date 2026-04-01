<template>
  <div class="w-full flex flex-col gap-4 py-2 animate-zoom-in no-scrollbar pb-24">
    
    <div class="w-full bg-slate-800 p-7 rounded-4xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
      <div class="relative z-10">
        <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Omzet Hari Ini</span>
        <h2 class="text-3xl font-black mt-2 tracking-tighter">{{ formatRupiah(stats.omzet) }}</h2>
      </div>
      <i class="ri-funds-box-line absolute -right-6 -bottom-6 text-[110px] text-white/5 rotate-12 pointer-events-none"></i>
    </div>

    <div class="flex flex-row flex-nowrap gap-3 w-full px-1">
      <div class="flex-1 bg-white p-4 rounded-3xl shadow-lg shadow-blue-50 flex flex-col items-center justify-center text-center border border-gray-50">
        <span class="text-[7px] font-black uppercase text-gray-400 mb-1 tracking-widest whitespace-nowrap">Laba Bersih</span>
        <span class="text-[12px] font-black text-green-500 leading-none truncate w-full">{{ formatRupiah(stats.labaHariIni) }}</span>
      </div>

      <div class="flex-1 bg-white p-4 rounded-3xl shadow-lg shadow-blue-50 flex flex-col items-center justify-center text-center border border-gray-50">
        <span class="text-[7px] font-black uppercase text-gray-400 mb-1 tracking-widest whitespace-nowrap">Biaya Keluar</span>
        <span class="text-[12px] font-black text-red-500 leading-none truncate w-full">-{{ formatRupiah(stats.pengeluaranHariIni) }}</span>
      </div>
    </div>

    <div class="flex flex-row gap-3 px-1">
      <div class="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
        <div class="w-9 h-9 bg-slate-50 text-slate-800 rounded-xl flex items-center justify-center mb-2">
          <i class="ri-archive-line"></i>
        </div>
        <span class="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">Aset Stok</span>
        <div class="text-[11px] font-black text-gray-900 leading-none">{{ formatRupiah(stats.nilaiStok) }}</div>
      </div>

      <div class="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
        <div class="w-9 h-9 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-2">
          <i class="ri-hand-coin-line"></i>
        </div>
        <span class="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Piutang</span>
        <div class="text-[11px] font-black text-gray-900 leading-none">{{ formatRupiah(stats.totalPiutang) }}</div>
      </div>
    </div>

    <div v-if="stats.stokKritis > 0" 
      class="mx-1 bg-orange-500 p-5 rounded-4xl text-white flex items-center gap-4 shadow-lg shadow-orange-100 animate-pulse">
      <i class="ri-error-warning-fill text-2xl"></i>
      <div>
        <div class="text-[10px] font-black uppercase tracking-widest">Peringatan Stok</div>
        <div class="text-[14px] font-black">{{ stats.stokKritis }} Produk Kritis</div>
      </div>
    </div>

    <div class="w-full bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between mb-5 px-1">
        <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
          <i class="ri-medal-fill text-blue-600"></i> Top Member
        </h4>
      </div>
      
      <div class="flex flex-col gap-2">
        <div v-for="(m, index) in topMembers" :key="m.id" 
          class="flex items-center justify-between p-3 px-4 bg-slate-50 rounded-2xl border border-gray-50 transition-all active:scale-95">
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-black text-blue-500 w-4">#{{ index + 1 }}</span>
            <span class="text-[11px] font-black text-gray-700 uppercase truncate">{{ m.name }}</span>
          </div>
          <div class="text-[11px] font-black text-gray-900">
            {{ (m.points || 0).toLocaleString() }} 
            <span class="text-[7px] text-blue-500 uppercase ml-1">Pts</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-1 p-6 bg-slate-800 rounded-3xl text-white flex items-center justify-between relative overflow-hidden">
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center">
          <i class="ri-shield-check-fill text-xl text-blue-400"></i>
        </div>
        <div>
          <div class="text-[9px] font-black uppercase tracking-widest leading-none mb-1">Secure Mode</div>
          <div class="text-[7px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
            <span class="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
            Cloud Synced
          </div>
        </div>
      </div>
      <span class="text-[8px] font-black px-3 py-1 bg-blue-600 rounded-full uppercase z-10">Live</span>
      <i class="ri-wifi-line absolute -right-2 -bottom-2 text-6xl text-white/5 -rotate-12"></i>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDashboard } from './useDashboard';
import { formatRupiah } from '@/utils/formatters';

const { stats, topMembers } = useDashboard();
</script>

<style scoped>
.animate-zoom-in {
  animation: zoomIn 0.3s ease-out;
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen Dashboard.vue yang berfungsi sebagai pusat ringkasan performa bisnis (Business Intelligence) untuk aplikasi Sinar Pagi POS. Komponen ini menyajikan data keuangan secara real-time, mulai dari omzet harian, laba bersih, hingga nilai aset stok dan piutang. Selain itu, dashboard ini juga berperan sebagai sistem peringatan dini untuk stok kritis serta menampilkan peringkat member terbaik, semuanya dikemas dalam antarmuka modern yang dioptimalkan untuk perangkat mobile.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-4: Kontainer Utama; menggunakan layout flex kolom dengan animasi 'zoom-in' untuk transisi masuk yang halus, serta menyisipkan padding bawah agar konten tidak tertutup oleh navigasi bawah.
Baris 6-12: Kartu Omzet; menampilkan total pendapatan kotor hari ini dengan latar belakang gelap (slate-800) yang mencolok. Menggunakan ikon dekoratif besar di latar belakang (ri-funds-box-line) untuk estetika premium.
Baris 14-25: Ringkasan Laba & Biaya; barisan kartu yang membandingkan laba bersih (warna hijau) dan pengeluaran hari ini (warna merah). Menggunakan properti 'truncate' agar angka nominal yang panjang tetap rapi di layar kecil.
Baris 27-41: Kartu Aset & Piutang; menyajikan total nilai uang yang tertanam dalam stok barang (Aset) dan total uang yang masih ada di pelanggan (Piutang), membantu pemilik toko memantau kesehatan arus kas.
Baris 43-50: Peringatan Stok Kritis; bagian ini hanya akan muncul (v-if) jika ada produk dengan stok menipis. Menggunakan warna oranye terang dan animasi 'pulse' (berkedip pelan) untuk menarik perhatian kasir agar segera melakukan restock.
Baris 52-70: Panel Top Member; menampilkan daftar pelanggan setia berdasarkan perolehan poin. Menggunakan perulangan (v-for) untuk membuat daftar peringkat yang rapi dengan efek interaksi 'active:scale-95' saat ditekan.
Baris 72-88: Indikator Status Sistem; memberikan informasi visual bahwa aplikasi berada dalam "Secure Mode" dan data telah tersinkronisasi ke cloud (Cloud Synced), ditandai dengan lampu indikator hijau yang berkedip.
Baris 92-96: Bagian Script; menggunakan pola 'composable' (useDashboard) untuk memisahkan logika perhitungan data dari tampilan, serta mengimpor fungsi 'formatRupiah' untuk standarisasi mata uang.
Baris 99-107: CSS Scoped; mendefinisikan animasi 'zoom-in' kustom menggunakan keyframes untuk memberikan kesan aplikasi yang responsif dan hidup saat dashboard pertama kali dibuka. -->
