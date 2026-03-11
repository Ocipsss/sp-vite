<template>
  <div class="fixed inset-0 z-100 bg-white flex flex-col p-6 animate-zoom-in">
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col">
        <span class="text-xs font-black uppercase tracking-widest text-blue-600">Scanner Aktif</span>
        <span class="text-[10px] text-gray-400 font-bold uppercase">Arahkan ke Barcode Produk</span>
      </div>
      <button @click="cart.toggleScanner(false)" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <i class="ri-close-line text-xl"></i>
      </button>
    </div>

    <div id="reader" class="rounded-[2.5rem] overflow-hidden border-4 border-blue-50 bg-slate-50 aspect-square shadow-inner"></div>

    <div class="mt-auto py-8 text-center">
      <span class="text-[9px] text-gray-400 font-black tracking-[0.3em] uppercase italic">Sinar Pagi POS System</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useCartStore } from '../../stores/cart';
import { useScanner } from '../../composables/useScanner';
import { db } from '../../database';

const cart = useCartStore();
const { startScanner, stopScanner } = useScanner();

const onScanSuccess = async (decodedText: string) => {
  // Get product from IndexedDB
  const product = await db.table('products').where('code').equals(decodedText).first();
  
  if (product) {
    cart.addToCart(product);
    if (navigator.vibrate) navigator.vibrate(100);
    cart.toggleScanner(false); // Otomatis tutup setelah sukses
  } else {
    alert(`Barcode ${decodedText} tidak terdaftar.`);
  }
};

onMounted(() => {
  // Delay sedikit agar elemen #reader sudah ter-render
  setTimeout(() => {
    startScanner("reader", onScanSuccess).catch(() => cart.toggleScanner(false));
  }, 300);
});

onBeforeUnmount(() => stopScanner());
</script>