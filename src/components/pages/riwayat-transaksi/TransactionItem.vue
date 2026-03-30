<template>
  <div 
    class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
    :class="isEditing ? 'ring-2 ring-blue-500 shadow-xl scale-[1.02] z-10' : ''"
  >
    <div class="p-5 flex justify-between items-start">
      <div class="flex gap-4">
        <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
          <i class="ri-receipt-line text-xl"></i>
        </div>
        <div>
          <div class="text-[12px] font-black text-slate-800 uppercase leading-none mb-1">
            Nota #{{ transaction.id.toString().slice(-6).toUpperCase() }}
          </div>
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {{ formatDateTime(transaction.date) }}
          </div>
        </div>
      </div>
      
      <div class="text-right">
        <div class="text-lg font-black text-slate-900 mb-1 leading-none italic">
          {{ formatRupiah(transaction.total) }}
        </div>
        <div class="flex gap-2 justify-end mt-2">
          <button 
            @click="$emit('reprint', transaction)" 
            class="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 active:scale-90 transition-all shadow-sm"
          >
            <i class="ri-printer-line text-sm"></i>
          </button>
          <button 
            @click="$emit('toggle-edit', transaction.id)" 
            :class="isEditing ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'"
            class="text-[9px] font-black px-3 py-1.5 rounded-xl uppercase transition-all shadow-sm"
          >
            {{ isEditing ? 'Tutup' : 'Opsi' }}
          </button>
        </div>
      </div>
    </div>

    <transition name="slide-down">
      <div v-if="isEditing" class="px-5 pb-5 pt-2 border-t border-dashed border-slate-100 bg-slate-50/50 overflow-hidden">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Status Nota</label>
            <div class="flex gap-1.5 p-1 bg-white rounded-xl border border-slate-100 shadow-sm">
              <button 
                @click="updateStatus('SUCCESS')" 
                :class="transaction.status === 'SUCCESS' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400'" 
                class="flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all"
              >LUNAS</button>
              <button 
                @click="updateStatus('PENDING')" 
                :class="transaction.status === 'PENDING' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400'" 
                class="flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all"
              >HUTANG</button>
            </div>
          </div>
          <div>
            <label class="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2 ml-1">Metode</label>
            <div class="relative flex items-center">
              <select 
                @change="updatePayment($event.target.value)" 
                class="w-full h-11 bg-white rounded-xl border border-slate-100 px-3 text-[9px] font-black uppercase outline-none appearance-none shadow-sm"
              >
                <option :selected="transaction.paymentMethod === 'Tunai'" value="Tunai">CASH</option>
                <option :selected="transaction.paymentMethod === 'QRIS'" value="QRIS">QRIS</option>
                <option :selected="transaction.paymentMethod === 'Tempo'" value="Tempo">TEMPO</option>
              </select>
              <i class="ri-arrow-down-s-line absolute right-3 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
        </div>
        <button 
          @click="confirmDelete" 
          class="w-full mt-4 py-3 text-[9px] font-black text-rose-500 uppercase border border-rose-100 rounded-xl hover:bg-rose-50 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <i class="ri-delete-bin-line"></i> Hapus Transaksi Permanen
        </button>
      </div>
    </transition>

    <div 
      v-if="!isEditing" 
      class="px-5 py-3 bg-slate-50/50 flex gap-2 border-t border-slate-50 items-center transition-all"
    >
      <span 
        :class="transaction.status === 'SUCCESS' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-rose-500 shadow-rose-100'" 
        class="text-[8px] font-black px-2 py-1 rounded-lg text-white uppercase tracking-tighter shadow-sm"
      >
        {{ transaction.status === 'SUCCESS' ? 'Lunas' : 'Hutang' }}
      </span>
      <span class="text-[8px] font-black px-2 py-1 bg-blue-100 text-blue-600 rounded-lg uppercase tracking-tighter shadow-sm">
        {{ transaction.paymentMethod }}
      </span>
      <span class="text-[9px] font-bold text-slate-400 ml-auto flex items-center gap-1">
        <i class="ri-shopping-bag-line text-[10px]"></i>
        {{ transaction.items?.length || 0 }} Produk
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '@/database';
import { formatRupiah } from '@/utils/formatters';

const props = defineProps<{
  transaction: any;
  isEditing: boolean;
}>();

const emit = defineEmits(['toggle-edit', 'refresh', 'reprint']);

const updateStatus = async (status: string) => {
  try {
    await db.table('transactions').update(props.transaction.id, { status });
    emit('refresh');
  } catch (err) {
    console.error("Gagal update status", err);
  }
};

const updatePayment = async (paymentMethod: string) => {
  try {
    await db.table('transactions').update(props.transaction.id, { paymentMethod });
    emit('refresh');
  } catch (err) {
    console.error("Gagal update metode", err);
  }
};

const confirmDelete = async () => {
  const yakin = confirm("⚠️ Hapus transaksi ini permanen? Stok tidak akan kembali otomatis.");
  if (yakin) {
    try {
      await db.table('transactions').delete(props.transaction.id);
      emit('refresh');
      emit('toggle-edit', null);
    } catch (err) {
      alert("Gagal menghapus data");
    }
  }
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  });
};
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 250px; /* Batas tinggi untuk animasi */
}
.slide-down-enter-from, .slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}
</style>
