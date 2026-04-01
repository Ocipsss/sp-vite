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
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Ambil Data Transaksi Hari Ini
      // JURUS PAMUNGKAS: Double Casting as unknown as string
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

      // 2. Ambil Pengeluaran Hari Ini
      const todayExpensesData = await db.expenses
        .where('date' as unknown as string)
        .startsWith(today)
        .toArray();

      const totalExpenses = todayExpensesData.reduce(
        (sum: number, e: any) => sum + Number(e.amount || 0), 
        0
      );

      // 3. Stok Produk & Nilai Aset
      const products = await db.products.toArray();
      const kritis = products.filter(p => Number(p.qty || 0) <= 5).length;
      const totalNilaiAset = products.reduce(
        (sum, p) => sum + (Number(p.price_modal || 0) * Number(p.qty || 0)), 
        0
      );

      // 4. Hitung Total Piutang (Status 'hutang')
      const allHutangTrans = await db.transactions
        .where('status' as unknown as string)
        .equals('hutang')
        .toArray();

      const totalPiutang = allHutangTrans.reduce(
        (sum: number, t: any) => sum + Number(t.total || 0), 
        0
      );

      // Update State
      stats.value = {
        omzet,
        stokKritis: kritis,
        totalPiutang: totalPiutang,
        labaHariIni: labaKotor - totalExpenses,
        nilaiStok: totalNilaiAset,
        pengeluaranHariIni: totalExpenses
      };

      // 5. Top Members
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
// File ini adalah Composable Function (Logic Helper) bernama useDashboard yang berfungsi sebagai "Mesin Pengolah Data" untuk halaman utama aplikasi Sinar Pagi POS. File ini memisahkan logika perhitungan yang rumit dari tampilan visual, bertugas mengambil data mentah dari database lokal (Dexie), melakukan kalkulasi matematika (seperti menghitung laba bersih dan nilai aset), serta menyediakan data yang sudah "matang" untuk ditampilkan di Dashboard. Dengan menggunakan fungsi ini, data keuangan toko selalu diperbarui secara otomatis setiap kali halaman dibuka.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Mengimpor fungsi reaktivitas dari Vue (ref, onMounted) dan koneksi database (db) untuk melakukan query data.
// Baris 4: Ekspor fungsi useDashboard; pola 'composable' yang memungkinkan logika ini digunakan kembali di berbagai tempat jika diperlukan.
// Baris 5-12: State 'stats'; menyiapkan wadah reaktif untuk menyimpan hasil perhitungan seperti Omzet, Stok Kritis, Piutang, Laba, Nilai Stok, dan Pengeluaran.
// Baris 17: Fungsi loadStats; sebuah fungsi asinkron (async) yang menjalankan seluruh proses pengambilan dan perhitungan data secara berurutan.
// Baris 19-21: Menentukan variabel 'today'; mengambil tanggal hari ini dalam format standar (YYYY-MM-DD) sebagai filter utama laporan harian.
// Baris 24-27: Query Transaksi; mengambil seluruh data penjualan yang terjadi hari ini dari tabel 'transactions'. Penggunaan 'as unknown as string' adalah teknik teknis agar TypeScript tidak memprotes filter pada database.
// Baris 32-42: Logika Perhitungan Laba; melakukan looping pada setiap transaksi dan setiap barang di dalamnya untuk menghitung selisih harga jual dan harga modal (Laba Kotor).
// Baris 45-52: Kalkulasi Pengeluaran; menjumlahkan seluruh biaya operasional toko yang dicatat hari ini (seperti biaya listrik, air, atau gaji).
// Baris 55-60: Analisis Inventaris; menghitung berapa banyak produk yang stoknya hampir habis (<= 5) dan menghitung total nilai aset toko berdasarkan harga modal barang yang tersedia.
// Baris 63-71: Manajemen Piutang; mencari transaksi yang statusnya masih 'hutang' (Tempo) dan menjumlahkan total tagihan yang belum dibayar oleh pelanggan.
// Baris 74-81: Update State Akhir; memperbarui variabel 'stats' dengan hasil akhir, termasuk menghitung Laba Bersih (Laba Kotor dikurangi Total Pengeluaran).
// Baris 84-88: Peringkat Member; mengambil data pelanggan, mengurutkannya berdasarkan poin terbanyak, dan hanya mengambil 10 besar (Top 10) untuk ditampilkan.
// Baris 95: onMounted; memastikan fungsi loadStats langsung dijalankan secara otomatis begitu kasir membuka halaman Dashboard.
// Baris 97-101: Return; mengembalikan data 'stats' dan 'topMembers' agar bisa digunakan oleh file Dashboard.vue.