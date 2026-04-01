<template>
  <div class="flex-1 flex flex-col min-h-0 bg-white mx-4 mt-2 rounded-t-[2.5rem] border-x border-t border-slate-100 shadow-sm relative overflow-hidden">
    <div ref="scrollContainer" class="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-20">
      
      <div v-if="cart.items.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300 py-20">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
          <i class="ri-shopping-basket-line text-3xl opacity-20"></i>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Belum ada barang</p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <CartItem v-for="item in cart.items" :key="item.cartId" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cart";
import { useAutoScroll } from "@/composables/useAutoScroll";
import CartItem from "./CartItem.vue";

const cart = useCartStore();
useAutoScroll(() => cart.items);
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen CartList.vue yang berfungsi sebagai Area Daftar Belanja (Cart Container) dalam aplikasi Sinar Pagi POS. Komponen ini bertindak sebagai wadah dinamis yang menampilkan seluruh barang yang telah dipilih oleh kasir. Desainnya dioptimalkan untuk pengalaman pengguna mobile dengan sudut melengkung besar (rounded-t-[2.5rem]) di bagian atas dan fitur "Auto-Scroll" otomatis, sehingga setiap kali ada barang baru yang ditambahkan, layar akan bergeser sendiri ke item terbawah tanpa perlu digulirkan manual oleh kasir.

PENJELASAN FUNGSI TIAP BARIS:
Baris 2: Kontainer Utama; menggunakan 'flex-1' agar tingginya fleksibel mengisi ruang yang tersedia, serta menggunakan 'rounded-t' untuk memberikan estetika modern seperti kartu yang muncul dari bawah.
Baris 3: Area Scroll; memiliki properti 'overflow-y-auto' yang memungkinkan daftar barang digulirkan ke atas/bawah. Menggunakan class 'no-scrollbar' agar tampilan tetap bersih tanpa batang penggulung yang mengganggu.
Baris 5-10: Tampilan Kosong (Empty State); bagian ini menggunakan logika 'v-if' untuk mendeteksi jika keranjang benar-benar kosong. Jika kosong, akan muncul ikon keranjang belanja transparan dan teks petunjuk "Belum ada barang".
Baris 13-15: Daftar Barang Aktif; menggunakan logika 'v-else' dan perulangan 'v-for' untuk merender komponen 'CartItem' bagi setiap barang yang ada di dalam data pusat (store).
Baris 20-22: Bagian Script Setup; mengimpor pusat data keranjang (useCartStore) dan fitur cerdas 'useAutoScroll' untuk mengelola perilaku daftar belanjaan.
Baris 24: Inisialisasi Store; menghubungkan komponen dengan Pinia agar data barang yang masuk selalu sinkron secara real-time.
Baris 25: Pemicu Auto-Scroll; memantau perubahan pada daftar barang ('cart.items'). Setiap kali ada penambahan barang baru, fungsi ini akan memastikan barang tersebut langsung terlihat di posisi paling bawah layar kasir.
Baris 1: Penggunaan 'absolute' dan 'z-50' pada pembungkus luar (di komponen lain yang memanggil ini) memastikan daftar belanja ini tetap berada di atas elemen latar belakang lainnya. -->