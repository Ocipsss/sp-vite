<template>
  <div class="flex flex-col gap-3 pb-24 h-full overflow-y-auto no-scrollbar">
    
    <ScannerOverlay 
      v-if="showScanner" 
      mode="inventory" 
      @close="showScanner = false" 
      @detected="handleScanResult"
    />

    <div class="p-5 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-5">
      
      <PhotoUploader v-model="product.image" />

      <div class="space-y-4 px-1">
        <div class="space-y-1.5 relative">
          <div class="flex justify-between items-center ml-1">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Produk</label>
            <button v-if="isExistingProduct" @click="resetForm" class="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter transition-all active:scale-95">
              Batal / Barang Baru
            </button>
          </div>
          <div class="relative flex items-center h-14 rounded-2xl bg-slate-50 border border-slate-100 px-5 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all text-sm">
            <input 
              v-model="product.name" 
              type="text" 
              class="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 p-0 placeholder:font-medium" 
              placeholder="Cari atau ketik nama..."
              @focus="() => { if(suggestions.length > 0) showSuggestions = true }"
              @blur="() => { setTimeout(() => showSuggestions = false, 200) }"
            >
          </div>

          <div v-if="showSuggestions" class="absolute left-0 right-0 top-[76px] bg-white border border-slate-100 shadow-2xl rounded-2xl z-[100] overflow-hidden divide-y divide-slate-50 max-h-64 overflow-y-auto">
            <div 
              v-for="s in suggestions" 
              :key="s.id" 
              @click="selectProduct(s)" 
              class="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center active:bg-blue-100"
            >
              <div class="flex-1">
                <p class="font-black text-slate-800 text-sm uppercase tracking-tight">{{ s.name }}</p>
                <div class="flex gap-3 mt-0.5">
                  <p class="text-[10px] font-bold text-emerald-600">Rp {{ s.price_sell.toLocaleString() }}</p>
                  <p class="text-[10px] font-bold text-blue-500 uppercase">Stok: {{ s.qty }}</p>
                </div>
              </div>
              <i class="ri-arrow-right-up-line text-slate-300"></i>
            </div>
          </div>
        </div>

        <div class="space-y-1.5 px-0">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Kode / Barcode</label>
          <div class="relative flex items-center h-14 rounded-2xl bg-slate-50 border border-slate-100 pl-5 pr-2 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
            <input 
              v-model="product.code" 
              type="text" 
              inputmode="numeric" 
              pattern="[0-9]*"
              @focus="selectAll" 
              class="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 p-0 placeholder:font-medium text-sm" 
              placeholder="Scan atau manual..."
            >
            <button 
              type="button" 
              @click="showScanner = true" 
              class="flex-none w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-md shadow-blue-100"
            >
              <i class="ri-qr-scan-2-line text-lg"></i>
            </button>
          </div>
        </div>

        <div class="space-y-1.5 px-0">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Kategori Produk</label>
          <div class="relative flex items-center h-14 rounded-2xl bg-slate-50 border border-slate-100 px-5 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
            <select 
              v-model="product.category" 
              class="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 p-0 appearance-none cursor-pointer text-sm"
            >
              <option value="Umum">Umum</option>
              <option v-for="cat in listCategories" :key="cat.id" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
            <i class="ri-arrow-down-s-line text-slate-400 text-xl pointer-events-none"></i>
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
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
          {{ isExistingProduct ? 'Tambah Stok' : 'Stok Awal' }}
        </label>
        <input 
          v-model.number="product.qty" 
          type="number" 
          inputmode="numeric"
          @focus="selectAll"
          class="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none font-black text-slate-700 transition-all placeholder:text-slate-300" 
          placeholder="0"
        >
      </div>

      <button 
        @click="saveProduct" 
        :disabled="isSaving"
        class="w-full mt-7 bg-blue-600 text-white h-16 rounded-3xl font-black shadow-lg shadow-blue-200 uppercase text-[13px] tracking-wider active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <i v-if="isSaving" class="ri-loader-4-line animate-spin text-lg"></i>
        <span>{{ isSaving ? 'Menyimpan...' : (isExistingProduct ? 'Update Produk' : 'Simpan Produk') }}</span>
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'; // Tambahkan ref
import { useProductForm } from './useProductForm';
import PhotoUploader from './PhotoUploader.vue';
import PriceInput from './PriceInput.vue';
import WholesaleCalculator from './WholesaleCalculator.vue';
import ScannerOverlay from '@/components/layout/ScannerOverlay.vue'; // Import ScannerOverlay

const showScanner = ref(false); // State untuk scanner

const { 
  product, isSaving, listCategories, displayModal, displaySell, displayPack,
  suggestions, showSuggestions, isExistingProduct,
  updateNumber, saveProduct, selectProduct, resetForm 
} = useProductForm();

// LOGIKA PINTAR HASIL SCAN
// LOGIKA PINTAR HASIL SCAN (Mode Input Cepat)
const handleScanResult = (result: { code: string, product: any }) => {
  showScanner.value = false;

  if (result.product) {
    // KASUS: BARANG SUDAH ADA
    // Kita kasih peringatan, lalu kosongkan form biar siap scan barang lain
    alert(`⚠️ Produk "${result.product.name}" sudah ada di database!`);
    resetForm(); 
  } else {
    // KASUS: BARANG BARU
    // Langsung isi kodenya dan biarkan user isi nama & harga
    resetForm();
    product.value.code = result.code;
  }
};


const selectAll = (e: FocusEvent) => {
  const target = e.target as HTMLInputElement;
  setTimeout(() => {
    target.select();
    if (window.innerWidth < 768) target.setSelectionRange(0, 9999);
  }, 50);
};
</script>
