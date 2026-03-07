import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db, generateUID } from '../database';

export const useCartStore = defineStore('cart', () => {
  // --- STATE ---
  const items = ref<any[]>([]);
  const payMethod = ref<'Tunai' | 'QRIS' | 'Tempo'>('Tunai');
  const cashAmount = ref<number>(0);

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
  const updateQty = (cartId: string, change: number) => {
    const index = items.value.findIndex(i => i.cartId === cartId);
    if (index !== -1) {
      items.value[index].qty += change;
      if (items.value[index].qty <= 0) {
        items.value.splice(index, 1);
      }
    }
  };

  const addToCart = (product: any, isPackage = false) => {
    // ID unik untuk membedakan barang yang sama tapi beda kemasan (Ecer/Bungkus)
    const cartId = isPackage ? `${product.id}-pkg` : product.id;
    
    const existing = items.value.find(i => i.cartId === cartId);
    if (existing) {
      existing.qty++;
    } else {
      items.value.push({
        ...product,
        cartId,
        qty: 1,
        // Penting untuk hitung laba rugi Sinar Pagi
        price_modal: product.price_modal || 0,
        qty_reduce: isPackage ? (product.qty_pcs || 1) : 1, 
        extraCharge: 0,
        extraChargeQty: 0
      });
    }
  };

  const processCheckout = async (memberId: string | null = null) => {
    const transactionId = generateUID();
    
    const transactionData = {
      id: transactionId,
      date: new Date().toISOString(),
      total: totalBelanja.value,
      memberId: memberId,
      paymentMethod: payMethod.value,
      amountPaid: cashAmount.value,
      change: kembalian.value,
      status: 'Selesai',
      items: JSON.parse(JSON.stringify(items.value))
    };

    // 1. Simpan Transaksi
    await db.transactions.add(transactionData);

    // 2. Potong Stok (Logika Eceran Sinar Pagi)
    for (const item of items.value) {
      const p = await db.products.get(item.productId || item.id);
      if (p) {
        // Jika beli 1 ecer (isi 12), maka stok berkurang 1/12 atau sesuai qty_reduce
        const reduceAmount = item.qty * (item.qty_reduce || 1);
        await db.products.update(p.id, { qty: p.qty - reduceAmount });
      }
    }

    resetCart();
    return transactionId;
  };

  const resetCart = () => {
    items.value = [];
    cashAmount.value = 0;
  };

  return { 
    items, payMethod, cashAmount, 
    totalBelanja, kembalian, 
    addToCart, updateQty, processCheckout, resetCart 
  };
});