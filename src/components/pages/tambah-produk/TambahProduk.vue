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
        class="w-full mt-7 bg-blue-600 text-white h-16 rounded-[1.5rem] font-black shadow-lg shadow-blue-200 uppercase text-[13px] tracking-wider active:scale-95 transition-all disabled:opacity-50 active:bg-blue-700 flex items-center justify-center gap-2"
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
