<template>
  <div class="w-full flex flex-col gap-5 py-2 no-scrollbar px-1 pb-28 min-h-dvh bg-slate-50">
    <div class="flex flex-col gap-3 px-2">
      <TransactionItem 
        v-for="t in transactions" 
        :key="t.id" 
        :transaction="t"
        :is-editing="editingId === t.id"
        @toggle-edit="toggleEdit"
        @refresh="loadTransactions"
        @reprint="reprint"
      />

      <div v-if="transactions.length === 0 && !isLoading" class="py-24 text-center opacity-30 flex flex-col items-center">
        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i class="ri-file-list-3-line text-4xl text-slate-400"></i>
        </div>
        <p class="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">
          Data Transaksi Kosong
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-10 opacity-50">
        <div class="animate-pulse text-[10px] font-black uppercase">Memuat Data...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/database';
import TransactionItem from './TransactionItem.vue';

interface Transaction {
  id: string | number;
  date: string;
  total: number;
  status: string;
  paymentMethod: string;
  items?: any[];
}

const transactions = ref<Transaction[]>([]);
const isLoading = ref(false);
const editingId = ref<string | number | null>(null);

const loadTransactions = async () => {
  isLoading.value = true;
  try {
    const data = await db.table('transactions')
      .orderBy('date')
      .reverse()
      .limit(50)
      .toArray();
    
    transactions.value = data;
  } catch (err) {
    console.error("Gagal load transaksi:", err);
  } finally {
    setTimeout(() => { 
      isLoading.value = false; 
    }, 400);
  }
};

const toggleEdit = (id: string | number | null) => {
  editingId.value = editingId.value === id ? null : id;
};

const reprint = (transaksi: Transaction) => {
  if (!transaksi) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(30);
  }

  const dataBersih = JSON.parse(JSON.stringify(transaksi));
  
  window.dispatchEvent(new CustomEvent('print-struk', { 
    detail: dataBersih 
  }));
};

onMounted(loadTransactions);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
