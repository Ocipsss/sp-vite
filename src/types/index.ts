// src/types/index.ts

export interface Product {
  id: string;
  image: string | null;
  name: string;
  code: string;     // Ini biasanya Barcode atau Kode SKU
  category: string;
  unit: string;
  price_modal: number;
  price_sell: number;
  qty: number;
  pack_price: number;
  pack_size: number;
  updatedAt: string;
}

// Interface untuk item di keranjang belanja
export interface CartItem extends Product {
  cartId: string;      // ID unik untuk membedakan item yang sama tapi beda perlakuan
  extraCharge: number; // Harga jasa tambahan (misal: seduh/giling)
  extraChargeQty: number;
  extraChargeName?: string;
  // Tambahan: catatan jika diperlukan (opsional)
  note?: string; 
}

// Interface untuk Jasa/Service (Misal: Jasa Seduh, Jasa Bungkus, dll)
export interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

// Tambahan: Interface untuk Transaksi (Penting untuk simpan ke Firebase/Dexie)
export interface Transaction {
  id?: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  payMethod: 'Tunai' | 'QRIS' | 'Tempo';
  cashAmount: number;
  change: number;
  memberId?: string; // Jika pembeli adalah member
  status: 'success' | 'pending' | 'canceled';
}

// Tambahan: Interface untuk Member (Sesuai kode awal kamu ada fitur pilih pelanggan)
export interface Member {
  id: string;
  name: string;
  phone?: string;
  points?: number;
}
