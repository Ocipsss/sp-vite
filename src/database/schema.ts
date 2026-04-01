// Daftar semua tabel yang ada di Dexie SinarPagiDB
export const DB_TABLES = [
  'products',
  'product_packages',
  'categories',
  'transactions',
  'members',
  'expenses',
  'digital_transactions',
  'services',
  'settings'
] as const;

// Tipe data untuk nama tabel (untuk type-safety di TypeScript)
export type TableName = typeof DB_TABLES[number];

// Definisi store schema untuk Dexie (versi 19)
export const DEXIE_SCHEMA = {
  products: 'id, name, code, category',
  product_packages: 'id, productId, name',
  categories: '++id, name',
  transactions: 'id, date, total, memberId, status, paymentMethod',
  members: 'id, name, phone',
  expenses: 'id, date, category',
  digital_transactions: 'id, date, type',
  services: '++id, name',
  settings: 'id, storeName'
};



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah cetak biru (Blueprint) Skema Database untuk Dexie.js yang menentukan bagaimana data disimpan di dalam browser pengguna. File ini mengatur struktur tabel, menentukan kolom mana yang menjadi kunci utama (Primary Key), serta kolom mana yang diindeks agar proses pencarian barang atau riwayat transaksi di aplikasi Sinar Pagi POS berjalan sangat cepat. Dengan menggunakan "Type-Safety" dari TypeScript, file ini juga mencegah kesalahan pengetikan nama tabel di seluruh bagian kode program lainnya.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-12: Ekspor konstanta DB_TABLES; daftar lengkap seluruh nama tabel yang ada di database SinarPagiDB (seperti produk, transaksi, member, dan pengeluaran).
// Baris 11: Penggunaan 'as const'; memastikan TypeScript memperlakukan daftar nama tabel ini sebagai nilai tetap (literal) yang tidak bisa diubah.
// Baris 15: Definisi tipe TableName; menciptakan tipe data kustom berbasis isi dari DB_TABLES untuk memberikan saran otomatis (autocomplete) saat menulis kode database di VS Code.
// Baris 18: Ekspor objek DEXIE_SCHEMA; konfigurasi utama untuk versi database (saat ini versi 19) yang mendefinisikan kolom-kolom penting di tiap tabel.
// Baris 19: Tabel products; menggunakan 'id' sebagai kunci utama, serta mengindeks 'name', 'code' (barcode), dan 'category' untuk pencarian cepat.
// Baris 21: Tabel categories; menggunakan '++id' yang berarti ID akan bertambah secara otomatis (auto-increment) setiap ada kategori baru.
// Baris 22: Tabel transactions; mengindeks 'date', 'total', dan 'memberId' untuk mempermudah pemfilteran laporan penjualan harian atau per pelanggan.
// Baris 23: Tabel members; mengindeks 'phone' agar kasir bisa mencari data member hanya dengan memasukkan nomor telepon.
// Baris 24: Tabel expenses; mengindeks 'date' dan 'category' untuk keperluan analisis pengeluaran toko berdasarkan waktu atau jenis biaya.
// Baris 27: Tabel settings; menggunakan 'id' tetap untuk menyimpan konfigurasi aplikasi seperti nama toko atau pengaturan printer struk.