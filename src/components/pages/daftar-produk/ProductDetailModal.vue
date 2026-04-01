<template>
  <div class="fixed inset-0 z-110 flex items-end justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="$emit('close')">
    <div class="bg-white w-full max-w-md rounded-[2.5rem] p-6 animate-slide-up shadow-2xl">
      <div class="flex justify-center mb-4"><div class="w-12 h-1.5 bg-slate-100 rounded-full"></div></div>
      
      <div v-if="product" class="text-center mb-6">
          <div class="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-3 overflow-hidden border border-slate-50">
              <img v-if="product.image" :src="product.image" class="w-full h-full object-cover">
              <i v-else class="ri-shopping-bag-3-line text-4xl text-blue-500"></i>
          </div>
          <h2 class="text-lg font-black text-slate-800 uppercase italic leading-none">{{ product.name }}</h2>
          <div class="flex justify-center gap-2 mt-3">
              <span class="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase">{{ product.category || 'Tanpa Kategori' }}</span>
              <span class="px-3 py-1 bg-blue-100 rounded-full text-[9px] font-black text-blue-600 uppercase">{{ product.code || 'Tanpa Barcode' }}</span>
          </div>
      </div>

      <div v-if="product" class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
              <div class="text-[9px] font-black text-slate-400 uppercase mb-1">Stok & Satuan</div>
              <div class="text-base font-black text-slate-800">{{ product.qty }} <small class="text-[10px] font-bold uppercase opacity-50">{{ product.unit }}</small></div>
          </div>
          <div class="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-100 text-right">
              <div class="text-[9px] font-black text-white/60 uppercase mb-1">Harga Jual</div>
              <div class="text-base font-black text-white">{{ formatRupiah(product.price_sell) }}</div>
          </div>
      </div>

      <div class="flex gap-3">
        <BaseButton variant="danger" block size="lg" label="HAPUS" @click="$emit('delete', product?.id)" />
        <BaseButton variant="primary" block size="lg" label="EDIT DATA" @click="$emit('edit', product)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRupiah } from "@/utils/formatters";
import BaseButton from "@/common/BaseButton.vue";
import type { Product } from "@/types";

defineProps<{ product: Product | null }>();
defineEmits(['close', 'edit', 'delete']);
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen ProductDetailModal.vue yang berfungsi sebagai jendela pop-up informasi detail barang di aplikasi Sinar Pagi POS. Komponen ini dirancang dengan gaya "Bottom Sheet" (muncul dari bawah layar), yang sangat ramah untuk penggunaan satu tangan pada perangkat mobile. Fungsinya adalah menyajikan ringkasan data produk—seperti foto, kategori, kode barcode, sisa stok, dan harga jual—serta menyediakan akses cepat bagi kasir atau admin untuk melakukan pengeditan data atau penghapusan barang dari inventaris.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-3: Area Template Utama; menggunakan latar belakang gelap transparan (bg-slate-900/60) dengan efek buram (backdrop-blur) untuk memberikan fokus penuh pada jendela detail yang muncul.
Baris 4-5: Desain Jendela; menggunakan sudut melengkung besar (rounded-[2.5rem]) dan animasi slide-up untuk memberikan kesan aplikasi modern dan premium.
Baris 6-15: Bagian Identitas Produk; menampilkan gambar produk (jika ada) atau ikon tas belanja default, diikuti dengan nama produk dalam format huruf besar (uppercase) dan tebal.
Baris 16-19: Label Kategori & Barcode; menampilkan badge kecil untuk kategori dan kode produk agar mudah dibaca sekilas.
Baris 22-26: Kartu Informasi Stok; menampilkan jumlah sisa stok beserta satuan barangnya (misal: pcs, dus, atau kg) dalam kotak berwarna abu-abu lembut.
Baris 27-31: Kartu Harga Jual; menampilkan harga jual barang dengan format Rupiah yang mencolok menggunakan latar belakang biru terang agar menjadi poin fokus utama bagi kasir.
Baris 34-37: Tombol Aksi (Action Buttons); menyediakan dua tombol utama, yakni tombol "HAPUS" dengan varian warna merah (danger) dan tombol "EDIT DATA" dengan varian warna biru (primary).
Baris 41-43: Bagian Script; mengimpor fungsi utilitas formatRupiah untuk merapikan tampilan angka harga dan komponen BaseButton sebagai standar tombol aplikasi.
Baris 45: Penggunaan defineProps; mendefinisikan bahwa komponen ini menerima data objek 'product' dari halaman induk (DaftarProduk.vue).
Baris 46: Penggunaan defineEmits; mendaftarkan perintah kirim data balik (event) ke halaman induk saat jendela ditutup, tombol edit ditekan, atau tombol hapus dikonfirmasi. -->