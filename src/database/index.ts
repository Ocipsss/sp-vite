import Dexie, { type Table } from 'dexie';

// --- INTERFACES (Definisi Data) ---
export interface Product {
  id: string; // Kita pakai string untuk UID
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
    
    // Sesuaikan dengan Versi 19 dari database lama kamu
    this.version(19).stores({
      products: 'id, name, code, category',
      product_packages: 'id, productId, name',
      categories: '++id, name',
      transactions: 'id, date, total, memberId',
      members: 'id, name, phone',
      expenses: 'id, date, category',
      digital_transactions: 'id, date, type',
      services: '++id, name',
      settings: 'id, storeName'
    });
  }
}

export const db = new SinarPagiDB();

// --- HELPER: GENERATE UID (Anti-Tabrakan) ---
export const generateUID = () => {
  return 'SP-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
};