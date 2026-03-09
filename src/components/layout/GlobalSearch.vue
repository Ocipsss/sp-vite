<template>
  <div v-if="route.meta.showScanner" class="flex gap-2 w-full px-1 animate-fade-in">
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
          class="absolute top-full right-0 mt-2 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-999"
          style="left: -1rem; width: calc(100% + 2rem);" 
        >
          <div class="max-h-80 overflow-y-auto no-scrollbar">
            <div 
              v-for="p in suggestions" :key="p.id"
              @click="selectProduct(p)"
              class="px-6 py-4 hover:bg-slate-50 border-b border-slate-50 flex items-center gap-4 active:bg-blue-50 transition-colors cursor-pointer"
            >
              <div class="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                <i class="ri-search-line text-slate-300 text-xs"></i>
              </div>
              <div class="flex-1 min-w-0 text-left">
                <div class="text-[13px] font-black text-slate-700 uppercase truncate" v-html="highlightText(p.name, modelValue)"></div>
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
import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router'; // Tambahkan ini
import { useProductSearch } from '../../composables/useProductSearch';
import { useCartStore } from '../../stores/cart';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const route = useRoute(); // Inisialisasi route
const cart = useCartStore();

const { 
  suggestions, 
  isFocused, 
  fetchSuggestions, 
  highlightText, 
  formatRupiah 
} = useProductSearch();

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
  fetchSuggestions(val);
};

const selectProduct = (p: any) => {
  cart.addToCart(p); 
  emit('update:modelValue', ''); 
  isFocused.value = false;
  window.dispatchEvent(new CustomEvent('open-product-detail', { detail: p.id }));
};

const clearSearch = () => {
  emit('update:modelValue', '');
  suggestions.value = [];
};

const handleClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.relative')) {
    isFocused.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
.no-scrollbar::-webkit-scrollbar { display: none; }

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>