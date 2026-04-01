<template>
  <div class="flex flex-col gap-3 pb-24 h-full overflow-y-auto no-scrollbar">
    <div class="p-5 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-5">
      
      <PhotoUploader v-model="product.image" />

      <div class="space-y-4 px-1">
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Nama Produk</label>
          <div class="relative flex items-center h-14 rounded-2xl bg-slate-50 border border-slate-100 px-5 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
            <input 
              v-model="product.name" 
              type="text" 
              class="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 p-0" 
              placeholder="Contoh: Indomie Goreng Pedas"
            >
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Kode / Barcode</label>
          <div class="relative flex items-center h-14 rounded-2xl bg-slate-50 border border-slate-100 pl-5 pr-2 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
            <input 
              v-model="product.code" 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*"
              @focus="selectAll"
              class="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 p-0" 
              placeholder="Scan atau manual..."
            >
            <button 
              type="button"
              @click="$emit('open-scanner')" 
              class="flex-none w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md shadow-blue-100"
            >
              <i class="ri-qr-scan-2-line text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <WholesaleCalculator 
        :product="product" 
        :displayPack="displayPack"
        @updatePrice="updateNumber"
      />

      <hr class="border-slate-100 my-1">

      <PriceInput 
        label="Harga Modal (/pcs)" 
        :displayValue="displayModal" 
        labelClass="text-red-500" 
        containerClass="bg-red-50 border-red-100 focus-within:ring-red-100 focus-within:ring-4"
        inputClass="text-red-600"
        @update="(val) => updateNumber('price_modal', val)"
      />

      <PriceInput 
        label="Harga Jual (/pcs)" 
        :displayValue="displaySell" 
        labelClass="text-emerald-600" 
        containerClass="bg-emerald-50 border-emerald-100 focus-within:ring-emerald-100 focus-within:ring-4"
        inputClass="text-emerald-700"
        @update="(val) => updateNumber('price_sell', val)"
      />

      <div class="space-y-1.5 px-1">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Stok Awal</label>
        <input 
          v-model.number="product.qty" 
          type="number" 
          inputmode="numeric"
          @focus="selectAll"
          class="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none font-black text-slate-700 transition-all placeholder:text-slate-300 placeholder:font-medium" 
          placeholder="0"
        >
      </div>

      <button 
        @click="saveProduct" 
        :disabled="isSaving"
        class="w-full mt-7 bg-blue-600 text-white h-16 rounded-3xl font-black shadow-lg shadow-blue-200 uppercase text-[13px] tracking-wider active:scale-95 transition-all disabled:opacity-50 active:bg-blue-700 flex items-center justify-center gap-2"
      >
        <i v-if="isSaving" class="ri-loader-4-line animate-spin text-lg"></i>
        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Produk' }}</span>
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
// Import Logika
import { useProductForm } from './useProductForm';

// Import Komponen Modular
import PhotoUploader from './PhotoUploader.vue';
import PriceInput from './PriceInput.vue';
import WholesaleCalculator from './WholesaleCalculator.vue';

defineEmits(['open-scanner']);

const { 
  product, 
  isSaving, 
  displayModal, 
  displaySell, 
  displayPack,
  updateNumber, 
  saveProduct 
} = useProductForm();

// Fungsi untuk memblokir teks saat input mendapatkan fokus
const selectAll = (e: FocusEvent) => {
  const target = e.target as HTMLInputElement;
  setTimeout(() => {
    target.select();
    if (window.innerWidth < 768) { // Tambahan khusus mobile
      target.setSelectionRange(0, 9999);
    }
  }, 50);
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen ProductForm.vue yang berfungsi sebagai Jantung Penginputan Data Barang (Master Data Entry) untuk aplikasi Sinar Pagi POS. Komponen ini merupakan formulir lengkap yang menyatukan berbagai modul fungsional—seperti pengunggah foto, pemindai barcode, dan kalkulator grosir—ke dalam satu antarmuka yang kohesif. Dirancang khusus untuk efisiensi tinggi, formulir ini memiliki fitur otomatisasi seperti "Auto-Select" pada kolom angka dan integrasi pemindai kamera, sehingga kasir dapat mendaftarkan barang baru dengan sangat cepat dan minim kesalahan ketik.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-4: Pembungkus Utama; menggunakan 'flex-col' dengan jarak (gap-3) dan padding bawah (pb-24) agar konten tidak tertutup oleh tombol navigasi utama. 'no-scrollbar' digunakan untuk menjaga tampilan layar tetap bersih.
Baris 6: Modul PhotoUploader; memanggil komponen pengambil foto produk yang sudah mendukung kompresi otomatis (v-model="product.image").
Baris 8-20: Input Nama Produk; kolom teks standar dengan efek 'focus-within' yang memberikan highlight biru lembut saat kasir mulai mengetik nama barang.
Baris 22-42: Input Barcode & Scanner; kolom unik yang mendukung input angka manual maupun melalui pemindai. Dilengkapi tombol ikon biru (ri-qr-scan-2-line) yang memicu pembukaan kamera scanner di HP.
Baris 45-49: WholesaleCalculator; sebuah modul cerdas yang membantu kasir menghitung harga per biji (pcs) secara otomatis jika barang dibeli dalam bentuk pak atau dus besar.
Baris 53-61: PriceInput Harga Modal; menggunakan komponen modular dengan warna merah (red-50) sebagai penanda visual biaya atau uang keluar.
Baris 63-71: PriceInput Harga Jual; menggunakan warna hijau (emerald-50) sebagai penanda visual pendapatan atau target keuntungan.
Baris 73-86: Input Stok Awal; kolom numerik untuk mengisi jumlah barang yang ada saat ini. Menggunakan 'inputmode="numeric"' agar papan tombol angka otomatis muncul di perangkat mobile.
Baris 88-95: Tombol Simpan; tombol aksi utama yang lebar (h-16). Memiliki status loading (isSaving) yang akan menampilkan ikon putar (ri-loader-4-line) dan menonaktifkan klik selama proses penyimpanan ke database berlangsung.
Baris 100-117: Bagian Script Setup; mengimpor logika pusat (useProductForm) dan sub-komponen modular lainnya. Memisahkan logika perhitungan dari tampilan agar kode lebih mudah dikelola.
Baris 120-130: Fungsi selectAll; sebuah fitur kenyamanan pengguna (UX) di mana seluruh teks di dalam kotak input akan langsung terblokir (tersorot) saat disentuh. Hal ini memudahkan kasir untuk langsung menimpa angka lama tanpa harus menghapusnya satu per satu menggunakan tombol backspace.
Baris 133-136: CSS Scoped; pengaturan gaya tambahan untuk menghilangkan batang penggulung (scrollbar) agar antarmuka terasa lebih seperti aplikasi native (Android/iOS) daripada situs web biasa. -->