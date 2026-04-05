export type ID = string;
export type ISODataString = string;
export type UnixTimestamp = number;
export type PaymentMethod = 'Tunai' | 'QRIS' | 'Tempo';
export type TransactionStatus = 'success' | 'pending' | 'canceled';
export type DebtStatus = 'unpaid' | 'partial' | 'paid';

export interface WholesaleConfig {
  min_qty: number;
  wholesale_price: number;
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

export interface ProductPackage {
  id: ID;
  productId: ID;
  name: string;
  qty_pcs: number;
  price_sell: number;
}

export interface Member {
  id: ID;
  name: string;
  phone?: string;
  points?: number;
  address?: string;
  debt_limit?: number;
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

export interface DebtRecord {
  id: ID;
  transactionId: ID;
  memberId: ID;
  total_debt: number;
  remaining_debt: number;
  dueDate: ISODataString;
  status: DebtStatus;
}

export interface ServiceItem {
  id: ID;
  name: string;
  price: number;
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
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
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
