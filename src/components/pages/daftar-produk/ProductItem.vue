<template>
  <div 
    @click="$emit('click', product)"
    class="bg-white p-4 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all cursor-pointer"
  >
    <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
      <img v-if="product.image" :src="product.image" class="w-full h-full object-cover">
      <i v-else class="ri-shopping-bag-3-fill text-blue-300 text-xl"></i>
    </div>
    
    <div class="flex-1 min-w-0">
      <div class="text-[13px] font-black text-slate-800 uppercase truncate">{{ product.name }}</div>
      <div class="flex items-center gap-2 mt-0.5">
          <span class="text-[9px] text-slate-400 font-bold uppercase">{{ product.code || 'Tanpa Kode' }}</span>
          <span v-if="product.category" class="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">
            {{ product.category }}
          </span>
      </div>
      <div class="text-[11px] font-black text-blue-600 mt-1">{{ formatRupiah(product.price_sell) }}</div>
    </div>

    <div class="flex flex-col items-end gap-1">
      <span class="text-[10px] font-black px-3 py-1 rounded-xl" 
            :class="product.qty <= 5 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'">
        {{ product.qty }} <span class="text-[8px] opacity-60 uppercase">{{ product.unit }}</span>
      </span>
      <i class="ri-arrow-right-s-line text-slate-300"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRupiah } from "@/utils/formatters";
import type { Product } from "@/types";

defineProps<{ product: Product }>();
defineEmits(['click']);
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen ProductItem.vue yang berfungsi sebagai Kartu Tampilan Produk (Product Card) tunggal dalam daftar inventaris aplikasi Sinar Pagi POS. Komponen ini dirancang sangat ringkas dan informatif (compact UI) untuk memudahkan kasir memantau stok dan harga barang secara cepat. Keunggulan utamanya adalah adanya indikator visual otomatis yang akan berubah warna menjadi merah jika stok barang menipis, memberikan peringatan dini bagi pengelola toko untuk segera melakukan pengisian stok (restock).

PENJELASAN FUNGSI TIAP BARIS:
Baris 2-5: Kontainer Utama; menggunakan layout 'flex' untuk menyusun elemen secara horizontal. Dilengkapi dengan efek 'active:scale-95' yang memberikan sensasi membal (feedback haptik visual) saat kartu ditekan oleh jari pengguna di layar sentuh.
Baris 7-11: Area Gambar/Ikon; menampilkan foto produk jika tersedia. Jika tidak ada foto, sistem secara otomatis menampilkan ikon tas belanja (ri-shopping-bag-3-fill) dengan latar belakang biru muda yang lembut.
Baris 13-15: Informasi Nama; menampilkan nama produk dalam format huruf besar (uppercase) dan tebal. Menggunakan class 'truncate' agar nama yang terlalu panjang tidak merusak tata letak (otomatis terpotong dengan titik-titik).
Baris 16-22: Badge Barcode & Kategori; menyajikan kode unik barang dan label kategori dalam bentuk badge kecil berwarna abu-abu agar informasi teknis tetap terlihat tanpa mengganggu pandangan mata.
Baris 23: Tampilan Harga; menampilkan harga jual produk dengan warna biru mencolok menggunakan format Rupiah yang sudah dibersihkan dari angka desimal.
Baris 27-31: Indikator Stok Pintar; bagian ini menggunakan logika ':class'. Jika jumlah stok (qty) bernilai 5 atau kurang, latar belakang akan berubah menjadi merah (bg-red-50) sebagai tanda peringatan. Jika stok aman, akan berwarna abu-abu standar.
Baris 32: Ikon Navigasi; menampilkan simbol panah ke kanan (ri-arrow-right-s-line) sebagai petunjuk visual bahwa kartu ini bisa diklik untuk melihat detail lebih lanjut.
Baris 37-41: Bagian Script; mengimpor fungsi 'formatRupiah' untuk merapikan angka harga dan mendefinisikan 'Props' agar komponen ini bisa menerima data produk yang berbeda-beda dari halaman induk. -->