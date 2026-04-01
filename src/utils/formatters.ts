export const formatRupiah = (val: number | string): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(Number(val) || 0);
};

export const formatNumber = (val: number | string): string => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(Number(val) || 0);
};

export const parseRawNumber = (text: any): number => {
  if (typeof text !== 'string') return Number(text) || 0;
  return parseInt(text.replace(/\D/g, "")) || 0;
};

export const formatPoints = (val: number | string): string => {
  return (Number(val) || 0).toLocaleString('id-ID') + " Pts";
};

export const formatMemberId = (id: string): string => {
  if (!id) return "-";
  const cleanId = id.toUpperCase().startsWith('SP-') ? id : `SP-${id}`;
  return cleanId.toUpperCase();
};

export const formatPhone = (phone: string): string => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{1,5})$/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  return phone;
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch (e) {
    return "-";
  }
};

export const formatTransactionStatus = (status: string): string => {
  if (!status) return "-";
  const statusMap: Record<string, string> = {
    'lunas': 'LUNAS',
    'hutang': 'PIUTANG',
    'tempo': 'JATUH TEMPO',
    'proses': 'PROSES',
    'batal': 'BATAL'
  };
  return statusMap[status.toLowerCase()] || status.toUpperCase();
};

export const cleanBarcode = (code: string): string => {
  return code ? code.trim().replace(/[^a-zA-Z0-9]/g, "") : "";
};

export const truncateText = (text: string, limit: number = 20): string => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

export const highlightText = (text: string, query: string): string => {
  const search = query.trim();
  if (!search) return text;
  const safeQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return text.replace(regex, '<span class="text-blue-600 font-black">$1</span>');
};

export const deepCopy = <T>(data: T): T => {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
};

export const capitalize = (text: string): string => {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah modul utilitas formatters.ts yang berfungsi sebagai Standarisasi Tampilan Data (UI Formatter) untuk seluruh ekosistem aplikasi Sinar Pagi. Modul ini berperan sebagai "filter" terakhir sebelum data mentah dari database ditampilkan ke pengguna, memastikan konsistensi format mata uang Rupiah, penanggalan Indonesia, hingga validasi input barcode. Dengan memusatkan logika pemformatan di satu file, aplikasi dapat menjaga kerapian antarmuka (UI) dan akurasi data finansial, terutama dalam menangani konversi angka mentah menjadi format ribuan yang mudah dibaca oleh kasir.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-6: Fungsi formatRupiah; mengubah angka atau string menjadi format mata uang resmi Indonesia (Contoh: Rp 15.000) menggunakan Intl.NumberFormat dengan pembulatan nol desimal.
// Baris 8-12: Fungsi formatNumber; menampilkan angka murni dengan pemisah ribuan titik (id-ID) tanpa simbol "Rp", biasanya digunakan untuk kolom stok atau kuantitas barang.
// Baris 14-17: Fungsi parseRawNumber; pembersih input (sanitizer) yang menghapus semua karakter non-angka agar teks dari input field bisa diproses sebagai angka murni (integer).
// Baris 19-21: Fungsi formatPoints; menambahkan satuan "Pts" di akhir angka untuk menampilkan perolehan poin loyalitas member toko secara rapi.
// Baris 23-27: Fungsi formatMemberId; memastikan ID member selalu diawali dengan prefix "SP-" dan dikonversi ke huruf kapital untuk standarisasi kartu anggota.
// Baris 29-35: Fungsi formatPhone; pemformat nomor telepon otomatis menjadi pola grup (08xx-xxxx-xxxx) menggunakan Regular Expression agar lebih mudah dibaca di layar mobile.
// Baris 37-48: Fungsi formatDateTime; mengonversi timestamp database menjadi format tanggal lokal Indonesia yang manusiawi (medium date & short time) dengan proteksi error handling.
// Baris 50-61: Fungsi formatTransactionStatus; pemeta (mapper) status transaksi yang mengubah kode database menjadi label status yang elegan dan mudah dipahami (Contoh: 'hutang' menjadi 'PIUTANG').
// Baris 63-65: Fungsi cleanBarcode; utilitas vital untuk membersihkan input barcode dari spasi atau karakter aneh, mencegah kegagalan pencarian barang saat menggunakan pemindai.
// Baris 67-70: Fungsi truncateText; pemotong teks otomatis (Ellipsis) untuk mencegah nama produk yang terlalu panjang merusak tata letak (layout) daftar barang.
// Baris 72-78: Fungsi highlightText; fitur UX yang membungkus kata kunci pencarian dengan tag HTML span berwarna biru tebal, memudahkan kasir melihat kecocokan produk saat mencari.
// Baris 80-83: Fungsi deepCopy; utilitas untuk menggandakan objek atau array secara sempurna (bukan referensi), mencegah perubahan data asli secara tidak sengaja.
// Baris 85-88: Fungsi capitalize; menormalkan teks menjadi format huruf kapital di setiap awal kata, sangat berguna untuk merapikan nama kategori atau nama pelanggan.