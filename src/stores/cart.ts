// src/stores/cart.ts
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

  const clearSearch = () => {
    searchQuery.value = "";
  };

  const toggleScanner = (status: boolean) => {
    isScannerOpen.value = status;
  };

  const updateQty = (cartId: string, change: number) => {
    const index = items.value.findIndex(i => i.cartId === cartId);
    if (index !== -1) {
      const item = items.value[index];
      if (item) {
        item.qty += change;
        // Logika hapus jika qty habis
        if (item.qty <= 0) {
          items.value.splice(index, 1);
        }
      }
    }
  };

  /**
   * Menambahkan biaya tambahan (Jasa) ke item tertentu
   */
  const setExtraCharge = (cartId: string, service: { name: string; price: number }) => {
    const item = items.value.find(i => i.cartId === cartId);
    if (item) {
      item.extraChargeName = service.name;
      item.extraCharge = service.price;
      // Jika qty jasa belum ada, samakan dengan qty produk
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

  /**
   * Menambahkan produk ke keranjang
   * Menggunakan type Product untuk menghilangkan warning 'unused declaration'
   */
  const addToCart = (product: Product, isPackage = false) => {
    const cartId = isPackage ? `${product.id}-pkg` : `${product.id}-reg`;
    const existing = items.value.find(i => i.cartId === cartId);

    if (existing) {
      existing.qty++;
      // Jika ada jasa, update juga qty jasanya secara sinkron
      if (existing.extraChargeName) {
        existing.extraChargeQty = (existing.extraChargeQty || 0) + 1;
      }
    } else {
      items.value.push({
        ...JSON.parse(JSON.stringify(product)), // Deep copy agar tidak merujuk ke objek database
        cartId,
        qty: 1,
        extraCharge: 0,
        extraChargeQty: 0,
        extraChargeName: '',
        // Penanganan harga dan reduksi stok untuk paket vs eceran
        price_sell: isPackage ? (product.pack_price || product.price_sell) : product.price_sell,
        qty_reduce: isPackage ? (product.pack_size || 1) : 1
      });
    }
  };

  const processCheckout = async () => {
    const transactionId = generateUID();
    
    // Siapkan data transaksi
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
      // 1. Simpan ke database transaksi
      await db.table('transactions').add(transactionData);

      // 2. Update stok produk di database
      for (const item of items.value) {
        const p = await db.table('products').get(item.id);
        if (p) {
          const multiplier = item.qty_reduce || 1;
          const totalReduce = item.qty * multiplier;
          
          await db.table('products').update(item.id, { 
            qty: p.qty - totalReduce,
            updatedAt: new Date().toISOString() 
          });
        }
      }

      // 3. Bersihkan keranjang
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
    searchQuery.value = "";
  };

  return { 
    items, payMethod, cashAmount, isScannerOpen, selectedMemberId, searchQuery,
    totalBelanja, kembalian, 
    addToCart, updateQty, processCheckout, resetCart, toggleScanner, clearSearch,
    setExtraCharge, updateExtraQty, removeExtraCharge
  };
});