import { createRouter, createWebHistory } from 'vue-router'
import PageView from '../views/PageView.vue'

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