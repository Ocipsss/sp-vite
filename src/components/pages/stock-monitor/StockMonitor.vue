<template>
  <div class="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-slate-50 flex flex-col overflow-hidden">
    
    <div class="w-full bg-slate-50 pt-3 pb-3 px-6 z-50 shrink-0 shadow-sm border-b border-slate-100">
      <div class="mb-4">
        <div class="relative flex items-center bg-white rounded-2xl border border-slate-200 px-4 h-12 shadow-inner group focus-within:border-blue-400 transition-all">
          <i class="ri-search-2-line text-slate-400 mr-3 group-focus-within:text-blue-500"></i>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari rokok / produk..."
            class="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 placeholder:text-slate-300"
          >
          <button v-if="searchQuery" @click="searchQuery = ''" class="text-slate-300 hover:text-slate-500">
            <i class="ri-close-circle-fill"></i>
          </button>
        </div>
      </div>
      
      <div class="flex gap-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <button 
          v-for="st in ['all', 'kritis', 'menipis']" 
          :key="st"
          @click="filterStatus = st"
          :class="filterStatus === st ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-[1.02]' : 'text-slate-400 hover:bg-slate-50'"
          class="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          {{ st }}
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-40">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-300">
        <i class="ri-loader-4-line animate-spin text-4xl mb-2"></i>
        <span class="text-[9px] font-black uppercase tracking-widest">Sinkronisasi Data...</span>
      </div>

      <div v-else class="flex flex-col gap-2.5">
        <div 
          v-for="p in filteredProducts" 
          :key="p.id" 
          class="bg-white p-3 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between animate-zoom-in transition-all active:bg-slate-50"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div 
              :class="getStockTheme(p.stock || p.qty)" 
              class="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border shrink-0 shadow-sm"
            >
              <span class="text-sm font-black leading-none">{{ formatQty(p.stock || p.qty) }}</span>
              <span class="text-[7px] font-black uppercase opacity-60 mt-1">btg</span>
            </div>
            
            <div class="min-w-0">
              <div class="text-[12px] font-black text-slate-800 uppercase leading-tight truncate mb-1">
                {{ p.name }}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[8px] text-slate-400 font-black uppercase bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {{ p.category || 'No Category' }}
                </span>
                <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                <span :class="getStockTheme(p.stock || p.qty).split(' ')[1]" class="text-[8px] font-black uppercase italic">
                  {{ getStatusLabel(p.stock || p.qty) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <button 
              @click="loadStock" 
              class="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:bg-blue-50 active:text-blue-600 transition-all shadow-inner"
              title="Refresh Stok"
            >
              <i class="ri-refresh-line text-lg"></i>
            </button>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="py-24 text-center opacity-30 flex flex-col items-center">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <i class="ri-inbox-line text-4xl text-slate-400"></i>
          </div>
          <p class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Data tidak ditemukan</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { db } from '@/database';

// Variabel fdb untuk Firebase (Jika kamu pakai Firebase SDK)
declare const fdb: any;

// --- STATE ---
const products = ref<any[]>([]);
const filterStatus = ref('all');
const searchQuery = ref('');
const isLoading = ref(false);

// --- LOGIC ---

const loadStock = async () => {
  isLoading.value = true;
  if (navigator.vibrate) navigator.vibrate(20);
  
  try {
    let allProducts = [];
    
    // Sinkronisasi Hybrid: Firebase -> Lokal (IndexedDB)
    if (typeof fdb !== 'undefined') {
      const snapshot = await fdb.ref('products').once('value');
      const data = snapshot.val();
      if (data) {
        allProducts = Object.values(data);
        await db.table('products').clear();
        await db.table('products').bulkAdd(allProducts);
      }
    } else {
      // Jika offline/tanpa firebase, ambil dari IndexedDB lokal
      allProducts = await db.table('products').toArray();
    }
    
    // Urutkan berdasarkan sisa stok paling sedikit
    products.value = allProducts.sort((a, b) => (a.stock || a.qty) - (b.stock || b.qty));
  } catch (err) {
    console.error("Gagal sinkronisasi stok:", err);
  } finally {
    setTimeout(() => { isLoading.value = false; }, 500);
  }
};

// Filtered List
const filteredProducts = computed(() => {
  let list = products.value;

  // Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q))
    );
  }

  // Logika Filter Status (Berdasarkan Batang)
  if (filterStatus.value === 'kritis') {
    return list.filter(p => (p.stock || p.qty) <= 12); // Stok <= 1 bungkus (12 btg)
  }
  if (filterStatus.value === 'menipis') {
    return list.filter(p => (p.stock || p.qty) > 12 && (p.stock || p.qty) <= 36); // Antara 1-3 bungkus
  }
  
  return list;
});

// Theme & Labeling
const getStockTheme = (qty: number) => {
  const q = Number(qty || 0);
  if (q <= 12) return 'bg-rose-50 text-rose-500 border-rose-100 shadow-rose-100/50';
  if (q <= 36) return 'bg-amber-50 text-amber-500 border-amber-100 shadow-amber-100/50';
  return 'bg-blue-50 text-blue-500 border-blue-100 shadow-blue-100/50';
};

const getStatusLabel = (qty: number) => {
  const q = Number(qty || 0);
  if (q <= 12) return 'Kritis';
  if (q <= 36) return 'Menipis';
  return 'Aman';
};

const formatQty = (qty: any) => Math.floor(Number(qty || 0));

onMounted(loadStock);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-zoom-in {
  animation: zoomIn 0.3s ease-out;
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
