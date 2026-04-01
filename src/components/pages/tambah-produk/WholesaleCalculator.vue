<template>
  <div class="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col gap-4">
    <div class="flex justify-between items-center px-1">
      <div class="flex flex-col">
        <span class="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] italic leading-none">Kalkulator Grosir</span>
      </div>
      <i class="ri-calculator-line text-blue-400 text-xl"></i>
    </div>
    
    <div class="space-y-1.5">
      <label class="text-[9px] font-black text-blue-600 uppercase block ml-1 tracking-wider">Harga 1 Pak / Dus</label>
      <div class="relative flex items-center h-12 rounded-xl bg-white border border-blue-100 px-4 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <span class="text-blue-300 font-bold text-xs mr-1">Rp</span>
        <input 
          :value="displayPack" 
          @input="handlePackPrice"
          @focus="selectAll"
          type="text" 
          inputmode="numeric" 
          pattern="[0-9]*"
          class="flex-1 bg-transparent border-none outline-none font-black text-blue-800 p-0" 
          placeholder="0"
        >
      </div>
    </div>

    <div class="space-y-1.5">
      <label class="text-[9px] font-black text-blue-600 uppercase block ml-1 tracking-wider">Isi (Jumlah Satuan di Dalam)</label>
      <div class="relative flex items-center h-12 rounded-xl bg-white border border-blue-100 px-4 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <input 
          :value="product.pack_size" 
          @input="handlePackSize"
          @focus="selectAll"
          type="text" 
          inputmode="numeric"
          pattern="[0-9]*"
          class="flex-1 bg-transparent border-none outline-none font-black text-blue-800 p-0" 
          placeholder="1"
        >
        <span class="text-blue-300 font-bold text-[10px] uppercase ml-1">{{ product.unit || 'pcs' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['product', 'displayPack']);
const emit = defineEmits(['updatePrice']);

// Memastikan teks langsung terblok saat diklik agar bisa langsung ditimpa
const selectAll = (e: FocusEvent) => {
  const target = e.target as HTMLInputElement;
  // Sedikit delay agar browser mobile sempat memproses fokus sebelum select
  setTimeout(() => {
    target.select();
    target.setSelectionRange(0, 9999); // Untuk kompatibilitas iOS
  }, 50);
};

const handlePackPrice = (e: any) => {
  const val = parseInt(e.target.value.replace(/\D/g, "")) || 0;
  emit('updatePrice', 'pack_price', val);
};

const handlePackSize = (e: any) => {
  const val = parseInt(e.target.value.replace(/\D/g, "")) || 0;
  // Langsung update prop secara reaktif
  props.product.pack_size = val;
  // Trigger hitung ulang harga modal satuan di parent
  emit('updatePrice', 'pack_price', props.product.pack_price);
};
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen WholesaleCalculator.vue yang berfungsi sebagai Fitur Pembagi Harga Grosir untuk aplikasi Sinar Pagi POS. Komponen ini dirancang untuk mempermudah kasir dalam menentukan "Harga Modal per Biji" (pcs) ketika barang dibeli dalam jumlah besar (seperti 1 dus atau 1 pak). Dengan memasukkan total harga satu dus dan jumlah isi di dalamnya, sistem akan secara otomatis melakukan pembagian matematika di latar belakang dan mengisi kolom harga modal secara akurat, sehingga meminimalisir kesalahan hitung manual yang berisiko merugikan toko.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-3: Kontainer Visual; menggunakan latar belakang biru transparan (bg-blue-50/50) dan garis tepi lembut untuk memisahkan area kalkulator ini dari formulir utama, memberikan kesan sebagai fitur "asisten tambahan".
Baris 4-10: Header Kalkulator; menampilkan judul "Kalkulator Grosir" dengan ikon kalkulator (ri-calculator-line) sebagai petunjuk fungsi bagi pengguna.
Baris 12-25: Input Harga Grosir; kolom tempat kasir memasukkan total harga beli untuk 1 dus atau pak. Menggunakan 'displayPack' untuk menampilkan format titik ribuan agar angka mudah dibaca saat diketik.
Baris 27-40: Input Jumlah Isi; kolom untuk menentukan berapa banyak barang (pcs) yang ada di dalam satu dus tersebut. Di sebelah kanan kolom terdapat label unit produk (misal: 'pcs') yang diambil secara dinamis dari data produk.
Baris 44: Script Setup; mendefinisikan 'props' untuk menerima data produk dari induknya dan 'emit' untuk mengirimkan sinyal perubahan harga kembali ke formulir utama.
Baris 48-55: Fungsi selectAll; sebuah fitur kenyamanan (UX) yang sangat penting di HP. Saat kasir menyentuh kolom, seluruh teks akan otomatis terblokir (tersorot), sehingga mereka bisa langsung mengetik angka baru tanpa harus menghapus angka lama satu per satu.
Baris 57-60: Fungsi handlePackPrice; setiap kali kasir mengetik harga dus, fungsi ini membersihkan karakter non-angka (seperti titik) dan mengirimkan nilai murni (integer) ke komponen induk untuk diproses.
Baris 62-68: Fungsi handlePackSize; memperbarui jumlah isi barang di dalam objek produk secara langsung. Setelah jumlah isi berubah, fungsi ini memicu ('emit') kalkulasi ulang harga modal per satuan di komponen pusat (useProductForm).
Baris 20 & 35: Atribut Mobile-Friendly; penggunaan 'inputmode="numeric"' dan 'pattern="[0-9]*"' memastikan bahwa hanya papan ketik angka (numpad) yang muncul di perangkat Android atau iOS, mempercepat proses entri data. -->