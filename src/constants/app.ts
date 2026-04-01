export const APP_NAME = 'Sinar Pagi POS';

export const CATEGORIES_WITH_SERVICE = ['Minyak', 'Kurma', 'Madu', 'Kitab'];

export const PAYMENT_METHODS = [
  { id: 'Tunai', label: 'TUNAI', icon: 'ri-money-dollar-circle-line' },
  { id: 'QRIS', label: 'QRIS', icon: 'ri-qr-code-line' },
  { id: 'Tempo', label: 'TEMPO', icon: 'ri-calendar-todo-line' }
] as const;

export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  CANCELED: 'canceled'
} as const;

export const SCANNER_CONFIG = { 
  fps: 10, 
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0 
};


// DESKRIPSI KESELURUHAN FILE:
// File ini adalah Pusat Konstanta (Global Constants) untuk aplikasi Sinar Pagi POS. File ini berfungsi sebagai "Single Source of Truth" atau satu-satunya sumber kebenaran data statis yang digunakan di berbagai komponen. Dengan mengumpulkan nama aplikasi, daftar kategori produk, metode pembayaran, status transaksi, hingga konfigurasi teknis pemindai di satu tempat, pengembang dapat melakukan perubahan global dengan cepat tanpa harus mencari dan mengubah kode di banyak file berbeda.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1: Ekspor konstanta APP_NAME; menyimpan nama resmi aplikasi "Sinar Pagi POS" untuk ditampilkan pada judul halaman, struk, atau branding UI.
// Baris 3: Ekspor array CATEGORIES_WITH_SERVICE; menentukan daftar kategori barang yang diizinkan memiliki biaya jasa tambahan (seperti jasa giling atau jasa seduh).
// Baris 5-9: Ekspor array PAYMENT_METHODS; mendefinisikan opsi pembayaran yang tersedia (Tunai, QRIS, Tempo) lengkap dengan label tampilan dan ikon Remix Icon yang digunakan pada menu kasir.
// Baris 11-15: Ekspor objek TRANSACTION_STATUS; standar penamaan status transaksi di database (Sukses, Tertunda, Dibatalkan) untuk menjaga konsistensi data antara frontend dan backend.
// Baris 17-21: Ekspor objek SCANNER_CONFIG; pengaturan teknis untuk library scanner, termasuk kecepatan frame per detik (FPS), ukuran kotak bidik (QR box), dan rasio layar agar kamera bekerja optimal.
// Baris 11 & 15: Penggunaan 'as const'; memastikan TypeScript memperlakukan nilai-nilai tersebut sebagai nilai tetap (literal) yang tidak bisa diubah secara tidak sengaja oleh bagian kode lain.