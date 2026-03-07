<template>
  <div class="flex flex-col h-[calc(100vh-110px)] relative overflow-hidden bg-slate-50">
    
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
      class="flex-1 flex flex-col min-h-0 bg-white mx-4 mt-2 rounded-t-[2.5rem] border-x border-t border-slate-100 shadow-sm relative overflow-hidden"
    >
      <div 
        ref="scrollContainer"
        class="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-20"
      >
        <div v-if="cart.items.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300 py-20">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <i class="ri-shopping-basket-line text-3xl opacity-20"></i>
          </div>
          <p class="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">Belum ada barang</p>
        </div>

        <div v-else class="flex flex-col gap-3">
          <div 
            v-for="item in cart.items" :key="item.cartId" 
            class="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 flex flex-col gap-3 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <div class="text-[12px] font-black text-slate-700 uppercase leading-tight truncate pr-2">{{ item.name }}</div>
                <div class="text-[10px] font-bold text-slate-400 mt-1">
                  {{ formatRupiah(item.price_sell) }} <span class="mx-1 opacity-30">×</span> {{ item.qty }}
                </div>
              </div>
              
              <div class="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                <button @click="cart.updateQty(item.cartId, -1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 font-black active:bg-red-50 transition-all">-</button>
                <span class="text-[12px] font-black text-slate-700 min-w-6 text-center">{{ item.qty }}</span>
                <button @click="cart.updateQty(item.cartId, 1)" class="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 font-black active:bg-blue-50 transition-all">+</button>
              </div>
            </div>

            <div v-if="item.extraCharge > 0" 
              class="flex justify-between items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50"
            >
              <div class="flex items-center gap-2">
                <i class="ri-fire-fill text-orange-500 text-xs"></i>
                <div class="flex flex-col">
                  <span class="text-[9px] font-black text-blue-800 uppercase tracking-tighter">{{ item.extraChargeName }}</span>
                  <span class="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">{{ formatRupiah(item.extraCharge) }} × {{ item.extraChargeQty }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button @click="updateJasaQty(item, -1)" class="w-7 h-7 flex items-center justify-center text-orange-500 font-black bg-white border border-blue-100 rounded-lg">-</button>
                <span class="text-[11px] font-black text-slate-700 min-w-4.5 text-center">{{ item.extraChargeQty }}</span>
                <button @click="updateJasaQty(item, 1)" class="w-7 h-7 flex items-center justify-center text-blue-600 font-black bg-white border border-blue-100 rounded-lg">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 bg-white border-t border-gray-100 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] shrink-0 z-40">
      
      <transition name="slide-up">
        <div v-if="cart.payMethod === 'Tunai'" class="mb-4">
          <div class="bg-slate-900 p-5 rounded-[2.5rem] shadow-2xl relative">
            <div class="flex items-center gap-4 mb-4 relative z-10">
              <div class="flex-1">
                <label class="text-[10px] text-slate-500 font-black uppercase block mb-1 tracking-widest">Diterima</label>
                <div class="flex items-baseline gap-1">
                  <span class="text-blue-500 text-sm font-black italic">Rp</span>
                  <input 
                    type="number" 
                    inputmode="numeric" 
                    v-model.number="cart.cashAmount" 
                    class="w-full bg-transparent border-none text-white text-3xl font-black outline-none p-0"
                    placeholder="0"
                  >
                </div>
              </div>
              <div class="text-right border-l border-white/10 pl-6">
                <div class="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest text-right">Kembali</div>
                <div :class="cart.kembalian > 0 ? 'text-green-400' : 'text-white'" class="text-2xl font-black italic tracking-tighter text-right">
                  {{ formatRupiah(cart.kembalian).replace('Rp', '').trim() }}
                </div>
              </div>
            </div>
            
            <button 
              @click="handleMainButtonClick"
              :disabled="cart.items.length === 0 || (cart.payMethod === 'Tunai' && cart.cashAmount > 0 && cart.cashAmount < cart.totalBelanja)"
              class="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[12px] tracking-widest active:scale-95 transition-all shadow-lg disabled:opacity-30"
            >
              {{ buttonLabel }}
            </button>
          </div>
        </div>
      </transition>

      <div class="flex flex-col gap-4">
        <div class="flex items-end justify-between px-2">
          <span class="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Tagihan</span>
          <span class="text-3xl font-black text-slate-900 tracking-tighter">{{ formatRupiah(cart.totalBelanja) }}</span>
        </div>
        
        <div class="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            v-for="m in (['Tunai', 'QRIS', 'Tempo'] as const)" :key="m"
            @click="cart.payMethod = (cart.payMethod === m ? null : m)"
            :class="cart.payMethod === m ? 'bg-white text-slate-900 shadow-sm border-slate-300' : 'text-gray-400 border-transparent'"
            class="flex-1 py-3.5 rounded-xl border text-[11px] font-black uppercase transition-all tracking-widest"
          >
            {{ m }}
          </button>
        </div>

        <transition name="fade">
          <button 
            v-if="cart.payMethod && cart.payMethod !== 'Tunai'"
            @click="handleCheckout"
            :disabled="cart.items.length === 0"
            class="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-[12px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            PROSES {{ cart.payMethod.toUpperCase() }}
          </button>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { useCartStore, type CartItem } from "../../stores/cart";
import { db } from "../../database";

const cart = useCartStore();
const scrollContainer = ref<HTMLElement | null>(null);
const listJasa = ref<any[]>([]);

// Interface untuk type safety
interface Service {
  id: number;
  name: string;
  price: number;
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(val || 0);
};

// Label tombol dinamis sesuai kondisi uang
const buttonLabel = computed(() => {
  if (cart.cashAmount === 0 || !cart.cashAmount) return 'UANG PAS';
  if (cart.cashAmount < cart.totalBelanja) return 'UANG KURANG';
  return 'SELESAIKAN TRANSAKSI';
});

onMounted(async () => {
  listJasa.value = await db.table('services').toArray(); // Dexie table call
  scrollToBottom();
});

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

// Deep Watcher: Scroll jika isi keranjang berubah
watch(() => cart.items, () => { scrollToBottom(); }, { deep: true });

const handleSelectJasa = (event: any) => {
  const selectedId = event.target.value;
  const selected = listJasa.value.find((j: Service) => j.id == selectedId);
  
  if (selected && cart.items.length > 0) {
    const lastItem = cart.items[cart.items.length - 1];
    lastItem.extraCharge = selected.price;
    lastItem.extraChargeName = selected.name;
    lastItem.extraChargeQty = 1;
    
    if (!lastItem.name.includes(`(${selected.name})`)) {
      lastItem.name += ` (${selected.name})`;
    }
  }
  event.target.value = "";
};

const updateJasaQty = (item: CartItem, n: number) => {
  item.extraChargeQty = Math.max(0, (item.extraChargeQty || 0) + n);
  if (item.extraChargeQty === 0) {
    if (item.extraChargeName) {
        item.name = item.name.replace(` (${item.extraChargeName})`, "");
    }
    item.extraCharge = 0;
    item.extraChargeName = "";
  }
};

const handleMainButtonClick = () => {
  if (cart.cashAmount === 0 || !cart.cashAmount) {
    cart.cashAmount = cart.totalBelanja;
  } else {
    handleCheckout();
  }
};

const handleCheckout = async () => {
  if (cart.items.length === 0) return;
  
  try {
    const trxId = await cart.processCheckout();
    console.log("Transaksi Berhasil", trxId);
  } catch (err) {
    console.error(err);
    alert("Gagal memproses transaksi");
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
