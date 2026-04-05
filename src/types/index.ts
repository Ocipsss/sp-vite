export type ID = string;
export type ISODataString = string;
export type UnixTimestamp = number;
export type PaymentMethod = 'Tunai' | 'QRIS' | 'Tempo';
// Tambahan 'partial' untuk mendukung cicilan di level transaksi
export type TransactionStatus = 'success' | 'pending' | 'canceled' | 'partial';
// Tambahan 'overdue' untuk peringatan jatuh tempo
export type DebtStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';

export interface WholesaleConfig {
  min_qty: number;
  wholesale_price: number;
}

export type StockMutationType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';

export interface StockLog {
  id: string;
  productId: string;
  type: StockMutationType;
  prevQty: number;
  changeQty: number;
  finalQty: number;
  price_modal: number;
  price_sell: number;
  referenceId?: string;
  note?: string;
  timestamp: number;
}

export interface Product {
  id: ID;
  code: string;
  name: string;
  category: string;
  unit: string;
  price_modal: number;
  price_sell: number;
  qty: number;
  image: string | null;
  qty_reduce?: number;
  pack_price?: number;
  pack_size?: number;
  wholesale_configs?: WholesaleConfig[];
  updatedAt: ISODataString;
}

export interface Member {
  id: ID;
  name: string;
  phone?: string;
  points?: number;
  address?: string;
  debt_limit?: number;
}

export interface DebtRecord {
  id: ID;
  transactionId: ID;
  memberId: ID;
  amount_total: number;
  amount_remaining: number;
  dueDate: ISODataString;
  status: DebtStatus;
  createdAt: ISODataString;
}

export interface CartItem {
  cartId: ID;
  id: ID;
  name: string;
  code: string;
  qty: number;
  unit: string;
  price_modal: number;
  price_sell: number;
  qty_reduce: number;
  extraCharge: number;
  extraChargeQty: number;
  extraChargeName?: string;
  discount_nominal?: number;
  note?: string;
}

export interface Transaction {
  id: ID;
  timestamp: UnixTimestamp;
  date: ISODataString;
  items: CartItem[];
  amount_total: number;
  amount_paid: number;
  amount_change: number;
  paymentMethod: PaymentMethod;
  memberId?: ID | null;
  status: TransactionStatus;
  note?: string;
}

export interface Expense {
  id: ID;
  timestamp: UnixTimestamp;
  date: ISODataString;
  category: string;
  amount: number;
  note: string;
}

export interface DigitalTransaction {
  id: ID;
  timestamp: UnixTimestamp;
  type: string;
  amount: number;
  provider: string;
  status: TransactionStatus;
}

export interface AppSettings {
  id: 'main_settings';
  storeName: string;
  address: string;
  footerMessage: string;
  isPrinterActive: boolean;
}

export interface ProductPackage {
  id: ID;
  productId: ID;
  name: string;
  qty_pcs: number;
  price_sell: number;
}

export interface ServiceItem {
  id: ID;
  name: string;
  price: number;
}
