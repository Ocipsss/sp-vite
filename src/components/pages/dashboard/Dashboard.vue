<template>
  <div class="w-full flex flex-col gap-5 py-2 no-scrollbar px-1 pb-28 min-h-dvh bg-slate-50">
    
    <div class="relative w-full bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 overflow-hidden group">
      <div class="relative z-10">
        <span class="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1 block">Omzet Hari Ini</span>
        <h2 class="text-4xl font-black mt-2 tracking-tighter italic">{{ formatR(stats.omzet) }}</h2>
        
        <div class="flex gap-3 mt-4">
          <div class="px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
            <span class="text-[8px] font-black uppercase tracking-widest text-emerald-400">Live Update</span>
          </div>
        </div>
      </div>
      <i class="ri-funds-box-line absolute -right-6 -bottom-6 text-[140px] text-white/5 rotate-12 pointer-events-none transition-transform group-hover:scale-110 duration-700"></i>
    </div>

    <div class="flex flex-row gap-3 w-full px-1">
      <div class="flex-1 bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
        <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
          <i class="ri-line-chart-line text-lg"></i>
        </div>
        <span class="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Laba Bersih</span>
        <span class="text-sm font-black text-emerald-600 leading-none">{{ formatR(stats.labaHariIni) }}</span>
      </div>

      <div class="flex-1 bg-white p-5 rounded-[1.8rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
        <div class="w-10 h-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
          <i class="ri-shopping-bag-3-line text-lg"></i>
        </div>
        <span class="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-widest">Biaya Keluar</span>
        <span class="text-sm font-black text-rose-600 leading-none">-{{ formatR(stats.pengeluaranHariIni) }}</span>
      </div>
    </div>

    <div class="flex flex-row gap-3 px-1">
      <div class="flex-1 bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
        <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
          <i class="ri-archive-line text-lg"></i>
        </div>
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Stok</span>
        <div class="text-sm font-black text-slate-900 leading-none">{{ formatR(stats.nilaiStok) }}</div>
      </div>

      <div class="flex-1 bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
        <div class="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
          <i class="ri-hand-coin-line text-lg"></i>
        </div>
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Piutang</span>
        <div class="text-sm font-black text-slate-900 leading-none">{{ formatR(stats.totalPiutang) }}</div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="stats.stokKritis > 0" 
        class="mx-1 bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-[2rem] text-white flex items-center gap-5 shadow-xl shadow-orange-100">
        <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
          <i class="ri-error-warning-fill text-2xl text-white"></i>
        </div>
        <div>
          <div class="text-[10px] font-black uppercase tracking-widest opacity-80">Peringatan Stok</div>
          <div class="text-lg font-black italic">{{ stats.stokKritis }} Produk Segera Habis</div>
        </div>
      </div>
    </transition>

    <div class="w-full bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div class="flex items-center justify-between mb-6 px-1">
        <h4 class="text-[11px] font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
          <i class="ri-medal-fill text-blue-600 text-lg"></i> Loyal Members
        </h4>
        <span class="text-[8px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">Top 10</span>
      </div>
      
      <div class="flex flex-col gap-3">
        <div v-for="(m, index) in topMembers" :key="m.id" 
             class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all active:scale-95">
          <div class="flex items-center gap-4">
            <div 
              :class="index < 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black"
            >
              {{ index + 1 }}
            </div>
            <span class="text-[12px] font-black text-slate-700 uppercase truncate max-w-[120px]">{{ m.name }}</span>
          </div>
          <div class="text-right">
            <div class="text-[12px] font-black text-slate-900 leading-none mb-1">{{ (m.points || 0).toLocaleString() }}</div>
            <div class="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Points</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-1 p-6 bg-slate-800 rounded-[2rem] text-white flex items-center justify-between relative overflow-hidden">
      <div class="flex items-center gap-5 relative z-10">
        <div class="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center shadow-inner">
          <i class="ri-shield-check-fill text-2xl text-blue-400"></i>
        </div>
        <div>
          <div class="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-blue-400">PWA Security</div>
          <div class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Database Synced Local
          </div>
        </div>
      </div>
      <div class="flex flex-col items-end z-10">
        <span class="text-[9px] font-black px-4 py-1.5 bg-blue-600 rounded-full uppercase shadow-lg shadow-blue-900/50">Online</span>
      </div>
      <i class="ri-wifi-line absolute -right-4 -bottom-4 text-7xl text-white/5 -rotate-12"></i>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/database';
import { formatRupiah as formatR } from '@/utils/formatters';

// --- STATE ---
const stats = ref({ 
  omzet: 0, 
  stokKritis: 0, 
  totalPiutang: 0,
  labaHariIni: 0,
  nilaiStok: 0,
  pengeluaranHariIni: 0
});
const topMembers = ref([]);

// --- LOGIC ---
const loadStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Ambil Transaksi & Filter Hari Ini
    const trans = await db.table('transactions').toArray();
    const todayTrans = trans.filter(t => t.date.startsWith(today));
    
    let omzet = 0;
    let labaKotor = 0;

    todayTrans.forEach(t => {
      omzet += Number(t.total || 0);
      if (t.items) {
        t.items.forEach(item => {
          const qty = Number(item.qty || 0);
          const modal = Number(item.price_modal || 0);
          const jual = Number(item.price_sell || 0);
          labaKotor += (jual - modal) * qty;
        });
      }
    });

    // 2. Ambil Pengeluaran
    const expenses = await db.table('expenses').toArray();
    const todayExpenses = expenses
      .filter(e => e.date.startsWith(today))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    // 3. Ambil Stok Produk
    const products = await db.table('products').toArray();
    const kritis = products.filter(p => p.qty <= 5).length;
    const totalNilaiAset = products.reduce((sum, p) => 
      sum + (Number(p.price_modal || 0) * Number(p.qty || 0)), 0
    );

    // 4. Hitung Piutang (Status PENDING/hutang)
    const piutang = trans
      .filter(t => t.status === 'PENDING' || t.status === 'hutang')
      .reduce((sum, t) => sum + Number(t.total || 0), 0);

    // Update State
    stats.value = { 
      omzet, 
      stokKritis: kritis, 
      totalPiutang: piutang,
      labaHariIni: labaKotor - todayExpenses,
      nilaiStok: totalNilaiAset,
      pengeluaranHariIni: todayExpenses
    };

    // 5. Load Members
    const members = await db.table('members').toArray();
    topMembers.value = members
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 10);

  } catch (err) {
    console.error("Dashboard Error:", err);
  }
};

onMounted(loadStats);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
