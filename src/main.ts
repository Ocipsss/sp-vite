import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css' 
import 'remixicon/fonts/remixicon.css'
import App from './App.vue'
import router from './router'
import { auth } from './api/firebase' // Import auth dari file tadi
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
