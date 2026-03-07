import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // <--- 1. WAJIB IMPORT ROUTER

// CSS & Icons
import './style.css'
import 'remixicon/fonts/remixicon.css'

// Database & Sync Logic
import { setupSyncHooks, startPullSync } from './api/sync'
import { db } from './database'

// Jalankan sistem sinkronisasi
setupSyncHooks();
startPullSync();

// 3. Inisialisasi Vue App
const app = createApp(App)
const pinia = createPinia()

// PASANG PLUGIN (Urutan sangat penting)
app.use(pinia)
app.use(router) // <--- 2. WAJIB REGISTER ROUTER DI SINI

// 4. Buka Database & Mount App
// Kita buka database dulu, tapi Router sudah ter-inject ke dalam instance 'app'
db.open().then(() => {
    console.log("✅ Database SinarPagiDB Aktif");
    app.mount('#app') 
}).catch(err => {
    console.error("❌ Gagal membuka database:", err);
    // Tetap mount app agar UI muncul (fallback)
    app.mount('#app')
});