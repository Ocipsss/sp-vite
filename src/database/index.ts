// src/database/index.ts
import Dexie, { type Table } from 'dexie';
import { DEXIE_SCHEMA } from './schema';

// --- INTERFACES (Definisi Data) ---
// Kita tetap pertahankan di sini agar mudah di-import oleh komponen lain
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

// --- DATABASE CLASS ---
export class SinarPagiDB extends Dexie {
  // Definisi Table dengan Type Safety
  products!: Table<Product>;
  product_packages!: Table<ProductPackage>;
  categories!: Table<{ id?: number; name: string }>;
  transactions!: Table<Transaction>;
  members!: Table<any>;
  expenses!: Table<any>;
  digital_transactions!: Table<any>;
  services!: Table<any>;
  settings!: Table<any>;

  constructor() {
    super('SinarPagiDB');
    
    // Menggunakan schema dari src/database/schema.ts
    // Tetap menggunakan versi 19 sesuai struktur Anda
    this.version(19).stores(DEXIE_SCHEMA);
  }
}

// Create Instance
export const db = new SinarPagiDB();

// --- HELPER: GENERATE UID (Anti-Tabrakan) ---
export const generateUID = () => {
  return 'SP-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
};