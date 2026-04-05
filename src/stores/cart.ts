import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db, generateUID } from '@/database';
import type { CartItem, Product, Transaction, PaymentMethod } from '@/types';
import { calculateCartTotal, calculateChange } from '@/utils/calculators';
import { deepCopy } from '@/utils/formatters';
import { TRANSACTION_STATUS } from '@/constants/app';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const paymentMethod = ref<PaymentMethod>('Tunai');
  const cashAmount = ref<number>(0);
  const isScannerOpen = ref(false);
  const selectedMemberId = ref<string | null>(null);
  const searchQuery = ref<string>("");
  const totalBelanja = computed(() => calculateCartTotal(items.value));
  const kembalian = computed(() => calculateChange(cashAmount.value, totalBelanja.value));

  const clearSearch = () => {
    searchQuery.value = "";
  };

  const toggleScanner = (status: boolean) => {
    isScannerOpen.value = status;
  };

  const updateQty = (cartId: string, change: number) => {
    const index = items.value.findIndex(i => i.cartId === cartId);
    const item = items.value[index];

    if (item) {
      item.qty += change;
      if (item.qty <= 0) {
        items.value.splice(index, 1);
      }
    }
  };

  const setExtraCharge = (cartId: string, service: { name: string; price: number }) => {
    const item = items.value.find(i => i.cartId === cartId);
    if (item) {
      item.extraChargeName = service.name;
      item.extraCharge = service.price;
      if (!item.extraChargeQty || item.extraChargeQty === 0) {
        item.extraChargeQty = item.qty;
      }
    }
  };

  const updateExtraQty = (cartId: string, change: number) => {
    const item = items.value.find(i => i.cartId === cartId);
    if (item) {
      const currentQty = item.extraChargeQty || 0;
      item.extraChargeQty = Math.max(0, currentQty + change);
    }
  };

  const removeExtraCharge = (cartId: string) => {
    const item = items.value.find(i => i.cartId === cartId);
    if (item) {
      item.extraChargeName = '';
      item.extraCharge = 0;
      item.extraChargeQty = 0;
    }
  };

  const addToCart = (product: Product, isPackage = false) => {
    const cartId = isPackage ? `${product.id}-pkg` : `${product.id}-reg`;
    const existing = items.value.find(i => i.cartId === cartId);

    if (existing) {
      existing.qty++;
      if (existing.extraChargeName) {
        existing.extraChargeQty = (existing.extraChargeQty || 0) + 1;
      }
    } else {
      items.value.push({
        ...deepCopy(product),
        cartId,
        qty: 1,
        extraCharge: 0,
        extraChargeQty: 0,
        extraChargeName: '',
        price_sell: isPackage ? (product.pack_price || product.price_sell) : product.price_sell,
        qty_reduce: isPackage ? (product.pack_size || 1) : 1
      } as CartItem);
    }
  };

  const processCheckout = async () => {
    const transactionId = generateUID();
    const now = new Date();
    const transactionData: Transaction = {
      id: transactionId,
      date: now.toISOString(),
      timestamp: now.getTime(),
      total: totalBelanja.value,
      memberId: selectedMemberId.value,
      paymentMethod: paymentMethod.value,
      amountPaid: cashAmount.value,
      change: kembalian.value,
      status: TRANSACTION_STATUS.SUCCESS,
      items: deepCopy(items.value)
    };

    try {
      await db.transaction('rw', [db.transactions, db.products, db.stock_logs], async () => {
        await db.transactions.add(transactionData);

        for (const item of items.value) {
          const p = await db.products.get(item.id);
          
          if (p) {
            const multiplier = item.qty_reduce || 1;
            const totalReduce = item.qty * multiplier;
            const finalQty = p.qty - totalReduce;

            await db.products.update(item.id, {
              qty: finalQty,
              updatedAt: now.toISOString()
            });

            await db.stock_logs.add({
              id: generateUID(),
              productId: item.id,
              type: 'OUT',
              prevQty: p.qty,
              changeQty: totalReduce,
              finalQty: finalQty,
              referenceId: transactionId,
              note: `Penjualan: ${item.name} ${item.qty_reduce && item.qty_reduce > 1 ? '(Grosir/Paket)' : ''}`,
              timestamp: now.getTime()
            });
          }
        }
      });

      resetCart();
      return transactionId;
    } catch (error) {
      console.error("Checkout Gagal:", error);
      throw error;
    }
  };

  const resetCart = () => {
    items.value = [];
    cashAmount.value = 0;
    selectedMemberId.value = null;
    paymentMethod.value = 'Tunai';
    searchQuery.value = "";
  };

  return { 
    items, paymentMethod, cashAmount, isScannerOpen, selectedMemberId, searchQuery,
    totalBelanja, kembalian, 
    addToCart, updateQty, processCheckout, resetCart, toggleScanner, clearSearch,
    setExtraCharge, updateExtraQty, removeExtraCharge
  };
});
