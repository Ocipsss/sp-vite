// src/utils/formatters.ts

/**
 * Format angka ke Rupiah (Rp 10.000)
 */
export const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(val || 0);
};

/**
 * Format angka saja tanpa Rp (10.000)
 */
export const formatNumber = (val: number): string => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(val || 0);
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
 * Deep copy object/array agar tidak merusak referensi memori asli
 */
export const deepCopy = <T>(data: T): T => JSON.parse(JSON.stringify(data));