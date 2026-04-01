import Dexie, { type Table } from 'dexie';
import { DEXIE_SCHEMA } from './schema';
import type { 
  Product, 
  ProductPackage, 
  Transaction, 
  Expense, 
  Member, 
  ServiceItem,
  ID 
} from '@/types';

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
    this.version(19).stores(DEXIE_SCHEMA);
  }
}

export const db = new SinarPagiDB();

export const generateUID = (): ID => {
  return `SP-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
};
