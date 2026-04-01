import { createRouter, createWebHistory } from 'vue-router'
import PageView from '@/views/PageView.vue'

const routes = [
  // GRUP 1
  { path: '/', name: 'Dashboard', component: PageView, meta: { icon: 'ri-dashboard-3-line' } },
  { path: '/penjualan', name: 'Penjualan', component: PageView, meta: { icon: 'ri-calculator-line', showScanner: true } },
  { path: '/layanan-digital', name: 'Layanan Digital', component: PageView, meta: { icon: 'ri-smartphone-line' } },

  // GRUP 2
  { path: '/riwayat-transaksi', name: 'Riwayat Transaksi', component: PageView, meta: { icon: 'ri-history-line' } },
  { path: '/stock-monitor', name: 'Stock Monitor', component: PageView, meta: { icon: 'ri-radar-line' } },
  { path: '/piutang-penjualan', name: 'Piutang Penjualan', component: PageView, meta: { icon: 'ri-hand-coin-line' } },
  { path: '/pengeluaran', name: 'Pengeluaran', component: PageView, meta: { icon: 'ri-shopping-basket-line' } },

  // GRUP 3
  { path: '/daftar-produk', name: 'Daftar Produk', component: PageView, meta: { icon: 'ri-list-settings-line', showScanner: true } },
  { path: '/tambah-produk', name: 'Tambah Produk', component: PageView, meta: { icon: 'ri-add-box-line' } },
  { path: '/kategori-produk', name: 'Kategori Produk', component: PageView, meta: { icon: 'ri-price-tag-3-line' } },
  { path: '/harga-paket', name: 'Harga Paket', component: PageView, meta: { icon: 'ri-box-3-line' } },
  { path: '/data-jasa', name: 'Data Jasa', component: PageView, meta: { icon: 'ri-customer-service-2-line' } },
  { path: '/data-member', name: 'Data Member', component: PageView, meta: { icon: 'ri-user-heart-line' } },
  { path: '/data-kasir', name: 'Data Kasir', component: PageView, meta: { icon: 'ri-user-star-line' } },

  // GRUP 4
  { path: '/laporan-harian', name: 'Laporan Harian', component: PageView, meta: { icon: 'ri-calendar-event-line' } },
  { path: '/laba-rugi', name: 'Laba Rugi', component: PageView, meta: { icon: 'ri-funds-line' } },
  { path: '/arus-uang', name: 'Arus Uang', component: PageView, meta: { icon: 'ri-exchange-funds-line' } },
  { path: '/pengaturan', name: 'Pengaturan', component: PageView, meta: { icon: 'ri-settings-5-line' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah Konfigurasi Routing (Vue Router) yang berfungsi sebagai pengatur lalu lintas navigasi di aplikasi Sinar Pagi POS. File ini mendefinisikan hubungan antara alamat URL (path), nama halaman, dan komponen visual yang harus ditampilkan. Setiap rute dilengkapi dengan data tambahan (meta) seperti ikon dan izin akses kamera (scanner), sehingga header atau sidebar dapat menyesuaikan tampilannya secara otomatis berdasarkan halaman yang sedang dibuka oleh kasir.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Mengimpor fungsi createRouter dan createWebHistory dari library Vue Router, serta mengimpor PageView sebagai komponen tunggal yang akan merender konten halaman.
// Baris 4: Definisi array 'routes' yang menampung seluruh daftar alamat halaman aplikasi Sinar Pagi.
// Baris 6-8: Grup Navigasi Utama; mengatur rute untuk Dashboard (Halaman Utama), Kasir (Penjualan), dan Layanan Digital.
// Baris 7: Properti 'showScanner: true' pada rute Penjualan; menandakan bahwa tombol scanner barcode harus ditampilkan secara otomatis di header saat berada di halaman ini.
// Baris 11-14: Grup Riwayat & Stok; mengatur rute untuk memantau transaksi masa lalu, monitor stok barang, pengelolaan piutang pelanggan, dan pencatatan biaya operasional (Pengeluaran).
// Baris 17-23: Grup Manajemen Data; berisi rute-rute teknis untuk mengelola database produk, kategori, harga grosir (paket), serta data member dan akun kasir.
// Baris 17: Properti 'showScanner: true' pada Daftar Produk; memungkinkan kasir mencari detail barang hanya dengan memindai barcode langsung dari daftar produk.
// Baris 26-29: Grup Laporan & Sistem; mengatur rute untuk melihat analisis keuntungan (Laba Rugi), arus kas, laporan harian, serta konfigurasi pengaturan aplikasi.
// Baris 32-35: Inisialisasi instance router; menggunakan mode 'createWebHistory' agar URL terlihat bersih tanpa simbol pagar (#) dan mendaftarkan seluruh rute yang telah dibuat.
// Baris 38: Ekspor default router agar dapat didaftarkan pada file utama aplikasi (main.ts).