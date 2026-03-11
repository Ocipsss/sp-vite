// src/utils/calculators.ts
import type { CartItem } from '../types';

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((acc, item) => {
    const subtotalProduk = (item.price_sell || 0) * (item.qty || 0);
    const subtotalExtra = (item.extraCharge || 0) * (item.extraChargeQty || 0);
    return acc + subtotalProduk + subtotalExtra;
  }, 0);
};

export const calculateChange = (cash: number, total: number): number => {
  return Math.max(0, cash - total);
};