import type { CartItem, WholesaleConfig } from '@/types';

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((acc, item) => {
    const subtotalProduk = (Number(item.price_sell) || 0) * (Number(item.qty) || 0);
    const subtotalExtra = (Number(item.extraCharge) || 0) * (Number(item.extraChargeQty) || 0);
    return acc + subtotalProduk + subtotalExtra;
  }, 0);
};

export const calculateChange = (cash: number, total: number): number => {
  return Math.max(0, cash - total);
};

export const calculateMemberPoints = (totalBelanja: number, multiplier: number = 10000): number => {
  return Math.floor(totalBelanja / multiplier);
};

export const calculateStockReduction = (qtyBought: number, qtyReduce: number = 1): number => {
  return Number(qtyBought) * Number(qtyReduce);
};

export const calculateUnitPrice = (packageModal: number, quantityInPackage: number): number => {
  if (!quantityInPackage || quantityInPackage <= 0) return packageModal;
  return Math.ceil(packageModal / quantityInPackage);
};

export const determinePrice = (qty: number, normalPrice: number, wholesaleConfigs: WholesaleConfig[] = []): number => {
  if (!Array.isArray(wholesaleConfigs) || wholesaleConfigs.length === 0) return normalPrice;
  
  const sortedConfigs = [...wholesaleConfigs].sort((a, b) => b.min_qty - a.min_qty);
  
  const applicableConfig = sortedConfigs.find(config => qty >= config.min_qty);
  return applicableConfig ? applicableConfig.wholesale_price : normalPrice;
};

export const calculateGrossProfit = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const modal = Number(item.price_modal || 0);
    const jual = Number(item.price_sell || 0);
    const qty = Number(item.qty || 0);
    return total + ((jual - modal) * qty);
  }, 0);
};

export const calculateNetProfit = (grossProfit: number, totalExpenses: number): number => {
  return grossProfit - totalExpenses;
};

export const calculateNetBalance = (inflow: number, outflow: number): number => {
  return inflow - outflow;
};

export const calculateAssetValue = (products: any[]): number => {
  return products.reduce((sum, p) => {
    return sum + (Number(p.price_modal || 0) * Number(p.qty || 0));
  }, 0);
};

export const calculateDigitalPhysicalCash = (type: 'topup' | 'tariktunai', nominal: number, adminFee: number): number => {
  if (type === 'topup') return nominal + adminFee;
  return adminFee - nominal;
};

export const calculateRemainingDebt = (totalTagihan: number, totalDibayar: number): number => {
  const sisa = totalTagihan - totalDibayar;
  return sisa > 0 ? sisa : 0;
};

export const calculateMarginPercentage = (priceSell: number, priceModal: number): string => {
  if (!priceModal || priceModal === 0) return "0%";
  const profit = priceSell - priceModal;
  const percentage = (profit / priceModal) * 100;
  return percentage.toFixed(2) + "%";
};
