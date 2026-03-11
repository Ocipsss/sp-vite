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
import { formatNumber } from "../../../utils/formatters";
import BaseButton from "../../../common/BaseButton.vue";
import type { Product } from "../../../types";

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