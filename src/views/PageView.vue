<template>
  <div class="min-h-full w-full">
    
    <component :is="activeComponent" v-if="activeComponent" />

    <div v-else class="p-8 animate-slide-up h-full flex flex-col">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
          <i :class="currentIcon || 'ri-bookmark-3-line'" class="text-3xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            {{ title }}
          </h1>
          <p class="text-sm text-slate-400 font-medium mt-1">Modul sistem Sinar Pagi POS</p>
        </div>
      </div>

      <div class="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center text-center p-10 min-h-[60vh]">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i class="ri-hammer-line text-4xl text-slate-300"></i>
        </div>
        <h2 class="text-xl font-bold text-slate-400 uppercase tracking-widest text-[14px]">Tahap Migrasi</h2>
        <p class="text-slate-400 max-w-xs mt-2 text-sm">
          Halaman <span class="text-blue-600 font-bold">"{{ title }}"</span> sedang menunggu migrasi data dari database.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { useRoute } from 'vue-router';

// IMPORT HALAMAN
import Penjualan from '../components/pages/Penjualan.vue';
import DaftarProduk from '../components/pages/DaftarProduk.vue'; 

const route = useRoute();

const componentsMap: Record<string, any> = {
  'Penjualan': markRaw(Penjualan),
  'Daftar Produk': markRaw(DaftarProduk),
};

const title = computed(() => (route.name as string) || 'Halaman');
const currentIcon = computed(() => (route.meta?.icon as string) || 'ri-bookmark-3-line');

const activeComponent = computed(() => componentsMap[route.name as string]);
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
