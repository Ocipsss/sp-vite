<template>
  <div :class="ui.modalOverlay" @click.self="$emit('close')">
    <div :class="ui.modalContent">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs">Update Produk</h3>
        <button @click="$emit('close')" :class="ui.closeBtn">
          <i class="ri-close-line text-xl"></i>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label :class="ui.label">Nama Produk</label>
          <input v-model="form.name" type="text" :class="[ui.input, 'uppercase text-sm']">
        </div>

        <div>
          <label :class="ui.label">Kategori</label>
          <div class="relative">
            <select v-model="form.category" :class="[ui.input, 'appearance-none']">
                <option value="">Tanpa Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <i class="ri-arrow-down-s-line"></i>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label :class="[ui.label, 'text-red-400']">Harga Modal</label>
            <input 
              v-model="displayModal" 
              @input="updatePrice('price_modal', $event)" 
              type="text" 
              inputmode="numeric" 
              :class="[ui.input, 'bg-red-50/50 border-red-100 text-red-500 text-center font-black']"
            >
          </div>
          <div>
            <label :class="[ui.label, 'text-blue-500']">Harga Jual</label>
            <input 
              v-model="displaySell" 
              @input="updatePrice('price_sell', $event)" 
              type="text" 
              inputmode="numeric" 
              :class="[ui.input, 'bg-blue-50 border-blue-100 text-blue-600 text-center font-black']"
            >
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label :class="ui.label">Stok</label>
            <input v-model.number="form.qty" type="number" :class="[ui.input, 'text-center']">
          </div>
          <div>
            <label :class="ui.label">Satuan</label>
            <input v-model="form.unit" type="text" :class="[ui.input, 'text-center uppercase']">
          </div>
        </div>
      </div>

      <BaseButton 
        variant="primary" 
        block 
        size="lg" 
        label="SIMPAN PERUBAHAN" 
        class="mt-8" 
        @click="$emit('save', form)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { formatNumber } from "@/utils/formatters";
import BaseButton from "@/common/BaseButton.vue";
import type { Product } from "@/types";

const props = defineProps<{ 
  product: Product | null,
  categories: any[]
}>();

const emit = defineEmits(['close', 'save']);

// --- UI STYLES (Pengganti @apply) ---
const ui = {
  modalOverlay: "fixed inset-0 z-120 flex items-end justify-center p-4 bg-slate-900/80 backdrop-blur-md",
  modalContent: "bg-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl animate-slide-up overflow-y-auto max-h-[90vh]",
  closeBtn: "bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-transform",
  label: "text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block",
  input: "w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
};

// --- LOGIC & STATE ---
const form = ref<Product>({ ...props.product } as Product);
const displayModal = ref(formatNumber(form.value.price_modal));
const displaySell = ref(formatNumber(form.value.price_sell));

const updatePrice = (field: 'price_modal' | 'price_sell', event: any) => {
  let rawValue = event.target.value.replace(/\D/g, "");
  let numValue = parseInt(rawValue) || 0;
  form.value[field] = numValue;
  
  if (field === 'price_modal') displayModal.value = formatNumber(numValue);
  if (field === 'price_sell') displaySell.value = formatNumber(numValue);
};

// Handle Barcode Scan
const handleScan = (e: any) => {
  form.value.code = e.detail;
};

onMounted(() => window.addEventListener('barcode-scanned-edit', handleScan));
onUnmounted(() => window.removeEventListener('barcode-scanned-edit', handleScan));
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen ProductEditModal.vue yang berfungsi sebagai formulir pembaruan data produk (Update Form) dalam aplikasi Sinar Pagi POS. Komponen ini dirancang dengan antarmuka yang sangat informatif, menggunakan pemisahan warna yang jelas (merah untuk Harga Modal dan biru untuk Harga Jual) guna membantu kasir atau admin menghindari kesalahan input. Fitur unggulannya adalah pemformatan angka otomatis secara real-time saat mengetik dan dukungan pemindaian barcode langsung ke dalam formulir menggunakan sistem event listener.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-10: Template Overlay & Header; menciptakan latar belakang gelap dengan efek blur (backdrop-blur-md) dan jendela modal yang muncul dari bawah. Bagian header berisi judul "Update Produk" dan tombol tutup (close).
Baris 13-28: Bidang Input Nama & Kategori; menyediakan input teks otomatis huruf besar (uppercase) untuk nama produk dan menu pilihan (select) untuk kategori yang datanya diambil dari database.
Baris 30-52: Grid Input Harga; area krusial yang memisahkan Harga Modal dan Harga Jual. Menggunakan 'inputmode="numeric"' agar keyboard angka otomatis muncul di perangkat mobile.
Baris 34 & 45: Penggunaan variabel displayModal dan displaySell; menampilkan angka dengan format pemisah ribuan (titik) agar kasir mudah membaca nominal jutaan/ratusan ribu tanpa salah hitung nol.
Baris 54-65: Grid Stok & Satuan; input untuk mengatur jumlah barang tersedia dan satuan penjualannya (misal: PCS, BOX, atau KG).
Baris 68-75: Tombol Simpan; menggunakan BaseButton varian 'primary' yang lebar (block) untuk mengirimkan seluruh data formulir kembali ke halaman induk untuk disimpan ke database.
Baris 79-82: Bagian Script; mengimpor fungsi formatNumber untuk merapikan tampilan angka dan mendefinisikan Props (data masuk) serta Emits (sinyal keluar).
Baris 87-93: Objek UI Styles; pengganti sistem @apply Tailwind. Variabel ini menyimpan kumpulan class CSS agar kode HTML di bagian atas tetap bersih dan mudah dibaca (scannable).
Baris 96-98: Inisialisasi Form; membuat salinan data produk asli ke dalam variabel reaktif 'form' agar perubahan yang sedang diketik tidak langsung merusak data asli sebelum tombol simpan ditekan.
Baris 101-109: Fungsi updatePrice; logika cerdas yang membersihkan input dari karakter non-angka, mengubahnya kembali menjadi angka murni untuk database, dan memperbarui tampilan visual dengan format ribuan secara instan.
Baris 112-118: Fitur Barcode Scan; secara otomatis menangkap hasil scan dari perangkat luar dan memasukkannya ke kolom kode produk tanpa perlu diketik manual.
Baris 121-129: CSS Animation; mengatur transisi gerak jendela modal dari bawah ke atas dengan efek pegas (cubic-bezier) agar terasa lebih responsif dan modern. -->