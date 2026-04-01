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



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah modul logika dashboard (useDashboard.ts) yang berfungsi sebagai mesin pengolah data statistik utama untuk aplikasi Sinar Pagi. Menggunakan pola Vue Composable, file ini secara otomatis menarik data mentah dari berbagai tabel database lokal (transaksi, produk, pengeluaran, dan member) lalu mengolahnya menjadi informasi finansial yang siap pakai. Modul ini bertanggung jawab menghitung performa toko secara real-time, mulai dari omzet harian, sisa piutang pelanggan, hingga nilai total aset barang yang ada di gudang, sehingga pemilik toko dapat mengambil keputusan bisnis dengan cepat berdasarkan data akurat.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Impor dependensi; mengambil fungsi reaktivitas Vue (ref, onMounted) dan koneksi database Dexie (db).
// Baris 4-13: Definisi state stats; variabel reaktif yang menampung objek ringkasan keuangan seperti omzet, stok kritis, total piutang, laba bersih harian, nilai aset stok, dan pengeluaran.
// Baris 15: Definisi state topMembers; variabel reaktif untuk menyimpan daftar 10 pelanggan dengan poin loyalitas tertinggi.
// Baris 17-20: Inisialisasi fungsi loadStats; fungsi asinkron utama untuk mengambil dan memproses data dari database. Mendapatkan tanggal hari ini dalam format ISO (YYYY-MM-DD).
// Baris 22-26: Query Transaksi Hari Ini; mengambil semua data penjualan yang terjadi pada tanggal hari ini dari tabel transactions.
// Baris 28-40: Logika Hitung Omzet & Laba Kotor; melakukan perulangan (forEach) pada transaksi hari ini untuk menjumlahkan total uang masuk serta menghitung selisih harga jual dan modal per item.
// Baris 42-50: Query & Hitung Pengeluaran; mengambil data pengeluaran operasional hari ini dan menjumlahkan total nominalnya (totalExpenses).
// Baris 52-58: Analisa Produk & Aset; mengambil seluruh data produk untuk menghitung jumlah barang yang stoknya di bawah 5 (stokKritis) serta total nilai uang yang mengendap di gudang (nilaiStok).
// Baris 60-68: Analisa Piutang; melakukan filter pada database untuk menjumlahkan seluruh nilai transaksi yang berstatus 'hutang' atau belum lunas.
// Baris 70-77: Finalisasi Stats; menggabungkan seluruh hasil perhitungan ke dalam state 'stats', termasuk pengurangan laba kotor dengan biaya pengeluaran untuk mendapatkan laba bersih hari ini.
// Baris 79-82: Pemeringkatan Member; mengambil seluruh data pelanggan dan mengurutkannya berdasarkan jumlah poin terbanyak untuk menampilkan 10 besar member loyal.
// Baris 84-86: Error Handling; menangkap dan menampilkan log error ke konsol jika terjadi kegagalan saat pengambilan data dari database.
// Baris 89: Lifecycle onMounted; memastikan fungsi loadStats langsung berjalan otomatis segera setelah dashboard dibuka oleh pengguna.
// Baris 91-95: Return Value; mengekspos variabel stats, topMembers, dan fungsi loadStats agar bisa digunakan di dalam komponen UI Dashboard.