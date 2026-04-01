export interface WholesaleConfig {
  min_qty: number;
  wholesale_price: number;
}

export interface Product {
  id: string;
  image: string | null;
  name: string;
  code: string;
  category: string;
  unit: string;
  price_modal: number;
  price_sell: number;
  qty: number;
  qty_reduce: number;
  pack_price: number;
  pack_size: number;
  wholesale_configs?: WholesaleConfig[];
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

export interface CartItem extends Product {
  cartId: string;
  extraCharge: number;
  extraChargeQty: number;
  extraChargeName?: string;
  discount_nominal?: number;
  note?: string;
}

export type PaymentMethod = 'Tunai' | 'QRIS' | 'Tempo';
export type TransactionStatus = 'success' | 'pending' | 'canceled';

export interface Transaction {
  id?: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  payMethod: PaymentMethod;
  cashAmount: number;
  change: number;
  memberId?: string;
  status: TransactionStatus;
  note?: string;
}

export interface Member {
  id: string;
  name: string;
  phone?: string;
  points?: number;
  address?: string;
  debt_limit?: number;
}

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
  category: string;
  amount: number;
  note: string;
}



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah jantung arsitektur data (Data Schema) yang mendefinisikan seluruh kontrak Interface dan Type untuk aplikasi Sinar Pagi. Menggunakan TypeScript, file ini memastikan bahwa setiap data yang mengalir—mulai dari produk, keranjang belanja, transaksi, hingga catatan hutang member—memiliki struktur yang konsisten dan valid. Dengan adanya file ini, pengembang mendapatkan fitur autocompletion dan deteksi error dini (type-safety) di seluruh komponen aplikasi, sehingga meminimalisir bug saat menangani logika bisnis yang kompleks seperti harga grosir dan sinkronisasi database.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-4: Interface WholesaleConfig; mendefinisikan struktur untuk skema harga grosir (jumlah minimal beli dan harga khusus yang didapatkan).
// Baris 6-21: Interface Product; skema utama untuk data barang di gudang, mencakup informasi dasar, harga modal/jual, pengaturan stok per paket (unit splitter), hingga konfigurasi grosir.
// Baris 23-27: Interface ServiceItem; kontrak data untuk item jasa atau layanan non-fisik yang memiliki nama dan harga tetap.
// Baris 29-36: Interface CartItem; turunan dari Product (extends) yang ditambahkan atribut khusus keranjang belanja seperti biaya tambahan (extra charge), diskon manual, dan catatan pembeli.
// Baris 38: Type PaymentMethod; membatasi pilihan metode pembayaran hanya pada opsi 'Tunai', 'QRIS', atau 'Tempo'.
// Baris 39: Type TransactionStatus; mendefinisikan status valid sebuah transaksi (berhasil, tertunda, atau dibatalkan).
// Baris 41-52: Interface Transaction; struktur lengkap sebuah nota penjualan, menyimpan data waktu (timestamp), daftar belanjaan, total biaya, metode bayar, hingga informasi kembalian.
// Baris 54-61: Interface Member; skema data pelanggan setia yang menyimpan informasi kontak, perolehan poin loyalitas, serta limit hutang (debt limit) yang diizinkan.
// Baris 63-71: Interface DebtRecord; kontrak data untuk mengelola piutang pelanggan, mencatat sisa hutang yang belum dibayar, tanggal jatuh tempo, dan status pelunasan.
// Baris 73-79: Interface Expense; struktur data untuk mencatat pengeluaran operasional toko (beban biaya) guna keperluan laporan laba rugi bersih.