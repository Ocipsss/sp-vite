/**
 * types/index.ts
 * Definisi tipe data global untuk Proyek Sinar Pagi
 */

/**
 * 1. MASTER DATA PRODUK & GROSIR
 */

export interface WholesaleConfig {
  min_qty: number;         // Minimal beli (misal: 10)
  wholesale_price: number; // Harga khusus grosir per pcs
}

export interface Product {
  id: string;
  image: string | null;
  name: string;
  code: string;           // Barcode atau SKU
  category: string;
  unit: string;           // Satuan (Pcs, Dus, Bal)
  price_modal: number;
  price_sell: number;
  qty: number;            // Stok saat ini
  qty_reduce: number;     // Isi per paket (untuk potong stok otomatis)
  pack_price: number;     // Harga per paket (Grosir)
  pack_size: number;      // Jumlah per paket
  wholesale_configs?: WholesaleConfig[]; // Konfigurasi harga grosir bertingkat
  updatedAt: string;
}

/**
 * 2. LAYANAN JASA & DIGITAL
 */

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

/**
 * 3. TRANSAKSI & KERANJANG (POS)
 */

export interface CartItem extends Product {
  cartId: string;         // ID unik di keranjang (untuk membedakan item yang sama)
  extraCharge: number;    // Harga jasa tambahan (misal: seduh/giling)
  extraChargeQty: number;
  extraChargeName?: string;
  discount_nominal?: number; // Diskon per item (tambahan untuk kalkulator)
  note?: string;          // Catatan khusus per item
}

export type PaymentMethod = 'Tunai' | 'QRIS' | 'Tempo';
export type TransactionStatus = 'success' | 'pending' | 'canceled';

export interface Transaction {
  id?: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  payMethod: PaymentMethod;
  cashAmount: number;     // Uang yang dibayarkan
  change: number;         // Kembalian
  memberId?: string;      // Relasi ke Member
  status: TransactionStatus;
  note?: string;          // Catatan transaksi (misal: "Titipan")
}

/**
 * 4. MEMBER & PELANGGAN
 */

export interface Member {
  id: string;
  name: string;
  phone?: string;
  points?: number;
  address?: string;       // Tambahan untuk pengiriman/piutang
  debt_limit?: number;    // Limit hutang jika ada
}

/**
 * 5. KEUANGAN (PIUTANG & PENGELUARAN)
 */

export interface DebtRecord {
  id: string;
  transactionId: string;
  memberId: string;
  total_debt: number;
  remaining_debt: number;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'paid';
}

export interface Expense {
  id: string;
  timestamp: number;
  category: string;       // Misal: Listrik, Gaji, Sewa
  amount: number;
  note: string;
}



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah Kontrak Data (Type Definitions/Interfaces) yang berfungsi sebagai standar struktur objek di seluruh sistem Sinar Pagi POS. File ini memastikan bahwa setiap data—baik itu produk, barang di keranjang, jasa, transaksi, maupun member—memiliki properti yang konsisten dan valid. Dengan menggunakan TypeScript Interface, pengembang mendapatkan fitur deteksi kesalahan otomatis (error checking) dan saran kode (autocomplete) yang akurat saat mengelola data stok, menghitung total belanja, hingga menyimpan riwayat penjualan ke database lokal maupun cloud.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-15: Interface Product; mendefinisikan struktur inti barang dagangan, termasuk informasi gambar, barcode (code), harga modal untuk hitung laba, serta harga paket (pack_price) untuk penjualan grosir/dus.
// Baris 18-26: Interface CartItem; merupakan pengembangan (extends) dari data produk yang khusus digunakan di dalam keranjang belanja. Menambahkan identitas unik (cartId) serta logika biaya jasa tambahan (extraCharge) seperti jasa giling atau seduh.
// Baris 29-33: Interface ServiceItem; struktur sederhana untuk mendefinisikan jenis layanan jasa yang ditawarkan toko beserta harganya.
// Baris 36-46: Interface Transaction; struktur lengkap untuk satu nota penjualan. Mencatat waktu (timestamp), daftar barang yang dibeli, total uang, metode pembayaran (Tunai/QRIS/Tempo), hingga status akhir transaksi.
// Baris 39: Menyimpan array items yang berisi CartItem; ini adalah histori detail apa saja yang dibeli pelanggan dalam satu transaksi tersebut.
// Baris 49-54: Interface Member; mendefinisikan profil pelanggan tetap, termasuk nomor telepon untuk pencarian dan poin loyalitas jika fitur tersebut diaktifkan di masa depan.
// Baris 5-13: Penggunaan tipe data primitif seperti 'number' dan 'string' memastikan perhitungan matematika (harga/stok) dan pengolahan teks (nama/kategori) berjalan sesuai aturan teknis.