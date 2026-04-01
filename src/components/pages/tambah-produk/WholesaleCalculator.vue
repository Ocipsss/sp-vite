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
const selectAll = (e: FocusEvent) => {
  const target = e.target as HTMLInputElement;
  setTimeout(() => {
    target.select();
    target.setSelectionRange(0, 9999);
  }, 50);
};

const handlePackPrice = (e: any) => {
  const val = parseInt(e.target.value.replace(/\D/g, "")) || 0;
  emit('updatePrice', 'pack_price', val);
};

const handlePackSize = (e: any) => {
  const val = parseInt(e.target.value.replace(/\D/g, "")) || 0;
  props.product.pack_size = val;
  emit('updatePrice', 'pack_price', props.product.pack_price);
};
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen Kalkulator Grosir (WholesaleCalculator.vue) yang berfungsi sebagai alat bantu hitung otomatis di dalam aplikasi Sinar Pagi. Komponen ini dirancang untuk mempermudah kasir saat melakukan input barang yang dibeli dalam jumlah besar (seperti 1 Dus atau 1 Pak) namun akan dijual secara eceran (per pcs). Dengan memasukkan total harga beli grosir dan jumlah isi di dalamnya, komponen ini secara cerdas akan menghitung pembagian harga modal satuan secara real-time, sehingga margin keuntungan yang ditetapkan pada sistem tetap akurat tanpa perlu melakukan perhitungan manual di luar aplikasi.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-10: Pembungkus Visual; area kalkulator dengan latar belakang biru muda (blue-50) yang memiliki ikon kalkulator dan label "Kalkulator Grosir" dengan tipografi italic black yang tegas.
Baris 12-24: Input Harga Grosir; field khusus untuk memasukkan harga beli total per Pak atau Dus. Dilengkapi dengan awalan simbol "Rp" dan format input numerik agar nyaman digunakan di perangkat mobile.
Baris 15-17: Binding Harga; menggunakan ':value="displayPack"' untuk menampilkan format ribuan dan '@input="handlePackPrice"' untuk menangkap setiap perubahan angka yang diketik pengguna.
Baris 26-37: Input Jumlah Isi; field untuk memasukkan berapa banyak jumlah barang satuan yang ada di dalam satu Pak tersebut (misal: isi 12 atau isi 40).
Baris 30-31: Binding Isi; terhubung ke property 'pack_size' dan memicu penghitungan ulang harga modal setiap kali jumlah isi diubah oleh kasir.
Baris 34: Label Satuan; menampilkan teks satuan secara dinamis (misal: 'pcs' atau 'btg') di ujung kolom input untuk memberikan konteks visual yang jelas.
Baris 41-42: Definisi Props & Emits; menerima data produk dan tampilan harga dari komponen induk (ProductForm), serta menyiapkan saluran 'updatePrice' untuk mengirim hasil hitungan kembali ke state utama.
Baris 43-49: Fungsi selectAll; fitur kenyamanan (UX) yang secara otomatis menyeleksi seluruh teks saat kolom input disentuh, sehingga pengguna bisa langsung menimpa angka lama tanpa harus menghapusnya satu per satu.
Baris 51-54: Fungsi handlePackPrice; membersihkan karakter non-angka dari input (seperti titik atau huruf) menggunakan regex, mengubahnya menjadi bilangan bulat (integer), lalu mengirimkan nilainya ke fungsi pembaru harga.
Baris 56-60: Fungsi handlePackSize; menangkap perubahan jumlah isi barang, memperbarui nilai 'pack_size' pada objek produk, dan memicu pengiriman ulang 'pack_price' agar harga modal satuan dihitung kembali secara otomatis oleh sistem. -->