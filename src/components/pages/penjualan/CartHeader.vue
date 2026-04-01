<template>
  <div class="absolute top-2 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
    <BaseButton 
      v-if="cart.items.length > 0"
      variant="danger" size="sm" icon="ri-refresh-line"
      class="pointer-events-auto rounded-full shadow-md shadow-red-100"
      @click="cart.resetCart()"
      title="Reset Keranjang"
    />
    <div v-else></div>

    <transition name="fade">
      <div 
        v-if="showJasaButton"
        class="relative flex items-center bg-white border border-blue-200 rounded-full px-3 py-2 shadow-md active:scale-95 transition-all pointer-events-auto cursor-pointer"
      >
        <i class="ri-customer-service-2-line text-blue-600 text-sm"></i>
        <select @change="onJasaSelected" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
          <option value="" disabled selected>+ JASA</option>
          <option v-for="j in listJasa" :key="j.id" :value="j.id">
            {{ j.name }} (+{{ formatNumber(j.price) }})
          </option>
        </select>
        <span class="text-[10px] font-black uppercase text-blue-700 ml-1.5 tracking-tighter">Tambah Jasa</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from "@/stores/cart";
import { formatNumber } from "@/utils/formatters";
import { CATEGORIES_WITH_SERVICE } from "@/constants/app";
import BaseButton from "@/common/BaseButton.vue";
import type { ServiceItem } from "@/types";

const props = defineProps<{ listJasa: ServiceItem[] }>();
const cart = useCartStore();

const showJasaButton = computed(() => 
  cart.items.some(item => item.category && CATEGORIES_WITH_SERVICE.includes(item.category))
);

const onJasaSelected = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selected = props.listJasa.find(j => j.id === target.value); 
  const lastItem = cart.items[cart.items.length - 1];

  if (selected && lastItem) {
    cart.setExtraCharge(lastItem.cartId, { name: selected.name, price: selected.price });
  }
  target.value = "";
};
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen ActionFloating.vue yang berfungsi sebagai Bilah Aksi Mengambang (Floating Action Bar) di bagian atas layar transaksi aplikasi Sinar Pagi POS. Komponen ini dirancang untuk memberikan akses cepat terhadap dua fungsi krusial: menghapus seluruh isi keranjang belanja (reset) dan menambahkan biaya jasa layanan (seperti jasa giling kopi atau jasa seduh) pada barang yang terakhir dimasukkan. Dengan desain yang minimalis dan transparan (pointer-events-none), komponen ini tetap terlihat modern tanpa menghalangi pandangan kasir terhadap daftar produk.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Kontainer Utama; diletakkan secara absolut di bagian atas layar dengan susunan 'flex justify-between' untuk memisahkan tombol reset di kiri dan tombol jasa di kanan.
Baris 3-10: Tombol Reset Keranjang; menggunakan BaseButton varian 'danger' (merah) yang hanya akan muncul (v-if) jika ada minimal satu barang di dalam keranjang. Tombol ini berfungsi mengosongkan keranjang dalam satu kali klik.
Baris 13-28: Logika Tombol Jasa; menggunakan transisi 'fade' agar muncul dengan halus. Tombol ini adalah tombol pintar yang hanya akan tampil (showJasaButton) jika barang di keranjang termasuk dalam kategori yang mendukung layanan jasa tambahan.
Baris 19-24: Elemen Select Tersembunyi; sebuah teknik UI di mana elemen <select> dibuat transparan (opacity-0) dan menutupi tombol visual. Saat kasir menekan tombol "Tambah Jasa", daftar pilihan jasa asli dari browser akan muncul.
Baris 33-40: Bagian Script Setup; mengimpor store keranjang (Pinia), fungsi format angka, serta konstanta kategori produk mana saja yang diperbolehkan memiliki biaya jasa tambahan.
Baris 42-43: Props & Store; menerima daftar jasa (listJasa) dari halaman induk dan menghubungkan komponen ke pusat data keranjang belanja (cart store).
Baris 45-47: Computed showJasaButton; jantung logika tampilan. Fungsi ini memeriksa seluruh isi keranjang (cart.items.some) dan mencocokkannya dengan daftar kategori khusus (CATEGORIES_WITH_SERVICE).
Baris 49: Fungsi onJasaSelected; dijalankan saat kasir memilih salah satu jasa dari menu dropdown.
Baris 50-54: Logika Pemberian Biaya; mencari data jasa yang dipilih, mengambil item terakhir yang baru saja dimasukkan ke keranjang (lastItem), lalu memanggil fungsi 'setExtraCharge' di store untuk menambahkan biaya jasa tersebut ke item tersebut.
Baris 55: Reset Target Value; mengembalikan nilai pilihan menu ke kosong agar kasir bisa memilih jasa yang sama kembali di kemudian hari jika diperlukan. -->