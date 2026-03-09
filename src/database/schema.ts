// src/database/schema.ts

// Daftar semua tabel yang ada di Dexie SinarPagiDB
export const DB_TABLES = [
  'products',
  'product_packages',
  'categories',
  'transactions',
  'members',
  'expenses',
  'digital_transactions',
  'services',
  'settings'
] as const;

// Tipe data untuk nama tabel (untuk type-safety di TypeScript)
export type TableName = typeof DB_TABLES[number];

// Definisi store schema untuk Dexie (versi 19)
export const DEXIE_SCHEMA = {
  products: 'id, name, code, category',
  product_packages: 'id, productId, name',
  categories: '++id, name',
  transactions: 'id, date, total, memberId',
  members: 'id, name, phone',
  expenses: 'id, date, category',
  digital_transactions: 'id, date, type',
  services: '++id, name',
  settings: 'id, storeName'
};