import { ref } from 'vue';
import { db } from '@/database';

export function useProductSearch() {
  const suggestions = ref<any[]>([]);
  const isFocused = ref(false);

  // Fungsi Highlight (Identik dengan script Anda)
  const highlightText = (text: string, query: string) => {
    const search = query.trim();
    if (!search) return text;
    const safeQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    return text.replace(regex, '<span class="text-blue-600 font-black">$1</span>');
  };

  // Logika Pintar Fetch Suggestions (Identik: startsWith -> localeCompare -> slice 8)
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 1) {
      suggestions.value = [];
      return;
    }

    const search = query.toLowerCase().trim();
    
    const allMatches = await db.table('products')
      .filter(p => p.name.toLowerCase().includes(search))
      .toArray();

    suggestions.value = allMatches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    }).slice(0, 8);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
    }).format(val || 0);
  };

  return {
    suggestions,
    isFocused,
    fetchSuggestions,
    highlightText,
    formatRupiah
  };
}



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah sebuah Composable kustom bernama useProductSearch yang berfungsi sebagai mesin logika (logic engine) untuk fitur pencarian produk di aplikasi Sinar Pagi POS. Komposabel ini menangani pengambilan data dari database lokal (Dexie), pengurutan hasil pencarian yang cerdas (mendahulukan kata yang cocok di depan), pemformatan mata uang Rupiah, serta fitur estetika seperti penyorotan teks (highlighting) pada hasil pencarian agar kasir lebih mudah menemukan barang yang dicari secara visual.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Mengimpor fungsi ref untuk reaktivitas data dan instance database (db) untuk melakukan query ke penyimpanan lokal IndexedDB.
// Baris 4: Ekspor fungsi utama useProductSearch sebagai kontainer logika pencarian yang dapat digunakan di berbagai komponen (reusable).
// Baris 5-6: Inisialisasi variabel reaktif suggestions untuk menyimpan daftar hasil pencarian dan isFocused untuk melacak status aktif kolom input.
// Baris 9: Definisi fungsi highlightText; digunakan untuk membungkus bagian kata yang cocok dengan query pencarian ke dalam tag HTML span dengan warna biru.
// Baris 11-13: Logika pembersihan query; jika query kosong maka kembalikan teks asli, serta melakukan "escaping" pada karakter khusus regex agar tidak terjadi error sistem.
// Baris 14-15: Penggunaan Regular Expression (RegExp) untuk mencari kata secara global tanpa mempedulikan huruf besar/kecil (case-insensitive) dan menggantinya dengan gaya teks tebal.
// Baris 19: Definisi fungsi asinkron fetchSuggestions; jantung dari logika pencarian barang di database Sinar Pagi.
// Baris 20-23: Validasi input; jika kotak pencarian kosong atau hanya satu karakter, maka daftar saran langsung dikosongkan untuk menghemat performa.
// Baris 27-29: Melakukan query ke tabel 'products' menggunakan filter IndexedDB untuk mencari semua produk yang namanya mengandung kata kunci pencarian.
// Baris 31-38: Logika Pengurutan Pintar (Sorting); hasil pencarian diurutkan sedemikian rupa sehingga produk yang namanya "Dimulai Dengan" kata kunci akan muncul paling atas.
// Baris 39: Menggunakan .slice(0, 8) untuk membatasi hasil pencarian hanya maksimal 8 item agar tampilan dropdown tetap ringkas dan cepat.
// Baris 42-46: Fungsi formatRupiah; menggunakan API Intl.NumberFormat bawaan browser untuk mengubah angka mentah menjadi format mata uang Rupiah (IDR) yang rapi.
// Baris 48-54: Mengembalikan (return) seluruh variabel dan fungsi agar bisa diimpor dan digunakan oleh komponen UI seperti GlobalSearch.vue.