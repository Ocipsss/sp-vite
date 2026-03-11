<template>
  <div class="absolute top-2 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
    <BaseButton 
      v-if="cart.items.length > 0"
      variant="danger" size="sm" icon="ri-refresh-line"
      class="pointer-events-auto rounded-full shadow-md shadow-red-100"
      @click="cart.resetCart()"
      title="Reset Keranjang"
    />
    <div v-else></div>

    <transition name="fade">
      <div 
        v-if="showJasaButton"
        class="relative flex items-center bg-white border border-blue-200 rounded-full px-3 py-2 shadow-md active:scale-95 transition-all pointer-events-auto cursor-pointer"
      >
        <i class="ri-customer-service-2-line text-blue-600 text-sm"></i>
        <select @change="onJasaSelected" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
          <option value="" disabled selected>+ JASA</option>
          <option v-for="j in listJasa" :key="j.id" :value="j.id">
            {{ j.name }} (+{{ formatNumber(j.price) }})
          </option>
        </select>
        <span class="text-[10px] font-black uppercase text-blue-700 ml-1.5 tracking-tighter">Tambah Jasa</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from "../../../stores/cart";
import { formatNumber } from "../../../utils/formatters";
import { CATEGORIES_WITH_SERVICE } from "../../../constants/app";
import BaseButton from "../../../common/BaseButton.vue";
import type { ServiceItem } from "../../../types";

const props = defineProps<{ listJasa: ServiceItem[] }>();
const cart = useCartStore();

const showJasaButton = computed(() => 
  cart.items.some(item => item.category && CATEGORIES_WITH_SERVICE.includes(item.category))
);

const onJasaSelected = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selected = props.listJasa.find(j => j.id === target.value); 
  const lastItem = cart.items[cart.items.length - 1];

  if (selected && lastItem) {
    cart.setExtraCharge(lastItem.cartId, { name: selected.name, price: selected.price });
  }
  target.value = "";
};
</script>