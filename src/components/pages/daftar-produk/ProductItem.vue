<template>
  <div 
    @click="$emit('click', product)"
    class="bg-white p-4 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all cursor-pointer"
  >
    <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
      <img v-if="product.image" :src="product.image" class="w-full h-full object-cover">
      <i v-else class="ri-shopping-bag-3-fill text-blue-300 text-xl"></i>
    </div>
    
    <div class="flex-1 min-w-0">
      <div class="text-[13px] font-black text-slate-800 uppercase truncate">{{ product.name }}</div>
      <div class="flex items-center gap-2 mt-0.5">
          <span class="text-[9px] text-slate-400 font-bold uppercase">{{ product.code || 'Tanpa Kode' }}</span>
          <span v-if="product.category" class="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">
            {{ product.category }}
          </span>
      </div>
      <div class="text-[11px] font-black text-blue-600 mt-1">{{ formatRupiah(product.price_sell) }}</div>
    </div>

    <div class="flex flex-col items-end gap-1">
      <span class="text-[10px] font-black px-3 py-1 rounded-xl" 
            :class="product.qty <= 5 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'">
        {{ product.qty }} <span class="text-[8px] opacity-60 uppercase">{{ product.unit }}</span>
      </span>
      <i class="ri-arrow-right-s-line text-slate-300"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatRupiah } from "../../../utils/formatters";
import type { Product } from "../../../types";

defineProps<{ product: Product }>();
defineEmits(['click']);
</script>