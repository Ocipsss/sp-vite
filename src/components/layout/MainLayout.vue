<template>
  <div class="fixed inset-0 bg-[#0f172a] overflow-hidden font-sans">
    
    <Sidebar 
      :is-pulling="isPulling" 
      @navigate="navigateTo" 
      @sync="handlePullFirebase" 
    />

    <div 
      :class="[
        'fixed inset-0 bg-[#f1f5f9] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.185)] z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col',
        isSidebarOpen 
          ? 'translate-x-[70%] scale-[0.95] rounded-[40px] cursor-pointer overflow-hidden select-none' 
          : 'translate-x-0 scale-100 rounded-none overflow-hidden'
      ]"
      @click="isSidebarOpen && (isSidebarOpen = false)"
    >
      <AppHeader 
        :is-sidebar-open="isSidebarOpen" 
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen" 
      />

      <main class="flex-1 overflow-y-auto bg-[#f1f5f9] relative h-full min-h-0">
        <slot />
        <div v-if="isSidebarOpen" class="absolute inset-0 z-50 bg-transparent"></div>
      </main>
    </div>

    <ScannerOverlay v-if="cart.isScannerOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../../stores/cart';
import { startPullSync } from '../../api/sync';

import Sidebar from './Sidebar.vue';
import AppHeader from './AppHeader.vue';
import ScannerOverlay from './ScannerOverlay.vue';

const cart = useCartStore();
const router = useRouter();
const isSidebarOpen = ref(false);
const isPulling = ref(false);

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
  isSidebarOpen.value = false; 
};

const handlePullFirebase = async () => {
  isPulling.value = true;
  try {
    startPullSync();
    setTimeout(() => { isPulling.value = false; }, 2000);
  } catch (err) {
    console.error("Sync Error:", err);
    isPulling.value = false;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>