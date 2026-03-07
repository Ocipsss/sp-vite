<template>
  <div class="flex gap-2 w-full px-1">
    <div class="relative flex-1 group">
      <input 
        :value="modelValue" 
        @input="handleInput"
        @focus="isFocused = true"
        type="text" 
        :placeholder="placeholder" 
        class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/10 outline-none text-sm z-20"
      >
      
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center z-30">
        <i v-if="!modelValue" class="ri-search-2-line text-slate-400 group-focus-within:text-blue-500"></i>
        <button v-else @click="clearSearch" class="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center active:scale-90 transition-transform">
          <i class="ri-close-line text-slate-500"></i>
        </button>
      </div>

              <transition name="fade">
      <div v-if="isFocused && suggestions.length > 0 && modelValue" 
        class="absolute top-full right-0 mt-2 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-[999]"
        style="left: -3rem; width: auto;" 
      >
        <div class="max-h-[350px] overflow-y-auto no-scrollbar">
          <div 
            v-for="p in suggestions" :key="p.id"
            @click="selectProduct(p)"
            class="px-6 py-4 hover:bg-slate-50 border-b border-slate-50 flex items-center gap-4 active:bg-blue-50 transition-colors cursor-pointer"
          >
            <div class="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
              <i class="ri-search-line text-slate-300 text-xs"></i>
            </div>
            <div class="flex-1 min-w-0 text-left">
              <div class="text-[13px] font-black text-slate-700 uppercase truncate" v-html="highlightText(p.name)"></div>
              <div class="text-[9px] text-slate-400 font-bold tracking-wider uppercase">{{ p.code || 'Tanpa Kode' }}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-[11px] font-black text-blue-600">{{ formatRupiah(p.price_sell) }}</div>
              <div class="text-[9px] font-bold text-slate-300 uppercase">{{ p.qty }} {{ p.unit }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    </div>
    
    <button 
      @click="cart.toggleScanner(true)"
      class="w-12 h-12 bg-blue-50 text-blue-600 border-none rounded-xl flex items-center justify-center active:bg-blue-100 transition-all shadow-sm shrink-0"
    >
      <i class="ri-qr-scan-2-line text-xl"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { db } from "../../database";
import { useCartStore } from '../../stores/cart';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);
const cart = useCartStore();

const isFocused = ref(false);
const suggestions = ref<any[]>([]);

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
  fetchSuggestions(val);
};

const fetchSuggestions = async (query: string) => {
  if (!query || query.length < 1) {
    suggestions.value = [];
    return;
  }

  const search = query.toLowerCase().trim();
  
  // Ambil data dan sortir berdasarkan "Starts With" (Logika Pintar)
  const allMatches = await db.table('products')
    .filter(p => p.name.toLowerCase().includes(search))
    .toArray();

  suggestions.value = allMatches.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aStarts = aName.startsWith(search);
    const bStarts = bName.startsWith(search);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return aName.localeCompare(bName);
  }).slice(0, 8);
};

const selectProduct = (p: any) => {
  emit('update:modelValue', ''); // Bersihkan input setelah pilih
  isFocused.value = false;
  window.dispatchEvent(new CustomEvent('open-product-detail', { detail: p.id }));
};

const clearSearch = () => {
  emit('update:modelValue', '');
  suggestions.value = [];
};

const highlightText = (text: string) => {
  const query = props.modelValue.trim();
  if (!query) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return text.replace(regex, '<span class="text-blue-600 font-black">$1</span>');
};

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(val || 0);
};

// Close popup saat klik di luar
window.addEventListener('click', (e) => {
  if (!(e.target as HTMLElement).closest('.relative')) {
    isFocused.value = false;
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
