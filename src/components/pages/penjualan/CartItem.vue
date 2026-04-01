<template>
  <div class="bg-slate-50 p-4 rounded-4xl border border-slate-100 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div class="min-w-0 flex-1">
        <div class="text-[12px] font-black text-slate-700 uppercase leading-tight truncate pr-2">
          {{ item.name }}
        </div>
        <div class="text-[10px] font-bold text-slate-400 mt-1">
          {{ formatRupiah(item.price_sell) }} <span class="mx-1 opacity-30">×</span> {{ item.qty }}
        </div>
      </div>
      
      <div class="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
        <button @click="cart.updateQty(item.cartId, -1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 font-black active:bg-red-50">-</button>
        <span class="text-[12px] font-black text-slate-700 min-w-6 text-center">{{ item.qty }}</span>
        <button @click="cart.updateQty(item.cartId, 1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 font-black active:bg-blue-50">+</button>
      </div>
    </div>

    <div v-if="item.extraCharge > 0" class="flex justify-between items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
      <div class="flex items-center gap-2">
        <i class="ri-fire-fill text-orange-500 text-xs"></i>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-blue-800 uppercase tracking-tighter">{{ item.extraChargeName }}</span>
          <span class="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">
            {{ formatRupiah(item.extraCharge) }} × {{ item.extraChargeQty }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button @click="cart.updateExtraQty(item.cartId, -1)" class="w-7 h-7 flex items-center justify-center text-orange-500 font-black bg-white border border-blue-100 rounded-lg">-</button>
        <span class="text-[11px] font-black text-slate-700 min-w-4.5 text-center">{{ item.extraChargeQty }}</span>
        <button @click="cart.updateExtraQty(item.cartId, 1)" class="w-7 h-7 flex items-center justify-center text-blue-600 font-black bg-white border border-blue-100 rounded-lg">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "@/stores/cart";
import { formatRupiah } from "@/utils/formatters";
import type { CartItem } from "@/types";

defineProps<{ item: CartItem }>();
const cart = useCartStore();
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen CartItemCard.vue yang berfungsi sebagai Kartu Item di dalam keranjang belanja aplikasi Sinar Pagi POS. Komponen ini dirancang khusus untuk menangani interaksi cepat kasir saat mengatur jumlah (quantity) barang maupun jumlah jasa tambahan (seperti jasa giling atau seduh) dalam satu tampilan yang ringkas. Dengan desain berbasis baris yang intuitif, kasir dapat melihat detail harga satuan, total barang, serta biaya ekstra secara transparan sebelum melanjutkan ke proses pembayaran.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-3: Kontainer Utama; menggunakan latar belakang abu-abu sangat muda (bg-slate-50) dengan sudut melengkung besar (rounded-4xl) untuk memberikan kesan modern dan bersih pada daftar belanjaan.
Baris 4-10: Informasi Produk; menampilkan nama produk dalam format huruf besar (uppercase) dan tebal. Menggunakan 'truncate' agar nama produk yang sangat panjang tidak berantakan dan tetap rapi di layar ponsel.
Baris 11-13: Detail Harga & Qty; menyajikan informasi harga jual satuan dikalikan dengan jumlah yang sudah masuk ke keranjang, memudahkan kasir melakukan verifikasi harga sekilas.
Baris 16-20: Kontrol Jumlah Barang; menyediakan tombol minus (-) berwarna merah dan plus (+) berwarna biru. Tombol ini terhubung langsung ke fungsi 'updateQty' di Pinia Store untuk menambah atau mengurangi stok di keranjang secara real-time.
Baris 24: Logika Biaya Tambahan (v-if); area ini hanya akan muncul jika barang tersebut memiliki biaya jasa tambahan (extra charge). Ini menjaga antarmuka tetap bersih untuk barang yang tidak memiliki jasa ekstra.
Baris 25-33: Panel Jasa Ekstra; menggunakan warna latar biru muda (bg-blue-50) untuk membedakannya dari item utama. Menampilkan nama jasa (misal: "JASA GILING") serta perhitungan harga jasanya.
Baris 34-38: Kontrol Jumlah Jasa; menyediakan tombol kontrol khusus untuk menambah atau mengurangi jumlah jasa yang diberikan, terpisah dari jumlah produk utamanya. Sangat berguna jika pelanggan membeli 5 kopi tapi hanya ingin 3 di antaranya diseduh di tempat.
Baris 44-49: Bagian Script; mengimpor store keranjang (useCartStore) untuk mengelola data belanjaan, fungsi 'formatRupiah' untuk tampilan uang, dan tipe data 'CartItem' untuk memastikan keamanan struktur data.
Baris 51-52: Props & Store; mendefinisikan bahwa komponen ini menerima data 'item' dari daftar keranjang dan menghubungkan tombol-tombol aksi ke pusat kendali belanja (cart store). -->