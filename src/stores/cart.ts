import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db, generateUID } from '../database';
import type { CartItem, Product } from '../types';

export const useCartStore = defineStore('cart', () => {
  // --- STATE ---
  const items = ref<CartItem[]>([]);
  const payMethod = ref<'Tunai' | 'QRIS' | 'Tempo' | null>('Tunai');
  const cashAmount = ref<number>(0);
  const isScannerOpen = ref(false); 
  const selectedMemberId = ref<string | null>(null); 
  
  // Penambahan searchQuery untuk filter Global
  const searchQuery = ref<string>(""); 

  // --- GETTERS ---
  const totalBelanja = computed(() => {
    return items.value.reduce((acc, item) => {
      const subtotalProduk = (item.price_sell || 0) * (item.qty || 0);
      const subtotalExtra = (item.extraCharge || 0) * (item.extraChargeQty || 0);
      return acc + subtotalProduk + subtotalExtra;
    }, 0);
  });

  const kembalian = computed(() => {
    return Math.max(0, cashAmount.value - totalBelanja.value);
  });

  // --- ACTIONS ---
  
  // Action untuk mereset pencarian jika diperlukan
  const clearSearch = () => {
    searchQuery.value = "";
  };

  const toggleScanner = (status: boolean) => {
    isScannerOpen.value = status;
  };

  const updateQty = (cartId: string, change: number) => {
    const index = items.value.findIndex(i => i.cartId === cartId);
    if (index !== -1) {
      items.value[index].qty += change;
      if (items.value[index].qty <= 0) {
        items.value.splice(index, 1);
      }
    }
  };

  const addToCart = (product: Product, isPackage = false) => {
    const cartId = isPackage ? `${product.id}-pkg` : `${product.id}-reg`;
    
    const existing = items.value.find(i => i.cartId === cartId);
    if (existing) {
      existing.qty++;
    } else {
      items.value.push({
        ...JSON.parse(JSON.stringify(product)),
        cartId,
        qty: 1,
        price_sell: isPackage ? (product.pack_price || product.price_sell) : product.price_sell,
        price_modal: product.price_modal || 0,
        qty_reduce: isPackage ? (product.pack_size || 1) : 1, 
        extraCharge: 0,
        extraChargeQty: 0,
        extraChargeName: ''
      });
    }
  };

  const processCheckout = async () => {
    const transactionId = generateUID();
    
    const transactionData = {
      id: transactionId,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      total: totalBelanja.value,
      memberId: selectedMemberId.value,
      paymentMethod: payMethod.value,
      amountPaid: cashAmount.value,
      change: kembalian.value,
      status: 'Selesai',
      items: JSON.parse(JSON.stringify(items.value))
    };

    try {
      await db.table('transactions').add(transactionData);

      for (const item of items.value) {
        const p = await db.table('products').get(item.id);
        if (p) {
          const totalReduce = item.qty * (item.qty_reduce || 1);
          await db.table('products').update(item.id, { 
            qty: p.qty - totalReduce,
            updatedAt: new Date().toISOString() 
          });
        }
      }

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
    payMethod.value = 'Tunai';
    searchQuery.value = ""; // Reset pencarian juga saat transaksi selesai
  };

  return { 
    items, payMethod, cashAmount, isScannerOpen, selectedMemberId, searchQuery,
    totalBelanja, kembalian, 
    addToCart, updateQty, processCheckout, resetCart, toggleScanner, clearSearch
  };
});
