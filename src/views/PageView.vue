<template>
  <div class="h-full overflow-hidden">
    <component :is="activeComponent" v-if="activeComponent" />

    <div v-else class="p-8 animate-slide-up">
      <div class="flex items-center gap-4 mb-8">
        <div class="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
          <i :class="currentIcon" class="text-3xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">
            {{ title }}
          </h1>
          <p class="text-sm text-slate-400 font-medium mt-1">Modul sistem Sinar Pagi POS</p>
        </div>
      </div>

      <div class="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] h-[60vh] flex flex-col items-center justify-center text-center p-10">
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
import { computed, shallowRef, markRaw } from 'vue';
import { useRoute } from 'vue-router';

// IMPORT HALAMAN YANG SUDAH JADI
import Penjualan from '../components/pages/Penjualan.vue';

const route = useRoute();

// Mapping rute ke komponen
// Gunakan markRaw agar Vue tidak memantau jeroan komponen (lebih enteng)
const componentsMap: Record<string, any> = {
  'Penjualan': markRaw(Penjualan),
};

const title = computed(() => (route.name as string) || 'Halaman');
const currentIcon = computed(() => (route.meta.icon as string) || 'ri-bookmark-3-line');

// Ambil komponen berdasarkan nama rute yang aktif
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