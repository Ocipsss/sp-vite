import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db, generateUID } from '@/database';
import type { CartItem, Product } from '@/types';

// Import Utilities & Constants
import { calculateCartTotal, calculateChange } from '@/utils/calculators';
import { deepCopy } from '@/utils/formatters';
import { TRANSACTION_STATUS } from '@/constants/app';

export const useCartStore = defineStore('cart', () => {
  // --- STATE ---
  const items = ref<CartItem[]>([]);
  const payMethod = ref<'Tunai' | 'QRIS' | 'Tempo' | null>('Tunai');
  const cashAmount = ref<number>(0);
  const isScannerOpen = ref(false);
  const selectedMemberId = ref<string | null>(null);
  const searchQuery = ref<string>("");

  // --- GETTERS ---
  // Logika reduce yang panjang digantikan oleh fungsi utilitas
  const totalBelanja = computed(() => calculateCartTotal(items.value));

  // Logika Math.max digantikan oleh fungsi utilitas
  const kembalian = computed(() => calculateChange(cashAmount.value, totalBelanja.value));

  // --- ACTIONS ---

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
        ...deepCopy(product), // Menggunakan deepCopy dari utils
        cartId,
        qty: 1,
        extraCharge: 0,
        extraChargeQty: 0,
        extraChargeName: '',
        price_sell: isPackage ? (product.pack_price || product.price_sell) : product.price_sell,
        qty_reduce: isPackage ? (product.pack_size || 1) : 1
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
      status: TRANSACTION_STATUS.SUCCESS, // Menggunakan konstanta
      items: deepCopy(items.value) // Menggunakan deepCopy dari utils
    };

    try {
      await db.table('transactions').add(transactionData);

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



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah Pusat Manajemen Keranjang Belanja (Cart Store) menggunakan Pinia untuk aplikasi Sinar Pagi POS. File ini bertindak sebagai "Otak" dari proses transaksi kasir, yang mengelola daftar barang belanjaan, perhitungan total harga secara otomatis, manajemen biaya jasa tambahan (extra charge), hingga proses penyelesaian pembayaran (checkout). Di sini juga diatur logika pengurangan stok barang di database lokal setiap kali transaksi berhasil dilakukan, memastikan data stok tetap akurat secara real-time.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-10: Mengimpor fungsi inti Pinia, reaktivitas Vue, koneksi database, serta berbagai fungsi utilitas eksternal untuk perhitungan matematika dan penyalinan data (deepCopy).
// Baris 12: Mendefinisikan store dengan nama 'cart' yang akan digunakan secara global di seluruh komponen aplikasi.
// Baris 14-19: State (Data); menyimpan daftar barang di keranjang, metode pembayaran (Tunai/QRIS/Tempo), jumlah uang tunai yang diterima, status scanner, ID member yang terpilih, dan teks pencarian.
// Baris 23-26: Getters (Data Terhitung); menghitung total belanja dan jumlah uang kembalian secara otomatis menggunakan fungsi utilitas setiap kali ada perubahan data di keranjang.
// Baris 30-36: Action toggleScanner & clearSearch; fungsi sederhana untuk mengontrol visibilitas pemindai barcode dan menghapus teks pencarian.
// Baris 38-48: Fungsi updateQty; menambah atau mengurangi jumlah barang di keranjang. Jika jumlah mencapai 0 atau kurang, barang akan otomatis dihapus dari daftar.
// Baris 50-70: Logika Biaya Jasa; fungsi untuk menambah, mengubah jumlah, atau menghapus biaya layanan tambahan (seperti jasa giling/seduh) pada item tertentu di keranjang.
// Baris 72-90: Fungsi addToCart; menambahkan produk ke keranjang. Jika produk sudah ada, jumlahnya ditambah; jika belum, data produk disalin (deepCopy) dan dimasukkan sebagai item baru dengan identitas unik (cartId).
// Baris 92: Fungsi processCheckout; jantung dari proses transaksi yang bersifat asinkron (async).
// Baris 93-104: Menghasilkan ID unik transaksi dan menyusun objek data transaksi lengkap untuk disimpan ke riwayat permanen.
// Baris 106-107: Menyimpan data transaksi ke tabel 'transactions' di database lokal (Dexie).
// Baris 109-119: Logika Pengurangan Stok; melakukan looping pada setiap barang yang dibeli, mengambil data stok asli dari database, lalu menguranginya berdasarkan jumlah yang terjual (memperhitungkan satuan grosir/paket jika ada).
// Baris 121-123: Memanggil resetCart untuk mengosongkan keranjang setelah sukses dan mengembalikan ID transaksi untuk keperluan cetak struk.
// Baris 130-136: Fungsi resetCart; mengembalikan seluruh state keranjang ke kondisi awal (kosong/default).
// Baris 138-143: Mengembalikan (return) seluruh state, getter, dan action agar bisa diakses oleh komponen Vue lainnya.