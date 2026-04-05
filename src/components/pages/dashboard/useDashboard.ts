import { ref, onMounted } from 'vue';
import { db } from '@/database';

export function useDashboard() {
  const stats = ref({
    omzet: 0,
    stokKritis: 0,
    totalPiutang: 0,
    labaHariIni: 0,
    nilaiStok: 0,
    pengeluaranHariIni: 0
  });
  
  const topMembers = ref<any[]>([]);

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0] || '';

      const todayTrans = await db.transactions
        .where('date' as unknown as string)
        .startsWith(today)
        .toArray();
      
      let omzet = 0;
      let labaKotor = 0;
      
      todayTrans.forEach((t: any) => {
        omzet += Number(t.total || 0);
        if (t.items) {
          t.items.forEach((item: any) => {
            const qty = Number(item.qty || 0);
            const modal = Number(item.price_modal || 0);
            const jual = Number(item.price_sell || 0);
            labaKotor += (jual - modal) * qty;
          });
        }
      });

      const todayExpensesData = await db.expenses
        .where('date' as unknown as string)
        .startsWith(today)
        .toArray();

      const totalExpenses = todayExpensesData.reduce(
        (sum: number, e: any) => sum + Number(e.amount || 0), 
        0
      );

      const products = await db.products.toArray();
      const kritis = products.filter(p => Number(p.qty || 0) <= 5).length;
      const totalNilaiAset = products.reduce(
        (sum, p) => sum + (Number(p.price_modal || 0) * Number(p.qty || 0)), 
        0
      );

      const allHutangTrans = await db.transactions
        .where('status' as unknown as string)
        .equals('hutang')
        .toArray();

      const totalPiutang = allHutangTrans.reduce(
        (sum: number, t: any) => sum + Number(t.total || 0), 
        0
      );

      stats.value = {
        omzet,
        stokKritis: kritis,
        totalPiutang: totalPiutang,
        labaHariIni: labaKotor - totalExpenses,
        nilaiStok: totalNilaiAset,
        pengeluaranHariIni: totalExpenses
      };

      const members = await db.members.toArray();
      topMembers.value = members
        .sort((a, b) => Number(b.points || 0) - Number(a.points || 0))
        .slice(0, 10);

    } catch (err) {
      console.error("Gagal memuat statistik dashboard:", err);
    }
  };

  onMounted(loadStats);

  return {
    stats,
    topMembers,
    loadStats
  };
}
