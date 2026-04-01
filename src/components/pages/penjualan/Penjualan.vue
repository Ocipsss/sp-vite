<template>
  <div class="flex flex-col h-[calc(100vh-110px)] relative overflow-hidden bg-slate-50">
    <CartHeader :listJasa="listJasa" />
    <CartList />
    <PaymentPanel @checkout="handleCheckout" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from "@/stores/cart";
import { db } from "@/database";
import CartHeader from "./CartHeader.vue";
import CartList from "./CartList.vue";
import PaymentPanel from "./PaymentPanel.vue";
import type { ServiceItem } from "@/types";

const cart = useCartStore();
const listJasa = ref<ServiceItem[]>([]);

onMounted(async () => {
  listJasa.value = await db.table('services').toArray();
});

const handleCheckout = async () => {
  if (cart.items.length === 0) return;
  try {
    const trxId = await cart.processCheckout();
    console.log("✅ Berhasil:", trxId);
  } catch (err) {
    alert("Maaf, gagal menyimpan transaksi.");
  }
};
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah Penjualan.vue yang berfungsi sebagai Pusat Kendali Kasir (Point of Sale Interface) untuk aplikasi Sinar Pagi POS. Komponen ini adalah "Konduktor" yang menyatukan berbagai bagian kecil (Header, Daftar Belanja, dan Panel Pembayaran) menjadi satu kesatuan alur kerja transaksi yang utuh. File ini bertanggung jawab untuk mengatur tata letak layar penuh yang presisi di perangkat mobile, mengambil data layanan jasa dari database saat aplikasi dibuka, serta mengeksekusi proses finalisasi belanja (checkout) hingga data tersimpan secara permanen ke dalam sistem.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-3: Kontainer Layout Utama; menggunakan 'flex flex-col' untuk menumpuk elemen secara vertikal. Pengaturan tinggi 'h-[calc(100vh-110px)]' memastikan area kasir mengisi seluruh sisa layar ponsel dengan presisi tanpa terpotong oleh navigasi bawah.
Baris 4: Komponen <CartHeader />; memanggil bagian atas keranjang yang berisi tombol reset dan fitur tambah jasa, sekaligus mengirimkan data 'listJasa' sebagai pilihan layanan.
Baris 5: Komponen <CartList />; memanggil area tengah yang menampilkan daftar barang-barang yang sedang dibeli oleh pelanggan.
Baris 6: Komponen <PaymentPanel />; memanggil panel pembayaran di bagian bawah. Menggunakan pendengar event '@checkout' yang akan memicu fungsi 'handleCheckout' saat kasir menekan tombol selesai.
Baris 11-16: Bagian Script Setup; mengimpor fungsi reaktivitas Vue, pusat data keranjang (Pinia), koneksi database lokal (Dexie), serta ketiga sub-komponen (Header, List, Payment) yang telah dirancang sebelumnya.
Baris 18-19: Inisialisasi State; menyiapkan variabel 'cart' untuk akses data belanja dan 'listJasa' untuk menampung daftar layanan tambahan (seperti jasa giling atau seduh).
Baris 21-23: Lifecycle Hook (onMounted); sebuah prosedur otomatis yang langsung mengambil data dari tabel 'services' di database lokal segera setelah halaman kasir terbuka di layar.
Baris 25-26: Validasi Checkout; fungsi 'handleCheckout' pertama-tama akan memeriksa apakah ada barang di keranjang. Jika kosong, proses akan langsung dihentikan untuk mencegah transaksi fiktif.
Baris 27-33: Eksekusi Transaksi; menggunakan blok 'try-catch' untuk keamanan. Sistem akan memanggil 'cart.processCheckout()' yang bertugas menghitung total akhir, mengurangi stok barang, dan menyimpan nota ke database. Jika berhasil, ID transaksi akan muncul di log; jika gagal (misal: memori penuh), pesan peringatan akan muncul di layar kasir.
Baris 2: Properti 'relative overflow-hidden'; memastikan bahwa seluruh animasi (seperti barang yang bergeser atau panel yang muncul dari bawah) tetap berada di dalam bingkai layar kasir dan tidak menyebabkan layar ponsel bergulir secara liar. -->