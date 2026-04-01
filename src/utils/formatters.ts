/**
 * formatters.ts
 * Standarisasi tampilan data untuk UI Sinar Pagi
 */

/**
 * 1. FORMATTER MATA UANG & ANGKA
 */

// Menampilkan angka dalam format Rupiah (Contoh: Rp 15.000)
export const formatRupiah = (val: number | string): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(Number(val) || 0);
};

// Menampilkan angka saja tanpa Rp (Contoh: 10.000)
export const formatNumber = (val: number | string): string => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(Number(val) || 0);
};

// Membersihkan input teks dari karakter non-angka (Helper Input Harga)
export const parseRawNumber = (text: any): number => {
  if (typeof text !== 'string') return Number(text) || 0;
  return parseInt(text.replace(/\D/g, "")) || 0;
};

/**
 * 2. FORMATTER DATA MEMBER & KONTAK
 */

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

/**
 * 3. FORMATTER TANGGAL & STATUS
 */

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

/**
 * 4. UTILITY & UI HELPERS (TAMBAHAN PENTING)
 */

/**
 * Membersihkan spasi berlebih dan karakter aneh pada Barcode
 * (Sangat penting agar scanner tidak salah baca)
 */
export const cleanBarcode = (code: string): string => {
  return code ? code.trim().replace(/[^a-zA-Z0-9]/g, "") : "";
};

/**
 * Mempersingkat teks yang terlalu panjang (Truncate)
 * Cocok untuk nama produk di grid/list agar tidak berantakan
 */
export const truncateText = (text: string, limit: number = 20): string => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

/**
 * Memberi warna highlight pada teks yang dicari
 */
export const highlightText = (text: string, query: string): string => {
  const search = query.trim();
  if (!search) return text;
  const safeQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return text.replace(regex, '<span class="text-blue-600 font-black">$1</span>');
};

/**
 * Deep copy object/array
 */
export const deepCopy = <T>(data: T): T => {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
};

// Capitalize Word
export const capitalize = (text: string): string => {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};