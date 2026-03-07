export interface Product {
  id: string;
  image: string | null;
  name: string;
  code: string;
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
  cartId: string;      // ID unik di keranjang (agar bisa eceran & bungkus terpisah)
  extraCharge: number; // Harga jasa tambahan (misal: seduh)
  extraChargeQty: number;
  extraChargeName?: string;
}

// Interface untuk Jasa/Service
export interface ServiceItem {
  id: string;
  name: string;
  price: number;
}