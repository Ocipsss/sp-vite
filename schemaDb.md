# 1. Modul Master Data (Katalog & Referensi)
Ini adalah data "dasar" atau pondasi. Tabel di sini jarang berubah, kecuali ada penambahan produk atau perubahan harga dari Anda sendiri.

# produk:
- id : string | Primary Key (saran: gunakan UUID atau ID dari Firestore).
- kode_produk : String | Kode unik/Barcode (SKU). Digunakan untuk scan barcode.
- nama_produk : String | Nama lengkap barang (Contoh: Kopi Kapal Api 20gr).
- tipe_produk : String: ('fisik' atau 'digital') | berguna agar sistem tahu produk mana yang harus memotong stok dan mana yang tidak (seperti jasa).
- id_kategori : String | Menghubungkan ke tabel kategori (misal: Minuman).
- merk : String | Nama brand barang tersebut.
- gambar : String | URL atau path foto produk (opsional).
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# satuan_produk:
- id : String | ID unik untuk baris ini.
- id_produk : String | Menghubungkan ke tabel produk.
- nama_satuan : String | Contoh: 'Dus', 'Pak', 'Pcs'.
- faktor_konversi : Number | Jumlah isi dalam satuan ini (misal: 1 Dus isi 24).
- harga_beli : number | Harga Modal dalam satuan pcs (selalu konversi ke satuan terkecil/pcs)
- harga_jual : number | Harga khusus untuk satuan ini.
- harga_member : number | Harga khusus untuk Member. (OPSIONAL)
- satuan_dasar : Boolean | Tandai true jika ini adalah satuan terkecil (eceran).
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# kategori:
- id : String | Primary Key (misal: makanan, obat, atk).
- nama_kategori : String | Nama yang muncul di layar (Contoh: Kebutuhan Pokok).
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# metode_pembayaran:
- id : String | Primary Key (Contoh: 'TUNAI', 'QRIS', 'TEMPO').
- nama_metode : String | Nama yang muncul di tombol kasir (Contoh: 'TUNAI', 'QRIS', 'TEMPO').
- kode_akun : String | akan sangat membantu jika nanti kamu ingin melakukan pembukuan (akuntansi) yang lebih rapi (misal: masuk ke Kas Tunai atau Bank BCA).
- biaya_tambahan : number | Jika ada biaya admin tambahan untuk metode ini (misal: mesin EDC +1%). (OPSIONAL)
- status_aktif : Boolean | Untuk mengaktifkan atau mematikan metode bayar tertentu.
- kategori_metode : String | Pengelompokan (Contoh: 'Cash', 'Digital', 'Piutang').
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# pengguna: (OPSIONAL) | Password: Untuk tabel pengguna, pastikan Anda menggunakan library seperti bcryptjs atau argon2 untuk hashing sebelum disimpan ke IndexedDB (meskipun ini perangkat pribadi, tetaplah menjaga standar keamanan).

- id : String | Primary Key (ID unik pengguna).
- nama_pengguna : String | Username untuk login.
- nama_lengkap : String | Nama asli staf/kasir.
- kata_sandi : String | Password (disimpan dalam bentuk hash/terenkripsi).
- peran : String | Tingkatan akses (Contoh: 'Admin', 'Kasir').
- status_aktif : Boolean | Menentukan apakah user tersebut masih boleh login.
- dibuat_pada : number | Tanggal akun kasir dibuat.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# pengaturan_toko:
- id : String | Biasanya cuma satu baris (id: 'config').
- nama_toko : String | Sinar Pagi.
- alamat_toko : String | Alamat lengkap.
- pesan_struk : String | Pesan penutup di struk.
- logo_toko : String | URL/Base64 logo jika ingin pakai gambar.
- device_address_printer : string | Menyimpan ID/Alamat Bluetooth printer terakhir yang terhubung.
- lebar_kertas : number | 58 atau 80 (untuk menyesuaikan layout struk).
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.


# 2. Modul Operasional & Stok
Modul ini berfungsi untuk mengelola ketersediaan barang di gudang dan rak toko.

# stok:
- id : String | Primary Key.
- id_produk : String | Referensi ke tabel produk.
- id_satuan : String | Menghubungkan ke tabel satuan_produk (menjelaskan apakah stok yang diinput dalam hitungan Pcs, Dus, atau Pak).
- satuan_dasar : String | menyimpan jumlah dalam satuan terkecil (satuan_dasar).
- jumlah : number | Total stok yang tersedia.
- tanggal_kadaluarsa : number | Jika barang memiliki masa berlaku. (OPSIONAL)
- lokasi_rak : String | Contoh: "Rak A1" atau "Gudang Depan". (OPSIONAL)
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# agen:
- id : String | Primary Key (ID unik agen).
- nama_agen : String | Nama toko atau nama sales (Contoh: 'Agen Sembako H. Mamat').
- nomor_telepon : String | Nomor kontak untuk memesan barang.
- alamat : string | Lokasi agen tersebut.
- keterangan : String | Catatan (misal: 'Bisa antar barang', 'Hanya terima tunai').
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# harga_agen:
- id : String | Primary Key.
- id_agen : String | Referensi ke tabel agen.
- id_produk : String | Referensi ke tabel produk.
- id_satuan : String | Referensi ke tabel satuan_produk (misal: Harga per 'Dus').
- harga_beli : number | Harga modal yang ditawarkan agen tersebut.
- terakhir_update : number | Tanggal terakhir harga ini diperbarui.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.


# 3. Modul Penjualan & Layanan (Transaksi)

# transaksi:
- id : String | Primary Key (ID unik transaksi).
- id_member : String | Jika pembeli adalah member, kolom ini diisi. Jika pembeli umum (non-member), kolom ini dibiarkan kosong (null). (OPSIONAL)
- nomor_struk : String | Nomor nota (Contoh: POS-202310-0001).
- total_harga : number | Total belanja setelah diskon/pajak.
- total_laba : Number | Menghitung laba secara *real-time* saat transaksi selesai dan menyimpannya di tabel transaksi akan membuat laporan bulananmu menjadi **100x lebih cepat** daripada harus menghitung ulang dari tabel `transaksi_detail` setiap saat.
- metode_pembayaran : String | "Contoh: 'Tunai', 'QRIS', 'Tempo'.
- status_sinkronisasi : Boolean | "true jika sudah terkirim ke cloud, false jika masih di lokal.
- id_kasir : String | Menghubungkan ke tabel user/kasir yang bertugas.
- dibuat_pada : number | Tanggal dan waktu transaksi terjadi.
- total_bayar : number | Nominal uang yang diterima dari pelanggan (misal: bayar dengan uang Rp50.000).
- kembalian : number | Selisih antara total_bayar dengan total_harga yang dikembalikan ke pelanggan.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# transaksi_detail:
- id : String | Primary Key.
- id_transaksi : String | Menghubungkan ke tabel transaksi.
- id_produk : String | Produk apa yang dibeli.
- nama_satuan : String | Satuan yang dipilih saat beli (Pcs/Dus).
- jumlah : Number | Berapa banyak yang dibeli.
- harga_beli_saat_ini : number | Pastikan diisi dengan harga beli per item saat itu. Ini krusial agar laporan laba rugi Anda tetap akurat meskipun bulan depan harga dari agen naik.
- harga_jual_saat_ini : number | Harga barang saat transaksi (penting jika besok harga naik).
- id_layanan_tambahan : String | (Nullable) Menghubungkan ke tabel layanan_tambahan.
- biaya_layanan_saat_ini : number | 
- catatan_khusus : String | Contoh: "Mie mateng banget" atau "Kopi tanpa gula".
- subtotal : number | Total: (Jumlah x Harga Barang) + Biaya Tambahan.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# layanan_digital:
- id : String | Primary Key.
- nama_layanan : String | Contoh: 'Topup DANA', 'PLN Prabayar', 'Tarik Tunai'.'Setor Tunai'.
- biaya_admin : number | Biaya jasa yang dikenakan ke pelanggan (keuntungan Anda).
- id_kategori : String | Referensi ke tabel kategori (misal kategori: 'Jasa Layanan Digital').
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# transaksi_layanan_digital:
- id : String | Primary Key.
- id_layanan_digital : String | Referensi ke tabel layanan_digital.
- nomor_tujuan : String | Nomor HP, ID Pelanggan, atau Nomor Rekening.
- nominal_transaksi : number | Jumlah uang yang ditarik/disetor/topup (di luar admin).
- biaya_admin_saat_ini : number | Biaya admin saat transaksi dilakukan.
- total_bayar : number | Hasil dari (nominal_transaksi + biaya_admin_saat_ini).
- metode_pembayaran : String | Supaya Anda tahu uang hasil top-up itu masuk ke laci kasir (Tunai) atau masuk ke saldo bank Anda (QRIS).
- id_member : String | Referensi ke tabel member (opsional).
- id_kasir : String | Referensi ke tabel pengguna.
- status_transaksi : String | 'Berhasil', 'Gagal', 'Pending'.
- dibuat_pada : number | Waktu transaksi.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# layanan_tambahan:
- id : String | Primary Key (Contoh: 'masak', 'seduh').
- nama_layanan : String | Nama jasa (Contoh: 'Jasa Masak Mie', 'Seduh Air Panas').
- biaya_tambahan : number | Harga jasanya (Contoh: Rp2.000 untuk masak).
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# kategori_layanan:
- id : String | Primary Key.
- id_kategori : String | Referensi ke tabel kategori.
- id_layanan_tambahan : String | Referensi ke tabel layanan_tambahan.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.


# 4. Modul Pelanggan & Keuangan (CRM & Piutang)

# member:
- id : String | Primary Key (ID unik member).
- kode_member : String | Kode unik kartu member atau nomor HP (untuk pencarian cepat).
- nama_pelanggan : String | Nama lengkap member.
- nomor_telepon : String | Untuk keperluan kontak atau pengiriman struk digital.
- alamat : string | Alamat tempat tinggal member. (OPSIONAL)
- total_poin : Number | Akumulasi poin yang bisa ditukar dengan hadiah/diskon.
- tanggal_registrasi : number | Tanggal saat member pertama kali mendaftar.
- status_aktif : Boolean | Untuk mematikan member jika sudah tidak berlangganan.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# hutang:
- id : String | Primary Key.
- id_member : String | Referensi ke tabel member (Siapa yang berhutang).
- id_transaksi : String | Referensi ke tabel transaksi (Dari belanjaan yang mana).
- total_hutang : number | Jumlah total hutang awal dari transaksi tersebut.
- sisa_hutang : number | Jumlah yang masih harus dibayar (berkurang jika dicicil).
- tanggal_jatuh_tempo : number | Tanggal batas akhir pembayaran (opsional).
- status_lunas : Boolean | true jika sudah bayar semua, false jika masih ada sisa.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# pembayaran_hutang:
- id : String | Primary Key.
- id_hutang : String | Referensi ke tabel hutang.
- jumlah_bayar : number | Nominal uang yang dibayarkan saat mencicil.
- metode_pembayaran_hutang : Number | (misal: bayar hutang lewat transfer atau tunai).
- tanggal_bayar : number | Waktu saat cicilan diterima.
- id_kasir : String | Kasir yang menerima uang cicilan.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.


# 5. Modul Audit & Pelaporan

# log_aktivitas:
- id : String | Primary Key.
- id_pengguna : String | Siapa yang melakukan aksi tersebut (Referensi ke tabel pengguna).
- aksi : String | Jenis tindakan (Contoh: 'HAPUS_TRANSAKSI', 'UBAH_STOK', 'LOGIN').
- tabel_terkait : String | Nama tabel yang dimodifikasi (Contoh: 'transaksi', 'stok').
- id_data_terkait : String | ID dari baris data yang diubah (misal ID transaksi yang dihapus).
- data_sebelumnya : JSON | Nilai data sebelum diubah (penting untuk pembuktian).
- data_sesudah : JSON | Nilai data setelah diubah.
- perangkat : String | Info perangkat (Contoh: 'Tablet-Kasir-01').
- dibuat_pada : number | Waktu persis kejadian.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.

# ringkasan_bulanan:
- id : String | Primary Key (Contoh: '2026-04').
- total_omzet : number | Total penjualan kotor bulan itu.
- total_laba : number | Total keuntungan bersih bulan itu.
- total_pengeluaran : number | Jika Anda mencatat biaya listrik/gaji karyawan.
- updated_at : number/timestamp | Untuk mengetahui data mana yang paling baru jika terjadi konflik antara HP dan Cloud.
- is_deleted : boolean | Jangan pernah benar-benar menghapus data (`hard delete`) di sistem sinkronisasi. Cukup tandai `true`. Jika kamu hapus permanen di HP, Firestore tidak akan tahu bahwa data itu harus dihapus juga di Cloud.




# ##### INDEXING # #####
Nama Tabel : produk
Kolom Index (Dexie Format) : "++id, &kode_produk, nama_produk, id_kategori" || Gunakan simbol & pada kode_produk (Unique Index). Ini memastikan tidak ada dua barang dengan barcode yang sama.
Alasan & Fungsi : Scan barcode super cepat dan validasi input barang baru.

Nama Tabel : satuan_produk
Kolom Index (Dexie Format) : "++id, id_produk"
Alasan & Fungsi : Mengambil semua jenis satuan (Pcs/Dus) milik satu produk tertentu.

Nama Tabel : kategori
Kolom Index (Dexie Format) : "++id, &nama_kategori" || Gunakan & agar tidak ada kategori ganda (misal: "Minuman" dan "minuman").
Alasan & Fungsi : Menampilkan daftar barang per kategori.

Nama Tabel : stok
Kolom Index (Dexie Format) : "++id, id_produk, tanggal_kadaluarsa, [id_produk+tanggal_kadaluarsa]" || Sangat penting jika satu produk punya beberapa batch kadaluarsa berbeda. Query akan jauh lebih cepat saat menghitung total stok barang A yang belum basi.
Alasan & Fungsi : Cek stok barang tertentu dan peringatan barang hampir basi.

Nama Tabel : transaksi
Kolom Index (Dexie Format) : "++id, nomor_struk, dibuat_pada, id_member, status_sinkronisasi" || WAJIB tambah status_sinkronisasi (0 atau 1). || Karena aplikasimu offline-first, Dexie perlu mencari dengan cepat mana transaksi yang belum terkirim ke Firebase Firestore. Tanpa index ini, proses sinkronisasi akan berat.
Alasan & Fungsi : "Cari nota, laporan harian (dibuat_pada), dan riwayat belanja member."

Nama Tabel : transaksi_detail
Kolom Index (Dexie Format) : "++id, id_transaksi, id_produk"
Alasan & Fungsi : Menampilkan rincian barang di dalam sebuah struk.

Nama Tabel : member
Kolom Index (Dexie Format) : "++id, &kode_member, nama_pelanggan, nomor_telepon"
Alasan & Fungsi : Cari member via kartu atau nomor HP saat transaksi.

Nama Tabel : hutang
Kolom Index (Dexie Format) : "++id, id_member, status_lunas, jatuh_tempo" || Penting untuk fitur "Peringatan Hutang" yang akan muncul di dashboard saat ada bon yang sudah lewat tanggalnya.
Alasan & Fungsi : Memfilter siapa saja pelanggan yang belum bayar bon.

Nama Tabel : layanan_digital
Kolom Index (Dexie Format) : "++id, nama_layanan, kategori_layanan" || Tambahkan kategori_layanan (Pulsa, PLN, e-Wallet). || Mengelompokkan menu agar kasir tidak bingung mencari produk digital.
Alasan & Fungsi : Menampilkan pilihan menu top-up/jasa digital.

Nama Tabel : transaksi_layanan_digital
Kolom Index (Dexie Format) : "++id, dibuat_pada, status_transaksi, nomor_tujuan" || Tambahkan nomor_tujuan. || Memudahkan jika ada pelanggan komplain "Pulsa saya belum masuk", kasir bisa cari berdasarkan nomor HP pelanggan tersebut.
Alasan & Fungsi : Laporan harian jasa digital dan cek status transaksi pending.

Nama Tabel : agen
Kolom Index (Dexie Format) : "++id, nama_agen"
Alasan & Fungsi : Mempermudah pencarian saat mau kulakan.

Nama Tabel : harga_agen
Kolom Index (Dexie Format) : "++id, id_produk, id_agen, [id_produk+id_agen]" || Tambahkan Compound Index [id_produk+id_agen]. || Agar tidak ada input harga ganda untuk produk yang sama dari agen yang sama.
Alasan & Fungsi : Bandingkan harga modal produk dari berbagai agen.

Nama Tabel : log_aktivitas
Kolom Index (Dexie Format) : "++id, dibuat_pada, aksi, id_pengguna" || Tambahkan id_pengguna || Penting untuk audit. Kamu bisa memfilter "Apa saja yang dilakukan oleh Kasir A hari ini?".
Alasan & Fungsi : Melacak siapa melakukan apa pada jam berapa.






# ##### TECH STACK ##### #

## I. Core Infrastructure (Pondasi Utama) ##

Kebutuhan : Framework UI
Teknologi : Vue 3 (Vite 7)
Fitur Wajib : Composition API & SFC: Menggunakan script setup untuk kode yang lebih modular. Teleport & Suspense: Untuk menangani komponen global seperti Modal atau Async loading.

Kebutuhan : Build Tools
Teknologi : Vite 7
Fitur Wajib : Hot Module Replacement (HMR): Update kode instan saat development. Optimized Rollup Build: Membagi kode (splitting) agar ukuran file yang di-download user lebih kecil.

Kebutuhan : Static Typing & Maintainability
Teknologi : TypeScript
Fitur Wajib : Strict Mode: Mencegah variabel bernilai undefined/null. Interface & Types: Definisi data produk dan transaksi yang konsisten di seluruh aplikasi.

Kebutuhan : Routing & Navigation
Teknologi : Vue Router 4
Fitur Wajib : Lazy Loading Routes: Halaman hanya di-load saat dibuka. Navigation Guards: Melindungi halaman rahasia agar tidak bisa diakses user tanpa izin.

Kebutuhan : State Management
Teknologi : Pinia
Fitur Wajib : Persisted State: Keranjang belanja tidak hilang meski halaman di-refresh. Action Subscriptions: Memantau setiap perubahan stok secara global.

---

## II. Data & Storage Layer (Offline-First) ##

Kebutuhan : Database Lokal
Teknologi : Dexie.js (IndexedDB Wrapper)
Fitur Wajib : Schema Versioning: Migrasi tabel tanpa hapus data lama. LiveQuery: UI otomatis update saat database lokal berubah. Backup/Restore: Ekspor data ke .json untuk cadangan manual pemilik toko.

Kebutuhan : Database Cloud
Teknologi : Firebase Firestore
Fitur Wajib : Offline Persistence: SDK otomatis simpan data saat offline dan kirim saat online. Real-time Listeners: Sinkronisasi stok barang antar perangkat kasir secara instan.

Kebutuhan : Cloud Storage (Penyimpanan Gambar)
Teknologi : Firebase Storage
Fitur Wajib : Image Hosting: Simpan foto produk secara cloud dengan URL yang aman. Caching Headers: Memastikan gambar tidak di-download berulang kali untuk menghemat kuota.

Kebutuhan : Client-side Image Compression
Teknologi : browser-image-compression
Fitur Wajib : Auto-Resize: Mengecilkan foto HP (5MB+) menjadi (<200KB) secara otomatis. Aspect Ratio Maintainer: Menjaga foto produk tetap proporsional (tidak penyet).

---

## III. UI/UX & Styling ##

Kebutuhan : CSS / Styling
Teknologi : Tailwind CSS 4
Fitur Wajib : JIT Engine: Kompilasi gaya CSS super cepat sesuai kebutuhan. Responsivitas: Menjamin tampilan rapi di layar HP, Tablet, hingga Monitor Kasir.

Kebutuhan : Accessible UI
Teknologi : Radix Vue
Fitur Wajib : Keyboard Navigation: Operasi kasir bisa menggunakan tombol keyboard (Enter, Tab, Esc). Focus Management: Fokus otomatis ke kolom input saat modal/dialog terbuka.

Kebutuhan : Icons
Teknologi : Lucide Vue
Fitur Wajib : Tree Shaking: Hanya memuat icon yang digunakan agar file tetap ringan. Visual Consistency: Set icon yang bersih dan seragam untuk seluruh menu aplikasi.

Kebutuhan : User Feedback & Progress Bar
Teknologi : nprogress & Vue-Sonner
Fitur Wajib : Progress Bar: Indikator loading halus di bagian atas layar. Stacked Toasts: Notifikasi transaksi sukses yang cantik dan tidak saling bertumpuk.

---

## IV. Hardware & Features ##

Kebutuhan : Barcode Scanner
Teknologi : html5-qrcode
Fitur Wajib : Camera Selection: Fitur memilih kamera belakang atau depan. Torch Control: Kontrol senter untuk scan di area toko yang minim cahaya.

Kebutuhan : Printer System
Teknologi : esc-pos-encoder & Canvas
Fitur Wajib : Template Struk: Layout struk belanja yang profesional (Header, Item, Total). Logo Printing: Mengolah gambar logo menjadi format hitam-putih untuk printer termal.

Kebutuhan : Composition Utilities
Teknologi : VueUse
Fitur Wajib : useDebounceFn: Mencegah double-input saat scan barcode. useOnline: Deteksi status internet secara reaktif untuk peringatan mode offline.

Kebutuhan : PWA (Progressive Web App)
Teknologi : vite-plugin-pwa
Fitur Wajib : Service Worker: Aplikasi tetap bisa dibuka tanpa koneksi internet. Prompt Install: Logika untuk memicu tombol "Install Ke Layar Utama" di perangkat user.

---

## V. Security, Testing & Monitoring ##

Kebutuhan : Auth System
Teknologi : Firebase Auth
Fitur Wajib : Login Persistence: User tetap masuk tanpa perlu login ulang setiap saat. Role-based Access: Membatasi hak akses antara Owner (Laporan) dan Kasir (Penjualan).

Kebutuhan : Form Validation
Teknologi : Vee-Validate & Zod
Fitur Wajib : Real-time Validation: Pesan error muncul seketika saat salah input. Schema Validation: Memastikan tipe data (angka/teks) benar sebelum masuk ke database.

Kebutuhan : Security & Protection
Teknologi : DOMPurify & Route Guards
Fitur Wajib : XSS Protection: Membersihkan input berbahaya dari kolom form. Access Control: Menutup akses halaman Admin dari user yang tidak berwenang.

Kebutuhan : Error Tracking & Monitoring
Teknologi : Sentry (SDK for Vue)
Fitur Wajib : Real-time Reporting: Laporan otomatis jika aplikasi crash di HP user. Breadcrumbs: Melacak aktivitas terakhir user sebelum terjadi error.

Kebutuhan : Logic Testing (QA)
Teknologi : Vitest
Fitur Wajib : Unit Testing: Menguji otomatis rumus matematika pada kasir dan stok. Fast Watch Mode: Menjalankan tes secara instan setiap kali ada perubahan kode.

---

## VI. Data Handling & Tooling ##

Kebutuhan : Data Formatting
Teknologi : Day.js & Intl
Fitur Wajib : IDR Currency: Format otomatis angka ke Rupiah. Relative Time: Menampilkan waktu transaksi seperti "5 menit yang lalu".

Kebutuhan : Export Data (Laporan)
Teknologi : XLSX (SheetJS)
Fitur Wajib : Excel Export: Mengubah data penjualan menjadi file .xlsx tanpa backend. Auto-column Width: Menyesuaikan lebar kolom Excel secara otomatis agar rapi.

Kebutuhan : API Handling (HTTP Client)
Teknologi : Axios
Fitur Wajib : Interceptors: Otomatis menyisipkan token keamanan di setiap request. Timeout Handling: Membatalkan proses jika koneksi server terlalu lambat.

Kebutuhan : Development Tooling
Teknologi : vite-plugin-vue-devtools
Fitur Wajib : State Inspector: Memantau isi database dan Pinia secara visual. Performance Timeline: Menganalisa kecepatan render setiap komponen.

