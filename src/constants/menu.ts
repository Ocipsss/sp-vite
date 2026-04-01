export const MENU_GROUPS = [
  { 
    items: [
      { name: 'Dashboard', icon: 'ri-dashboard-3-line' },
      { name: 'Penjualan', icon: 'ri-calculator-line' },
      { name: 'Layanan Digital', icon: 'ri-smartphone-line' }
    ]
  },
  { 
    items: [
      { name: 'Riwayat Transaksi', icon: 'ri-history-line' },
      { name: 'Stock Monitor', icon: 'ri-radar-line' },
      { name: 'Piutang Penjualan', icon: 'ri-hand-coin-line' },
      { name: 'Pengeluaran', icon: 'ri-shopping-basket-line' } 
    ]
  },
  { 
    items: [
      { name: 'Daftar Produk', icon: 'ri-list-settings-line' },
      { name: 'Tambah Produk', icon: 'ri-add-box-line' },
      { name: 'Kategori Produk', icon: 'ri-price-tag-3-line' },
      { name: 'Harga Paket', icon: 'ri-box-3-line' },
      { name: 'Data Jasa', icon: 'ri-customer-service-2-line' },
      { name: 'Data Member', icon: 'ri-user-heart-line' },
      { name: 'Data Kasir', icon: 'ri-user-star-line' }
    ]
  },
  { 
    items: [
      { name: 'Laporan Harian', icon: 'ri-calendar-event-line' },
      { name: 'Laba Rugi', icon: 'ri-funds-line' },
      { name: 'Arus Uang', icon: 'ri-exchange-funds-line' },
      { name: 'Pengaturan', icon: 'ri-settings-5-line' }
    ]
  }
];



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah konstanta konfigurasi Menu (Menu Configuration) yang berfungsi untuk menyusun struktur navigasi pada Sidebar aplikasi Sinar Pagi POS. Data di dalam file ini diatur dalam bentuk array objek yang dikelompokkan (grouped), sehingga mempermudah proses perulangan (looping) di komponen UI. Setiap item menu memiliki properti nama untuk label dan ikon dari pustaka Remix Icon, yang memastikan tampilan antarmuka tetap rapi, terorganisir, dan mudah dikelola jika di masa depan ada penambahan fitur baru.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1: Ekspor konstanta MENU_GROUPS sebagai array utama yang menampung seluruh kelompok menu aplikasi.
// Baris 2-8: Grup Menu 1 (Navigasi Utama); berisi menu inti untuk operasional harian seperti Dashboard, Kasir (Penjualan), dan Layanan Digital.
// Baris 10-17: Grup Menu 2 (Aktivitas & Keuangan); mengelompokkan fitur pemantauan seperti riwayat transaksi, monitor stok barang secara real-time, serta pencatatan piutang dan pengeluaran toko.
// Baris 19-29: Grup Menu 3 (Manajemen Data); berisi daftar menu untuk pengelolaan database (Master Data) mulai dari produk, kategori, harga paket/grosir, hingga manajemen data jasa, member, dan akun kasir.
// Baris 31-38: Grup Menu 4 (Laporan & Sistem); mengelompokkan fitur analisis keuangan seperti laporan harian, perhitungan laba rugi, arus kas (cash flow), serta menu pengaturan sistem aplikasi.
// Struktur Objek: Menggunakan pola { items: [...] } agar komponen Sidebar dapat dengan mudah menyisipkan garis pemisah (divider) secara otomatis di antara kelompok-kelompok menu tersebut.