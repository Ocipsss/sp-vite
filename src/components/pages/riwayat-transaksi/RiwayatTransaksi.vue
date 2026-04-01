<template>
  <div class="w-full flex flex-col gap-5 py-2 no-scrollbar px-1 pb-28 min-h-dvh bg-slate-50">
    <div class="flex flex-col gap-3 px-2">
      <TransactionItem 
        v-for="t in transactions" 
        :key="t.id" 
        :transaction="t"
        :is-editing="editingId === t.id"
        @toggle-edit="toggleEdit"
        @refresh="loadTransactions"
        @reprint="reprint"
      />

      <div v-if="transactions.length === 0 && !isLoading" class="py-24 text-center opacity-30 flex flex-col items-center">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i class="ri-file-list-3-line text-4xl text-slate-400"></i>
        </div>
        <p class="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">
          Data Transaksi Kosong
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-10 opacity-50">
        <div class="animate-pulse text-[10px] font-black uppercase">Memuat Data...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/database';
import TransactionItem from './TransactionItem.vue';

interface Transaction {
  id: string | number;
  date: string;
  total: number;
  status: string;
  paymentMethod: string;
  items?: any[];
}

const transactions = ref<Transaction[]>([]);
const isLoading = ref(false);
const editingId = ref<string | number | null>(null);

const loadTransactions = async () => {
  isLoading.value = true;
  try {
    const data = await db.table('transactions')
      .orderBy('date')
      .reverse()
      .limit(50)
      .toArray();
    
    transactions.value = data;
  } catch (err) {
    console.error("Gagal load transaksi:", err);
  } finally {
    setTimeout(() => { 
      isLoading.value = false; 
    }, 400);
  }
};

const toggleEdit = (id: string | number | null) => {
  editingId.value = editingId.value === id ? null : id;
};

const reprint = (transaksi: Transaction) => {
  if (!transaksi) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(30);
  }

  const dataBersih = JSON.parse(JSON.stringify(transaksi));
  
  window.dispatchEvent(new CustomEvent('print-struk', { 
    detail: dataBersih 
  }));
};

onMounted(loadTransactions);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen Riwayat Transaksi (TransactionHistory.vue) yang berfungsi sebagai pusat arsip digital untuk memantau seluruh aktivitas penjualan di aplikasi Sinar Pagi POS. Komponen ini dirancang untuk menampilkan daftar nota belanja terbaru (hingga 50 transaksi terakhir) yang diurutkan secara terbalik (dari yang paling baru ke lama). Selain sebagai penampil data, file ini juga bertindak sebagai pengendali fitur pasca-transaksi seperti cetak ulang struk (reprint), pengeditan status, dan pemantauan real-time dari database lokal Dexie, memastikan kasir dapat melacak riwayat pendapatan dengan cepat dan akurat.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Pembungkus Utama; kontainer dengan lebar penuh (w-full) yang menggunakan latar belakang slate lembut dan fitur 'no-scrollbar' agar tampilan tetap bersih di perangkat mobile.
Baris 3-13: Iterasi Transaksi (v-for); merender setiap nota belanja menggunakan komponen TransactionItem secara dinamis, serta mengelola state pengeditan (is-editing) untuk masing-masing item.
Baris 15-22: State Kosong (Empty State); memberikan umpan balik visual berupa ikon daftar dan teks peringatan jika database transaksi masih kosong atau belum ada penjualan yang tercatat.
Baris 24-26: Indikator Loading; menampilkan animasi pulse "Memuat Data" saat aplikasi sedang melakukan query ke database untuk memberikan kesan responsif kepada pengguna.
Baris 31-38: Interface Transaction; kontrak data TypeScript yang mendefinisikan struktur objek transaksi, mencakup ID, tanggal, total belanja, status, metode bayar, dan daftar barang.
Baris 40-42: Inisialisasi State; variabel reaktif untuk menyimpan array transaksi, status loading (isLoading), dan ID transaksi yang sedang dalam mode edit (editingId).
Baris 44-59: Fungsi loadTransactions; logika pengambilan data asinkron dari tabel 'transactions'. Menggunakan pengurutan berdasarkan tanggal terbaru dan membatasi hasil hanya 50 data untuk menjaga performa aplikasi.
Baris 61-63: Fungsi toggleEdit; mengatur mekanisme buka-tutup panel edit pada item transaksi tertentu; jika ID yang sama diklik lagi, maka panel akan tertutup (null).
Baris 65-78: Fungsi reprint; fitur cetak ulang struk belanja. Fungsi ini memberikan respon getar (vibrate) pada perangkat mobile, lalu mengirimkan data transaksi melalui Event Global ('print-struk') agar ditangkap oleh printer thermal.
Baris 80: Lifecycle onMounted; memicu pemuatan data transaksi secara otomatis segera setelah halaman riwayat dibuka oleh pengguna.
Baris 83-91: Gaya Scoped (no-scrollbar); konfigurasi CSS khusus untuk menyembunyikan batang gulung (scrollbar) di berbagai browser (Chrome, Safari, Edge, Firefox) agar antarmuka terlihat lebih modern dan luas. -->