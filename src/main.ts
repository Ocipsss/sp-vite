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

const initApp = () => {
  db.open().then(() => {
    console.log("✅ Database SinarPagiDB Aktif");
    app.mount('#app');
  });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("🔐 User terautentikasi:", user.email);
    setupSyncHooks();
    startPullSync();
    initApp();
  } else {
    console.log("🔓 Belum login, mencoba login otomatis...");
    signInWithEmailAndPassword(auth, "hudzshop@gmail.com", "07NovembeR21")
      .catch(err => {
        console.error("❌ Login Gagal:", err.message);
        initApp();
      });
  }
});
