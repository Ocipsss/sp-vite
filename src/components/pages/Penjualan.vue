<template>
  <div class="flex flex-col h-full relative overflow-hidden bg-slate-50">
    <div class="absolute top-2 right-4 z-50 flex justify-end items-center pointer-events-none">
      <div class="relative flex items-center bg-white border border-blue-200 rounded-full px-3 py-2 shadow-md active:scale-95 transition-all pointer-events-auto cursor-pointer">
        <i class="ri-customer-service-2-line text-blue-600 text-sm"></i>
        <select 
          @change="handleSelectJasa"
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        >
          <option value="" disabled selected>+ JASA</option>
          <option v-for="j in listJasa" :key="j.id" :value="j.id">
            {{ j.name }} (+{{ formatRupiah(j.price).replace('Rp', '').trim() }})
          </option>
        </select>
        <span class="text-[10px] font-black uppercase text-blue-700 ml-1.5 tracking-tighter">Tambah Jasa</span>
      </div>
    </div>

    <div 
      ref="scrollContainer" 
      class="flex-1 flex flex-col min-h-0 bg-white mx-4 mt-2 rounded-t-3xl border-x border-t border-slate-100 shadow-sm relative overflow-hidden"
    >
      <div 
        :class="cart.items.length > 0 ? 'overflow-y-auto' : 'overflow-hidden'" 
        class="flex-1 no-scrollbar px-4 pt-4 pb-10"
      >
        <div v-if="cart.items.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <i class="ri-shopping-basket-line text-3xl opacity-20"></i>
          </div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Belum ada barang</p>
        </div>

        <div v-else class="flex flex-col gap-3">
          <div 
            v-for="item in cart.items" :key="item.cartId" 
            class="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-3 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <div class="text-[12px] font-black text-slate-700 uppercase leading-tight truncate">{{ item.name }}</div>
                <div class="text-[10px] font-bold text-slate-400 mt-1">
                  {{ formatRupiah(item.price_sell) }} <span class="mx-1 opacity-30">×</span> {{ item.qty }}
                </div>
              </div>
              
              <div class="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200">
                <button @click="cart.updateQty(item.cartId, -1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 font-black active:bg-red-50 transition-all">-</button>
                <span class="text-[12px] font-black text-slate-700 min-w-6 text-center">{{ item.qty }}</span>
                <button @click="cart.updateQty(item.cartId, 1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 font-black active:bg-blue-50 transition-all">+</button>
              </div>
            </div>

            <div v-if="item.extraCharge > 0" 
              class="flex justify-between items-center bg-blue-50 p-2.5 rounded-xl border border-blue-100/50"
            >
              <div class="flex items-center gap-2">
                <i class="ri-fire-fill text-orange-500 text-xs"></i>
                <div class="flex flex-col">
                  <span class="text-[9px] font-black text-blue-800 uppercase tracking-tighter">{{ item.extraChargeName || 'JASA' }}</span>
                  <span class="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">{{ formatRupiah(item.extraCharge) }} × {{ item.extraChargeQty }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button @click="updateJasaQty(item, -1)" class="w-7 h-7 flex items-center justify-center text-orange-500 font-black bg-white border border-blue-100 rounded-lg">-</button>
                <span class="text-[11px] font-black text-slate-700 min-w-4.5 text-center">{{ item.extraChargeQty }}</span>
                <button @click="updateJasaQty(item, 1)" class="w-7 h-7 flex items-center justify-center text-blue-600 font-black bg-white border border-blue-100 rounded-lg">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-15px_30px_rgba(0,0,0,0.08)]">
      
      <div v-if="cart.payMethod === 'Tunai'" class="mb-4">
        <div class="bg-slate-900 p-5 rounded-4xl shadow-2xl overflow-hidden relative">
          <div class="flex items-center gap-4 mb-4 relative z-10">
            <div class="flex-1">
              <label class="text-[10px] text-slate-500 font-black uppercase block mb-1 tracking-widest">Diterima</label>
              <div class="flex items-baseline gap-1">
                <span class="text-blue-500 text-sm font-black italic">Rp</span>
                <input 
                  type="number" 
                  inputmode="numeric" 
                  v-model="cart.cashAmount" 
                  class="w-full bg-transparent border-none text-white text-4xl font-black outline-none p-0"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="text-right border-l border-white/10 pl-6">
              <div class="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Kembali</div>
              <div :class="cart.kembalian > 0 ? 'text-green-400' : 'text-white'" class="text-2xl font-black italic tracking-tighter">
                {{ formatRupiah(cart.kembalian).replace('Rp', '').trim() }}
              </div>
            </div>
          </div>
          <button 
            @click="handleCheckout"
            :disabled="cart.items.length === 0"
            class="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[12px] tracking-widest active:scale-95 transition-all shadow-lg disabled:opacity-50"
          >
            {{ (cart.cashAmount == 0) ? 'UANG PAS' : (cart.cashAmount < cart.totalBelanja ? 'UANG KURANG' : 'SELESAIKAN TRANSAKSI') }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex items-end justify-between px-2">
          <span class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Tagihan</span>
          <span class="text-3xl font-black text-slate-900 tracking-tighter">{{ formatRupiah(cart.totalBelanja) }}</span>
        </div>
        
        <div class="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
        v-for="m in (['Tunai', 'QRIS', 'Tempo'] as const)" :key="m"
        @click="cart.payMethod = m"
        :class="cart.payMethod === m ? 'bg-white text-slate-900 shadow-sm border-slate-300' : 'text-slate-400 border-transparent'"
        class="flex-1 py-3.5 rounded-xl border text-[11px] font-black uppercase transition-all tracking-widest"
        >
        {{ m }}
        </button>
        </div>

        <button 
          v-if="cart.payMethod !== 'Tunai'"
          @click="handleCheckout"
          :disabled="cart.items.length === 0"
          class="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
        >
          PROSES {{ cart.payMethod.toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useCartStore } from "../../stores/cart";
import { db } from "../../database";

const cart = useCartStore();
const scrollContainer = ref<HTMLElement | null>(null);
const listJasa = ref<any[]>([]);

// Format Rupiah
const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(val);
};

// Ambil data jasa dari DB
onMounted(async () => {
  listJasa.value = await db.services.toArray();
  scrollToBottom();
});

// Auto Scroll Logic
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({ 
        top: scrollContainer.value.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  });
};

// Watchers untuk scroll otomatis saat keranjang bertambah
watch(() => cart.items.length, (n, o) => { if (n > o) scrollToBottom(); });

// Handle Jasa Tambahan
const handleSelectJasa = (event: any) => {
  const selectedId = event.target.value;
  const selected = listJasa.value.find(j => j.id == selectedId);
  
  if (selected && cart.items.length > 0) {
    // Tambahkan jasa ke item TERAKHIR di keranjang
    const lastItem = cart.items[cart.items.length - 1];
    lastItem.extraCharge = selected.price;
    lastItem.extraChargeName = selected.name;
    lastItem.extraChargeQty = 1;
  }
  event.target.value = "";
};

const updateJasaQty = (item: any, n: number) => {
  item.extraChargeQty = Math.max(0, (item.extraChargeQty || 0) + n);
  if (item.extraChargeQty === 0) {
    item.extraCharge = 0;
  }
};

const handleCheckout = async () => {
  if (cart.items.length === 0) return;
  
  // Jika uang pas
  if (cart.payMethod === 'Tunai' && cart.cashAmount === 0) {
    cart.cashAmount = cart.totalBelanja;
  }

  try {
    const trxId = await cart.processCheckout();
    alert(`Transaksi Berhasil! ID: ${trxId}`);
  } catch (err) {
    console.error(err);
    alert("Gagal memproses transaksi");
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>