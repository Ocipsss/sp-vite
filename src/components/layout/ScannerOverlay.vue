<template>
  <div class="fixed inset-0 z-100 bg-white flex flex-col p-6 animate-zoom-in">
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-col">
        <span class="text-xs font-black uppercase tracking-widest text-blue-600">
          Scanner {{ mode === 'inventory' ? 'Inventaris' : 'Kasir' }}
        </span>
        <span class="text-[10px] text-gray-400 font-bold uppercase">Arahkan ke Barcode Produk</span>
      </div>
      <button 
        @click="closeScanner" 
        class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
      >
        <i class="ri-close-line text-xl"></i>
      </button>
    </div>

    <div id="reader" class="rounded-2xl overflow-hidden border-2 border-blue-50 bg-slate-900 aspect-square shadow-2xl relative">
       <div class="absolute inset-x-8 top-1/2 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse z-10"></div>
    </div>

    <div class="mt-auto py-8 text-center">
      <div class="flex items-center justify-center gap-2 mb-2">
        <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Kamera Ready</span>
      </div>
      <span class="text-[9px] text-gray-400 font-black tracking-[0.3em] uppercase italic">
        Sinar Pagi POS System
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useScanner } from '@/composables/useScanner';
import { db } from '@/database';

const props = defineProps({
  mode: { type: String, default: 'cashier' }
});

const emit = defineEmits(['close', 'detected']);
const cart = useCartStore();
const { startScanner, stopScanner } = useScanner();

const onScanSuccess = async (decodedText: string) => {
  try {
    const product = await db.table('products').where('code').equals(decodedText).first();
    
    if (navigator.vibrate) navigator.vibrate(100);
    
    if (props.mode === 'inventory') {
      emit('detected', { code: decodedText, product: product || null });
      closeScanner();
    } else {
      if (product) {
        cart.addToCart(product);
        closeScanner();
      } else {
        console.warn(`Barcode ${decodedText} tidak ditemukan.`);
      }
    }
  } catch (error) {
    console.error("Database error:", error);
  }
};

const closeScanner = async () => {
  await stopScanner();
  if (props.mode === 'cashier') {
    cart.toggleScanner(false);
  } else {
    emit('close');
  }
};

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    startScanner("reader", onScanSuccess).catch((err) => {
      console.error("Scanner failed:", err);
      closeScanner();
    });
  }, 400);
});

onBeforeUnmount(() => stopScanner());
</script>
