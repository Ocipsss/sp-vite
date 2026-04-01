<template>
  <div class="fixed inset-0 z-100 bg-white flex flex-col p-6 animate-zoom-in">
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col">
        <span class="text-xs font-black uppercase tracking-widest text-blue-600">Scanner Aktif</span>
        <span class="text-[10px] text-gray-400 font-bold uppercase">Arahkan ke Barcode Produk</span>
      </div>
      <button @click="cart.toggleScanner(false)" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <i class="ri-close-line text-xl"></i>
      </button>
    </div>

    <div id="reader" class="rounded-[2.5rem] overflow-hidden border-4 border-blue-50 bg-slate-50 aspect-4/3 shadow-inner"></div>

    <div class="mt-auto py-8 text-center">
      <span class="text-[9px] text-gray-400 font-black tracking-[0.3em] uppercase italic">Sinar Pagi POS System</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useScanner } from '@/composables/useScanner';
import { db } from '@/database';

const cart = useCartStore();
const { startScanner, stopScanner } = useScanner();

const onScanSuccess = async (decodedText: string) => {
  // Get product from IndexedDB
  const product = await db.table('products').where('code').equals(decodedText).first();
  
  if (product) {
    cart.addToCart(product);
    if (navigator.vibrate) navigator.vibrate(100);
    cart.toggleScanner(false); // Otomatis tutup setelah sukses
  } else {
    alert(`Barcode ${decodedText} tidak terdaftar.`);
  }
};

onMounted(() => {
  // Delay sedikit agar elemen #reader sudah ter-render
  setTimeout(() => {
    startScanner("reader", onScanSuccess).catch(() => cart.toggleScanner(false));
  }, 300);
});

onBeforeUnmount(() => stopScanner());
</script>



<!-- 
DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen ScannerOverlay yang berfungsi sebagai antarmuka pemindai barcode (barcode scanner) berbasis kamera untuk aplikasi Sinar Pagi POS. Komponen ini dirancang untuk menutupi seluruh layar (overlay) saat aktif, memberikan pengalaman pengguna yang fokus dan intuitif. Fitur utamanya adalah integrasi langsung dengan database lokal (IndexedDB) untuk pencarian produk otomatis berdasarkan kode hasil pindaian, serta penggunaan feedback fisik (getaran/vibration) untuk menandakan pindaian berhasil.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Pembungkus utama overlay dengan posisi fixed (menutup seluruh layar), latar belakang putih, dan animasi zoom-in untuk efek transisi yang menarik.
Baris 3-12: Area header overlay; menampilkan status aktif scanner, petunjuk instruksi bagi kasir, dan tombol silang (X) untuk menutup mode scanner secara manual.
Baris 14: Elemen penampung (container) dengan ID "reader"; di sinilah library scanner akan merender tampilan kamera secara otomatis dengan styling sudut melengkung dan rasio layar 4:3.
Baris 16-18: Area footer dekoratif; menampilkan branding "Sinar Pagi POS System" dengan teks tipografi yang minimalis dan profesional.
Baris 22-25: Bagian script setup; mengimpor lifecycle hooks Vue, store keranjang (Pinia), komposabel scanner kustom, serta koneksi ke database lokal.
Baris 27-28: Inisialisasi akses ke store keranjang belanja dan destrukturisasi fungsi start/stop dari komposabel pemindai.
Baris 30: Fungsi onScanSuccess; callback asinkron yang akan dijalankan secara otomatis saat kamera berhasil membaca sebuah barcode.
Baris 32-33: Logika pencarian database; mencari data produk di tabel 'products' yang kolom 'code'-nya cocok dengan teks barcode hasil pindaian.
Baris 35-37: Penanganan jika produk ditemukan; memasukkan produk ke keranjang belanja, memberikan efek getar pada perangkat mobile (vibration API), dan menutup overlay scanner.
Baris 39: Penanganan jika produk tidak ditemukan; menampilkan pesan peringatan (alert) bahwa barcode tersebut tidak terdaftar di sistem.
Baris 43-47: Lifecycle onMounted; menjalankan fungsi startScanner setelah elemen HTML selesai dirender (dengan jeda 300ms untuk memastikan elemen "reader" tersedia di DOM).
Baris 49: Lifecycle onBeforeUnmount; memastikan kamera otomatis dimatikan saat komponen dihancurkan atau ditutup agar tidak menguras daya baterai.
-->