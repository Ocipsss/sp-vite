import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css' 
import 'remixicon/fonts/remixicon.css'
import App from './App.vue'
import router from './router'
import { auth } from './api/firebase'
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { setupSyncHooks, startPullSync } from './api/sync'
import { db } from './database'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Fungsi untuk memulai aplikasi setelah Login & DB siap
const initApp = () => {
  db.open().then(() => {
    console.log("✅ Database SinarPagiDB Aktif");
    app.mount('#app');
  });
};

// Pantau status Login
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("🔐 User terautentikasi:", user.email);
    setupSyncHooks();
    startPullSync(); // Jalankan sync hanya SETELAH login
    initApp();
  } else {
    console.log("🔓 Belum login, mencoba login otomatis...");
    // Ganti email & password dengan akun Firebase kamu yang asli
    signInWithEmailAndPassword(auth, "hudzshop@gmail.com", "07NovembeR21")
      .catch(err => {
        console.error("❌ Login Gagal:", err.message);
        initApp(); // Tetap jalankan app meski login gagal (offline mode)
      });
  }
});



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah Main Entry Point (main.ts) atau berkas instruksi utama yang dijalankan pertama kali saat aplikasi Sinar Pagi POS dimuat. Berkas ini bertanggung jawab untuk merakit seluruh bagian aplikasi (Vue, Pinia, Router), mengatur sistem autentikasi keamanan melalui Firebase, serta memastikan database lokal (IndexedDB) sudah siap digunakan sebelum tampilan aplikasi muncul di layar pengguna. File ini juga berfungsi sebagai pemicu otomatisasi sinkronisasi data cloud agar data produk di HP kasir selalu sama dengan data di server pusat.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-11: Mengimpor seluruh mesin utama aplikasi; mulai dari framework Vue, state management Pinia, CSS global, ikon (RemixIcon), router navigasi, hingga modul database dan sinkronisasi Firebase.
// Baris 13-16: Inisialisasi awal; membuat instance aplikasi Vue dan mendaftarkan Pinia (untuk penyimpanan data sementara) serta Router (untuk perpindahan halaman).
// Baris 19-24: Fungsi initApp; sebuah prosedur pengaman yang memastikan koneksi ke database lokal SinarPagiDB berhasil dibuka (db.open) sebelum aplikasi benar-benar ditampilkan (app.mount).
// Baris 27: Fungsi onAuthStateChanged; fitur keamanan Firebase yang memantau secara real-time apakah kasir sudah dalam kondisi login atau belum.
// Baris 28-32: Logika Jika Sudah Login; jika akun terdeteksi, aplikasi akan mengaktifkan sistem pengait sinkronisasi (setupSyncHooks), menarik data terbaru dari cloud (startPullSync), lalu menjalankan aplikasi.
// Baris 33-35: Logika Jika Belum Login; aplikasi akan mencoba melakukan proses login otomatis menggunakan kredensial yang tersimpan untuk mempermudah kasir agar tidak perlu mengetik email/password setiap kali membuka aplikasi.
// Baris 36-41: Penanganan Login Otomatis; menggunakan fungsi signInWithEmailAndPassword. Jika berhasil, sistem akan masuk ke tahap sinkronisasi; jika gagal (misal: tidak ada internet), aplikasi tetap akan dijalankan (initApp) agar kasir tetap bisa berjualan dalam mode offline.
// Baris 4-5: Memastikan file style.css dan font ikon dimuat secara global agar seluruh desain Tailwind dan simbol-simbol navigasi muncul dengan benar di semua halaman.