/**
 * calculator.ts
 * Logika perhitungan bisnis, inventaris, dan keuangan Sinar Pagi
 */

import type { CartItem, WholesaleConfig } from '@/types';

/**
 * 1. LOGIKA TRANSAKSI & KERANJANG
 */

// Hitung total belanja di keranjang (Termasuk biaya jasa/charge tambahan)
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((acc, item) => {
    const subtotalProduk = (Number(item.price_sell) || 0) * (Number(item.qty) || 0);
    const subtotalExtra = (Number(item.extraCharge) || 0) * (Number(item.extraChargeQty) || 0);
    return acc + subtotalProduk + subtotalExtra;
  }, 0);
};

// Hitung kembalian uang tunai (Minimum 0)
export const calculateChange = (cash: number, total: number): number => {
  return Math.max(0, cash - total);
};

// Perhitungan poin member (Contoh: tiap kelipatan 10.000 dapat 1 poin)
export const calculateMemberPoints = (totalBelanja: number, multiplier: number = 10000): number => {
  return Math.floor(totalBelanja / multiplier);
};

/**
 * 2. LOGIKA STOK & HARGA GROSIR
 */

// Hitung pengurangan stok riil (Qty Beli * Isi per Paket)
export const calculateStockReduction = (qtyBought: number, qtyReduce: number = 1): number => {
  return Number(qtyBought) * Number(qtyReduce);
};

// Menghitung Harga Modal Per Pcs secara otomatis (Unit Price Splitter)
export const calculateUnitPrice = (packageModal: number, quantityInPackage: number): number => {
  if (!quantityInPackage || quantityInPackage <= 0) return packageModal;
  return Math.ceil(packageModal / quantityInPackage);
};

// Logika penentu harga: Apakah pakai harga normal atau harga grosir?
export const determinePrice = (qty: number, normalPrice: number, wholesaleConfigs: WholesaleConfig[] = []): number => {
  if (!Array.isArray(wholesaleConfigs) || wholesaleConfigs.length === 0) return normalPrice;
  
  // Urutkan dari min_qty terbesar ke terkecil agar qty tertinggi diprioritaskan
  const sortedConfigs = [...wholesaleConfigs].sort((a, b) => b.min_qty - a.min_qty);
  
  const applicableConfig = sortedConfigs.find(config => qty >= config.min_qty);
  return applicableConfig ? applicableConfig.wholesale_price : normalPrice;
};

/**
 * 3. LOGIKA KEUANGAN & LABA
 */

// Hitung Laba Kotor (Total Harga Jual - Total Harga Modal)
export const calculateGrossProfit = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const modal = Number(item.price_modal || 0);
    const jual = Number(item.price_sell || 0);
    const qty = Number(item.qty || 0);
    return total + ((jual - modal) * qty);
  }, 0);
};

// Hitung Laba Bersih (Laba Kotor - Total Biaya Pengeluaran)
export const calculateNetProfit = (grossProfit: number, totalExpenses: number): number => {
  return grossProfit - totalExpenses;
};

// Hitung Arus Kas/Saldo Netto (Total Uang Masuk - Total Uang Keluar)
export const calculateNetBalance = (inflow: number, outflow: number): number => {
  return inflow - outflow;
};

// Hitung total nilai aset stok (Harga Modal x Sisa Stok)
export const calculateAssetValue = (products: any[]): number => {
  return products.reduce((sum, p) => {
    return sum + (Number(p.price_modal || 0) * Number(p.qty || 0));
  }, 0);
};

/**
 * 4. LAYANAN DIGITAL & PIUTANG
 */

// Hitung estimasi kas fisik (Uang tunai yang harus ada di laci)
export const calculateDigitalPhysicalCash = (type: 'topup' | 'tariktunai', nominal: number, adminFee: number): number => {
  if (type === 'topup') return nominal + adminFee; // Pelanggan kasih uang + biaya admin
  return adminFee - nominal; // Kita kasih uang ke pelanggan, tapi ambil biaya admin
};

// Hitung sisa piutang/hutang
export const calculateRemainingDebt = (totalTagihan: number, totalDibayar: number): number => {
  const sisa = totalTagihan - totalDibayar;
  return sisa > 0 ? sisa : 0;
};

/**
 * 5. ANALISA MARGIN
 */

// Menghitung Persentase Mark-up/Margin
export const calculateMarginPercentage = (priceSell: number, priceModal: number): string => {
  if (!priceModal || priceModal === 0) return "0%";
  const profit = priceSell - priceModal;
  const percentage = (profit / priceModal) * 100;
  return percentage.toFixed(2) + "%";
};