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
