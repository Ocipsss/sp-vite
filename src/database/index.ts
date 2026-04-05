import Dexie, { type Table } from 'dexie';
import type { 
  Product, 
  ProductPackage, 
  Transaction, 
  Expense, 
  Member, 
  ServiceItem,
  DigitalTransaction,
  AppSettings,
  DebtRecord,
  StockLog,
  ID 
} from '@/types';

export const DEXIE_SCHEMA = {
  // Ditambahkan index 'category' dan 'code' untuk pencarian produk yang lebih cepat
  products: 'id, name, code, category, qty, updatedAt',
  product_packages: 'id, name, productId',
  categories: 'id, name',
  // Index pada 'memberId', 'status', dan 'paymentMethod' untuk laporan filter transaksi
  transactions: 'id, timestamp, date, memberId, status, paymentMethod', 
  members: 'id, name, phone',
  expenses: 'id, timestamp, date, category', 
  services: 'id, name, price',
  digital_transactions: 'id, timestamp',
  settings: 'id',
  // PENTING: Index 'amount_remaining' dan 'dueDate' ditambahkan untuk fitur manajemen hutang/piutang
  debts: 'id, transactionId, memberId, status, dueDate, amount_remaining',
  stock_logs: 'id, productId, type, timestamp'
};

export const DB_TABLES = Object.keys(DEXIE_SCHEMA);

export class SinarPagiDB extends Dexie {
  products!: Table<Product>;
  product_packages!: Table<ProductPackage>;
  categories!: Table<{ id: ID; name: string }>;
  transactions!: Table<Transaction>;
  members!: Table<Member>;
  expenses!: Table<Expense>;
  services!: Table<ServiceItem>;
  digital_transactions!: Table<DigitalTransaction>;
  settings!: Table<AppSettings>;
  debts!: Table<DebtRecord>;
  stock_logs!: Table<StockLog>;

  constructor() {
    super('SinarPagiDB');
    /**
     * Versi 27: 
     * 1. Mendukung penamaan kolom seragam (amount_total, dsb)
     * 2. Mendukung status transaksi baru (partial)
     * 3. Penambahan index untuk performa query hutang/piutang
     */
    this.version(27).stores(DEXIE_SCHEMA);
  }
}

export const db = new SinarPagiDB();

export const generateUID = (): ID => {
  // Menggunakan crypto.randomUUID jika tersedia (modern browser/Android WebView baru)
  // Fallback ke math random jika di lingkungan lama
  const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID().split('-')[0] 
    : Math.random().toString(36).substring(2, 7);
    
  return `SP-${Date.now().toString(36)}-${randomPart}`;
};
