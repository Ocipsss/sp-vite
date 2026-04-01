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
  if (type === 'topup') return nominal + adminFee; // Pelanggan kasih uang + biaya admin
  return adminFee - nominal; // Kita kasih uang ke pelanggan, tapi ambil biaya admin
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



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah modul mesin hitung pusat (Core Calculator Engine) yang mengatur seluruh logika matematika bisnis, inventaris, dan finansial untuk aplikasi Sinar Pagi POS. Modul ini berfungsi sebagai "otak" di balik layar yang memastikan setiap transaksi akurat—mulai dari perhitungan kembalian, pembagian harga modal per biji (Unit Price Splitter), hingga penentuan harga grosir otomatis berdasarkan kuantitas beli. Dengan memisahkan logika kalkulasi ke dalam file ini, aplikasi dapat menjamin integritas data keuangan dan mempermudah audit laba rugi (profit/loss) serta valuasi aset stok secara real-time.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1: Impor tipe data (Types); mengambil kontrak data CartItem dan WholesaleConfig untuk memastikan konsistensi variabel yang digunakan dalam perhitungan.
// Baris 3-9: Fungsi calculateCartTotal; menghitung total nilai belanja dalam keranjang, termasuk akumulasi biaya jasa atau biaya tambahan (extra charge) per item secara reaktif.
// Baris 11-13: Fungsi calculateChange; menghitung uang kembalian pelanggan dengan validasi angka minimum 0 agar tidak terjadi nilai minus jika uang tunai kurang.
// Baris 15-17: Fungsi calculateMemberPoints; logika loyalitas pelanggan yang memberikan 1 poin untuk setiap kelipatan belanja tertentu (default Rp 10.000).
// Baris 19-21: Fungsi calculateStockReduction; menghitung jumlah stok fisik yang harus berkurang dari gudang, mendukung penjualan satuan maupun paket/grosir.
// Baris 23-26: Fungsi calculateUnitPrice; fitur "Unit Price Splitter" yang membagi harga modal paket besar (dus/pak) dengan isi di dalamnya untuk mendapatkan harga modal per pcs secara otomatis.
// Baris 28-35: Fungsi determinePrice; mesin penentu harga otomatis yang mengevaluasi kuantitas belanja terhadap konfigurasi grosir untuk memberikan harga terbaik bagi pelanggan.
// Baris 37-44: Fungsi calculateGrossProfit; menghitung laba kotor secara instan dengan menjumlahkan selisih harga jual dan harga modal dari seluruh item yang laku.
// Baris 46-48: Fungsi calculateNetProfit; menghitung keuntungan bersih final setelah laba kotor dikurangi dengan pengeluaran operasional (biaya listrik, gaji, dll).
// Baris 50-52: Fungsi calculateNetBalance; menghitung arus kas bersih (net cash flow) berdasarkan total uang masuk dan uang keluar yang tercatat di sistem.
// Baris 54-58: Fungsi calculateAssetValue; menghitung total nilai kekayaan toko yang saat ini mengendap dalam bentuk stok barang berdasarkan harga modal terakhir.
// Baris 60-63: Fungsi calculateDigitalPhysicalCash; logika khusus layanan PPOB untuk menghitung selisih kas fisik di laci saat melakukan transaksi top-up atau tarik tunai.
// Baris 65-68: Fungsi calculateRemainingDebt; menghitung sisa piutang pelanggan pada transaksi tempo untuk memastikan penagihan yang akurat.
// Baris 70-75: Fungsi calculateMarginPercentage; menghitung persentase keuntungan (mark-up) produk dalam format string untuk membantu pemilik toko menganalisa performa margin barang.