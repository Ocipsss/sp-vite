import Dexie, { type Table } from 'dexie';
import { DEXIE_SCHEMA } from './schema';

// --- INTERFACES ---
export interface Product {
  id: string; 
  name: string;
  code: string;
  category: string;
  price_modal: number;
  price_sell: number;
  qty: number;
  unit: string;
}

export interface ProductPackage {
  id: string;
  productId: string;
  name: string;
  qty_pcs: number;
  price_sell: number;
}

// PERBAIKAN: Gunakan 'string' yang pasti untuk date
export interface Transaction {
  id: string;
  date: string; 
  total: number;
  memberId?: string | null;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  status: string;
  items: any[];
}

// TAMBAHKAN: Interface untuk Expense agar tidak 'any'
export interface Expense {
  id?: number;
  date: string;
  amount: number;
  category: string;
  description?: string;
}

export class SinarPagiDB extends Dexie {
  products!: Table<Product>;
  product_packages!: Table<ProductPackage>;
  categories!: Table<{ id?: number; name: string }>;
  transactions!: Table<Transaction>;
  members!: Table<any>;
  expenses!: Table<Expense>; // Ganti any dengan Expense
  digital_transactions!: Table<any>;
  services!: Table<any>;
  settings!: Table<any>;

  constructor() {
    super('SinarPagiDB');
    this.version(19).stores(DEXIE_SCHEMA);
  }
}

export const db = new SinarPagiDB();

export const generateUID = () => {
  return 'SP-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
};



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah Jantung Database Lokal (Local Database Engine) untuk aplikasi Sinar Pagi POS yang dibangun menggunakan Dexie.js (pembungkus IndexedDB). File ini mendefinisikan struktur data (Schema), kontrak data (Interfaces), dan inisialisasi koneksi database agar aplikasi dapat berjalan sepenuhnya secara offline-first. Di sini juga diatur sistem penomoran unik (UID) otomatis untuk setiap entitas data seperti produk, transaksi, dan pengeluaran guna memastikan tidak ada tabrakan data saat sinkronisasi ke cloud nantinya.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Mengimpor library Dexie untuk manajemen IndexedDB dan skema database (DEXIE_SCHEMA) yang berisi definisi index tabel.
// Baris 5-14: Interface Product; menentukan struktur baku data produk mulai dari nama, barcode (code), kategori, hingga perhitungan harga modal dan harga jual.
// Baris 16-22: Interface ProductPackage; mendefinisikan struktur untuk harga grosir atau paket (misal: harga per dus yang berisi sekian pcs).
// Baris 25-35: Interface Transaction; mengatur data penjualan yang kompleks, termasuk total belanja, metode pembayaran, uang bayar, kembalian, hingga daftar barang (items) dalam transaksi tersebut.
// Baris 38-44: Interface Expense; menentukan struktur data pengeluaran toko seperti tanggal, nominal, kategori biaya, dan keterangan tambahan.
// Baris 46-56: Class SinarPagiDB; mendefinisikan blueprint database yang mendaftarkan seluruh tabel yang tersedia (Produk, Transaksi, Member, Biaya Jasa, Pengaturan, dll) agar dikenali oleh TypeScript.
// Baris 58-61: Constructor Database; memberikan nama database 'SinarPagiDB' dan menentukan versi database (saat ini versi 19) yang merujuk pada file skema eksternal.
// Baris 64: Ekspor instance 'db'; variabel inilah yang digunakan di seluruh aplikasi untuk menambah, menghapus, atau mencari data di memori perangkat.
// Baris 66-68: Fungsi generateUID; logika kustom untuk menghasilkan ID unik yang menggabungkan prefix 'SP', timestamp waktu (base36), dan karakter acak agar setiap data memiliki identitas yang benar-benar unik dan aman.