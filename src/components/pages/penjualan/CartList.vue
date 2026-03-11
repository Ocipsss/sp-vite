<template>
  <div class="flex-1 flex flex-col min-h-0 bg-white mx-4 mt-2 rounded-t-[2.5rem] border-x border-t border-slate-100 shadow-sm relative overflow-hidden">
    <div ref="scrollContainer" class="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-20">
      
      <div v-if="cart.items.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300 py-20">
        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
          <i class="ri-shopping-basket-line text-3xl opacity-20"></i>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Belum ada barang</p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <CartItem v-for="item in cart.items" :key="item.cartId" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from "../../../stores/cart";
import { useAutoScroll } from "../../../composables/useAutoScroll";
import CartItem from "./CartItem.vue";

const cart = useCartStore();
useAutoScroll(() => cart.items);
</script>