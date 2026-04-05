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
  ID 
} from '@/types';

export const DEXIE_SCHEMA = {
  products: 'id, name, code, category, qty, updatedAt',
  product_packages: 'id, name, productId',
  categories: 'id, name',
  transactions: 'id, timestamp, date, memberId, status', 
  members: 'id, name, phone',
  expenses: 'id, timestamp, date, category', 
  services: 'id, name, price',
  digital_transactions: 'id, timestamp',
  settings: 'id',
  debts: 'id, transactionId, memberId, status, dueDate' 
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

  constructor() {
    super('SinarPagiDB');
    this.version(24).stores(DEXIE_SCHEMA);
  }
}

export const db = new SinarPagiDB();

export const generateUID = (): ID => {
  const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID().split('-')[0] 
    : Math.random().toString(36).substring(2, 7);
    
  return `SP-${Date.now().toString(36)}-${randomPart}`;
};
