<template>
  <div class="bg-slate-50 p-4 rounded-4xl border border-slate-100 flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <div class="min-w-0 flex-1">
        <div class="text-[12px] font-black text-slate-700 uppercase leading-tight truncate pr-2">
          {{ item.name }}
        </div>
        <div class="text-[10px] font-bold text-slate-400 mt-1">
          {{ formatRupiah(item.price_sell) }} <span class="mx-1 opacity-30">×</span> {{ item.qty }}
        </div>
      </div>
      
      <div class="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
        <button @click="cart.updateQty(item.cartId, -1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 font-black active:bg-red-50">-</button>
        <span class="text-[12px] font-black text-slate-700 min-w-6 text-center">{{ item.qty }}</span>
        <button @click="cart.updateQty(item.cartId, 1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 font-black active:bg-blue-50">+</button>
      </div>
    </div>

    <div v-if="item.extraCharge > 0" class="flex justify-between items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
      <div class="flex items-center gap-2">
        <i class="ri-fire-fill text-orange-500 text-xs"></i>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-blue-800 uppercase tracking-tighter">{{ item.extraChargeName }}</span>
          <span class="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">
            {{ formatRupiah(item.extraCharge) }} × {{ item.extraChargeQty }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button @click="cart.updateExtraQty(item.cartId, -1)" class="w-7 h-7 flex items-center justify-center text-orange-500 font-black bg-white border border-blue-100 rounded-lg">-</button>
        <span class="text-[11px] font-black text-slate-700 min-w-4.5 text-center">{{ item.extraChargeQty }}</span>
        <button @click="cart.updateExtraQty(item.cartId, 1)" class="w-7 h-7 flex items-center justify-center text-blue-600 font-black bg-white border border-blue-100 rounded-lg">+</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "../../../stores/cart";
import { formatRupiah } from "../../../utils/formatters";
import type { CartItem } from "../../../types";

defineProps<{ item: CartItem }>();
const cart = useCartStore();
</script>