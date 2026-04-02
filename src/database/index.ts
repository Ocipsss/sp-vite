import Dexie, { type Table } from 'dexie';
import type { 
  Product, 
  ProductPackage, 
  Transaction, 
  Expense, 
  Member, 
  ServiceItem,
  ID 
} from '@/types';

export const DEXIE_SCHEMA = {
  products: 'id, name, code, category, updatedAt',
  product_packages: 'id, name',
  categories: '++id, name',
  transactions: 'id, timestamp, date, memberId, status', 
  members: 'id, name, phone',
  expenses: 'id, timestamp, date, category', 
  services: 'id, name',
  digital_transactions: 'id, timestamp',
  settings: 'id'
};

export const DB_TABLES = Object.keys(DEXIE_SCHEMA);

export class SinarPagiDB extends Dexie {
  products!: Table<Product>;
  product_packages!: Table<ProductPackage>;
  categories!: Table<{ id?: number; name: string }>;
  transactions!: Table<Transaction>;
  members!: Table<Member>;
  expenses!: Table<Expense>;
  services!: Table<ServiceItem>;
  digital_transactions!: Table<any>;
  settings!: Table<any>;

  constructor() {
    super('SinarPagiDB');
    this.version(22).stores(DEXIE_SCHEMA);
  }
}

export const db = new SinarPagiDB();

export const generateUID = (): ID => {
  return `SP-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
};
