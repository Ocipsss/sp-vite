<template>
  <div class="flex flex-col h-[calc(100vh-110px)] relative overflow-hidden bg-slate-50">
    <CartHeader :listJasa="listJasa" />
    <CartList />
    <PaymentPanel @checkout="handleCheckout" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from "../../../stores/cart";
import { db } from "../../../database";
import CartHeader from "./CartHeader.vue";
import CartList from "./CartList.vue";
import PaymentPanel from "./PaymentPanel.vue";
import type { ServiceItem } from "../../../types";

const cart = useCartStore();
const listJasa = ref<ServiceItem[]>([]);

onMounted(async () => {
  listJasa.value = await db.table('services').toArray();
});

const handleCheckout = async () => {
  if (cart.items.length === 0) return;
  try {
    const trxId = await cart.processCheckout();
    console.log("✅ Berhasil:", trxId);
  } catch (err) {
    alert("Maaf, gagal menyimpan transaksi.");
  }
};
</script>