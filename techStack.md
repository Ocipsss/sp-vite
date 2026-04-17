# ##### TECH STACK ##### #

## I. Core Infrastructure (Pondasi Utama) ##

Kebutuhan : Framework UI
Teknologi : Vue 3 (Vite 7)
Fitur Wajib : Composition API & SFC: Menggunakan script setup untuk kode yang lebih modular. Teleport & Suspense: Untuk menangani komponen global seperti Modal atau Async loading.

Kebutuhan : Build Tools
Teknologi : Vite 7
Fitur Wajib : Hot Module Replacement (HMR): Update kode instan saat development. Optimized Rollup Build: Membagi kode (splitting) agar ukuran file yang di-download user lebih kecil.

Kebutuhan : Static Typing & Maintainability
Teknologi : TypeScript
Fitur Wajib : Strict Mode: Mencegah variabel bernilai undefined/null. Interface & Types: Definisi data produk dan transaksi yang konsisten di seluruh aplikasi.

Kebutuhan : Routing & Navigation
Teknologi : Vue Router 4
Fitur Wajib : Lazy Loading Routes: Halaman hanya di-load saat dibuka. Navigation Guards: Melindungi halaman rahasia agar tidak bisa diakses user tanpa izin.

Kebutuhan : State Management
Teknologi : Pinia
Fitur Wajib : Persisted State: Keranjang belanja tidak hilang meski halaman di-refresh. Action Subscriptions: Memantau setiap perubahan stok secara global.

---

## II. Data & Storage Layer (Offline-First) ##

Kebutuhan : Database Lokal
Teknologi : Dexie.js (IndexedDB Wrapper)
Fitur Wajib : Schema Versioning: Migrasi tabel tanpa hapus data lama. LiveQuery: UI otomatis update saat database lokal berubah. Backup/Restore: Ekspor data ke .json untuk cadangan manual pemilik toko.

Kebutuhan : Database Cloud
Teknologi : Firebase Firestore
Fitur Wajib : Offline Persistence: SDK otomatis simpan data saat offline dan kirim saat online. Real-time Listeners: Sinkronisasi stok barang antar perangkat kasir secara instan.

Kebutuhan : Cloud Storage (Penyimpanan Gambar)
Teknologi : Firebase Storage
Fitur Wajib : Image Hosting: Simpan foto produk secara cloud dengan URL yang aman. Caching Headers: Memastikan gambar tidak di-download berulang kali untuk menghemat kuota.

Kebutuhan : Client-side Image Compression
Teknologi : browser-image-compression
Fitur Wajib : Auto-Resize: Mengecilkan foto HP (5MB+) menjadi (<200KB) secara otomatis. Aspect Ratio Maintainer: Menjaga foto produk tetap proporsional (tidak penyet).

---

## III. UI/UX & Styling ##

Kebutuhan : CSS / Styling
Teknologi : Tailwind CSS 4
Fitur Wajib : JIT Engine: Kompilasi gaya CSS super cepat sesuai kebutuhan. Responsivitas: Menjamin tampilan rapi di layar HP, Tablet, hingga Monitor Kasir.

Kebutuhan : Accessible UI
Teknologi : Radix Vue
Fitur Wajib : Keyboard Navigation: Operasi kasir bisa menggunakan tombol keyboard (Enter, Tab, Esc). Focus Management: Fokus otomatis ke kolom input saat modal/dialog terbuka.

Kebutuhan : Icons
Teknologi : Lucide Vue
Fitur Wajib : Tree Shaking: Hanya memuat icon yang digunakan agar file tetap ringan. Visual Consistency: Set icon yang bersih dan seragam untuk seluruh menu aplikasi.

Kebutuhan : User Feedback & Progress Bar
Teknologi : nprogress & Vue-Sonner
Fitur Wajib : Progress Bar: Indikator loading halus di bagian atas layar. Stacked Toasts: Notifikasi transaksi sukses yang cantik dan tidak saling bertumpuk.

---

## IV. Hardware & Features ##

Kebutuhan : Barcode Scanner
Teknologi : html5-qrcode
Fitur Wajib : Camera Selection: Fitur memilih kamera belakang atau depan. Torch Control: Kontrol senter untuk scan di area toko yang minim cahaya.

Kebutuhan : Printer System
Teknologi : esc-pos-encoder & Canvas
Fitur Wajib : Template Struk: Layout struk belanja yang profesional (Header, Item, Total). Logo Printing: Mengolah gambar logo menjadi format hitam-putih untuk printer termal.

Kebutuhan : Composition Utilities
Teknologi : VueUse
Fitur Wajib : useDebounceFn: Mencegah double-input saat scan barcode. useOnline: Deteksi status internet secara reaktif untuk peringatan mode offline.

Kebutuhan : PWA (Progressive Web App)
Teknologi : vite-plugin-pwa
Fitur Wajib : Service Worker: Aplikasi tetap bisa dibuka tanpa koneksi internet. Prompt Install: Logika untuk memicu tombol "Install Ke Layar Utama" di perangkat user.

---

## V. Security, Testing & Monitoring ##

Kebutuhan : Auth System
Teknologi : Firebase Auth
Fitur Wajib : Login Persistence: User tetap masuk tanpa perlu login ulang setiap saat. Role-based Access: Membatasi hak akses antara Owner (Laporan) dan Kasir (Penjualan).

Kebutuhan : Form Validation
Teknologi : Vee-Validate & Zod
Fitur Wajib : Real-time Validation: Pesan error muncul seketika saat salah input. Schema Validation: Memastikan tipe data (angka/teks) benar sebelum masuk ke database.

Kebutuhan : Security & Protection
Teknologi : DOMPurify & Route Guards
Fitur Wajib : XSS Protection: Membersihkan input berbahaya dari kolom form. Access Control: Menutup akses halaman Admin dari user yang tidak berwenang.

Kebutuhan : Error Tracking & Monitoring
Teknologi : Sentry (SDK for Vue)
Fitur Wajib : Real-time Reporting: Laporan otomatis jika aplikasi crash di HP user. Breadcrumbs: Melacak aktivitas terakhir user sebelum terjadi error.

Kebutuhan : Logic Testing (QA)
Teknologi : Vitest
Fitur Wajib : Unit Testing: Menguji otomatis rumus matematika pada kasir dan stok. Fast Watch Mode: Menjalankan tes secara instan setiap kali ada perubahan kode.

---

## VI. Data Handling & Tooling ##

Kebutuhan : Data Formatting
Teknologi : Day.js & Intl
Fitur Wajib : IDR Currency: Format otomatis angka ke Rupiah. Relative Time: Menampilkan waktu transaksi seperti "5 menit yang lalu".

Kebutuhan : Export Data (Laporan)
Teknologi : XLSX (SheetJS)
Fitur Wajib : Excel Export: Mengubah data penjualan menjadi file .xlsx tanpa backend. Auto-column Width: Menyesuaikan lebar kolom Excel secara otomatis agar rapi.

Kebutuhan : API Handling (HTTP Client)
Teknologi : Axios
Fitur Wajib : Interceptors: Otomatis menyisipkan token keamanan di setiap request. Timeout Handling: Membatalkan proses jika koneksi server terlalu lambat.

Kebutuhan : Development Tooling
Teknologi : vite-plugin-vue-devtools
Fitur Wajib : State Inspector: Memantau isi database dan Pinia secara visual. Performance Timeline: Menganalisa kecepatan render setiap komponen.

