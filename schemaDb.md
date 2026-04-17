# 1. Modul Master Data (Katalog & Referensi)
Ini adalah data "dasar" atau pondasi. Tabel di sini jarang berubah, kecuali ada penambahan produk atau perubahan harga dari Anda sendiri.

# produk:
- id : string | Primary Key (saran: gunakan UUID atau ID dari Firestore).
- kode_produk : String | Kode unik/Barcode (SKU). Digunakan untuk scan barcode.
- nama_produk : String | Nama lengkap barang (Contoh: Kopi Kapal Api 20gr).
- id_kategori : String | Menghubungkan ke tabel kategori (misal: Minuman).
- merk : String | Nama brand barang tersebut.
- gambar : String | URL atau path foto produk (opsional).

# satuan_produk:
- id : String | ID unik untuk baris ini.
- id_produk : String | Menghubungkan ke tabel produk.
- nama_satuan : String | Contoh: 'Dus', 'Pak', 'Pcs'.
- faktor_konversi : Number | Jumlah isi dalam satuan ini (misal: 1 Dus isi 24).
- harga_beli : Decimal | Harga Modal dalam satuan pcs (selalu konversi ke satuan terkecil/pcs)
- harga_jual : Decimal | Harga khusus untuk satuan ini.
- harga_member : Decimal | Harga khusus untuk Member. (OPSIONAL)
- satuan_dasar : Boolean | Tandai true jika ini adalah satuan terkecil (eceran).

# kategori:
- id : String | Primary Key (misal: makanan, obat, atk).
- nama_kategori : String | Nama yang muncul di layar (Contoh: Kebutuhan Pokok).

# metode_pembayaran:
- id : String | Primary Key (Contoh: 'TUNAI', 'QRIS', 'TEMPO').
- nama_metode : String | Nama yang muncul di tombol kasir (Contoh: 'TUNAI', 'QRIS', 'TEMPO').
- biaya_tambahan : Decimal | Jika ada biaya admin tambahan untuk metode ini (misal: mesin EDC +1%). (OPSIONAL)
- status_aktif : Boolean | Untuk mengaktifkan atau mematikan metode bayar tertentu.
- kategori_metode : String | Pengelompokan (Contoh: 'Cash', 'Digital', 'Piutang').

# pengguna: (OPSIONAL)
- id : String | Primary Key (ID unik pengguna).
- nama_pengguna : String | Username untuk login.
- nama_lengkap : String | Nama asli staf/kasir.
- kata_sandi : String | Password (disimpan dalam bentuk hash/terenkripsi).
- peran : String | Tingkatan akses (Contoh: 'Admin', 'Kasir').
- status_aktif : Boolean | Menentukan apakah user tersebut masih boleh login.
- dibuat_pada : Timestamp | Tanggal akun kasir dibuat.


# 2. Modul Operasional & Stok
Modul ini berfungsi untuk mengelola ketersediaan barang di gudang dan rak toko.

# stok:
- id : String | Primary Key.
- id_produk : String | Referensi ke tabel produk.
- id_satuan : String | Menghubungkan ke tabel satuan_produk (menjelaskan apakah stok yang diinput dalam hitungan Pcs, Dus, atau Pak).
- jumlah : Decimal | Total stok yang tersedia.
- tanggal_kadaluarsa : Timestamp | Jika barang memiliki masa berlaku. (OPSIONAL)
- lokasi_rak : String | Contoh: "Rak A1" atau "Gudang Depan". (OPSIONAL)

# agen:
- id : String | Primary Key (ID unik agen).
- nama_agen : String | Nama toko atau nama sales (Contoh: 'Agen Sembako H. Mamat').
- nomor_telepon : String | Nomor kontak untuk memesan barang.
- alamat : Text | Lokasi agen tersebut.
- keterangan : String | Catatan (misal: 'Bisa antar barang', 'Hanya terima tunai').

# harga_agen:
- id : String | Primary Key.
- id_agen : String | Referensi ke tabel agen.
- id_produk : String | Referensi ke tabel produk.
- id_satuan : String | Referensi ke tabel satuan_produk (misal: Harga per 'Dus').
- harga_beli : Decimal | Harga modal yang ditawarkan agen tersebut.
- terakhir_update : Timestamp | Tanggal terakhir harga ini diperbarui.


# 3. Modul Penjualan & Layanan (Transaksi)

# transaksi:
- id : String | Primary Key (ID unik transaksi).
- id_member : String | Jika pembeli adalah member, kolom ini diisi. Jika pembeli umum (non-member), kolom ini dibiarkan kosong (null). (OPSIONAL)
- nomor_struk : String | Nomor nota (Contoh: POS-202310-0001).
- total_harga : Decimal | Total belanja setelah diskon/pajak.
- metode_pembayaran : String | "Contoh: 'Tunai', 'QRIS', 'Tempo'.
- status_sinkronisasi : Boolean | "true jika sudah terkirim ke cloud, false jika masih di lokal.
- id_kasir : String | Menghubungkan ke tabel user/kasir yang bertugas.
- dibuat_pada : Timestamp | Tanggal dan waktu transaksi terjadi.
- total_bayar : Decimal | Nominal uang yang diterima dari pelanggan (misal: bayar dengan uang Rp50.000).
- kembalian : Decimal | Selisih antara total_bayar dengan total_harga yang dikembalikan ke pelanggan.

# transaksi_detail:
- id : String | Primary Key.
- id_transaksi : String | Menghubungkan ke tabel transaksi.
- id_produk : String | Produk apa yang dibeli.
- nama_satuan : String | Satuan yang dipilih saat beli (Pcs/Dus).
- jumlah : Number | Berapa banyak yang dibeli.
- harga_beli_saat_ini : Decimal | Pastikan diisi dengan harga beli per item saat itu. Ini krusial agar laporan laba rugi Anda tetap akurat meskipun bulan depan harga dari agen naik.
- harga_jual_saat_ini : Decimal | Harga barang saat transaksi (penting jika besok harga naik).
- id_layanan_tambahan : String | (Nullable) Menghubungkan ke tabel layanan_tambahan.
- biaya_layanan_saat_ini : Decimal | 
- catatan_khusus : String | Contoh: "Mie mateng banget" atau "Kopi tanpa gula".
- subtotal : Decimal | Total: (Jumlah x Harga Barang) + Biaya Tambahan.

# layanan_digital:
- id : String | Primary Key.
- nama_layanan : String | Contoh: 'Topup DANA', 'PLN Prabayar', 'Tarik Tunai'.'Setor Tunai'.
- biaya_admin : Decimal | Biaya jasa yang dikenakan ke pelanggan (keuntungan Anda).
- id_kategori : String | Referensi ke tabel kategori (misal kategori: 'Jasa Layanan Digital').

# transaksi_layanan_digital:
- id : String | Primary Key.
- id_layanan_digital : String | Referensi ke tabel layanan_digital.
- nomor_tujuan : String | Nomor HP, ID Pelanggan, atau Nomor Rekening.
- nominal_transaksi : Decimal | Jumlah uang yang ditarik/disetor/topup (di luar admin).
- biaya_admin_saat_ini : Decimal | Biaya admin saat transaksi dilakukan.
- total_bayar : Decimal | Hasil dari (nominal_transaksi + biaya_admin_saat_ini).
- metode_pembayaran : String | Supaya Anda tahu uang hasil top-up itu masuk ke laci kasir (Tunai) atau masuk ke saldo bank Anda (QRIS).
- id_member : String | Referensi ke tabel member (opsional).
- id_kasir : String | Referensi ke tabel pengguna.
- status_transaksi : String | 'Berhasil', 'Gagal', 'Pending'.
- dibuat_pada : Timestamp | Waktu transaksi.

# layanan_tambahan:
- id : String | Primary Key (Contoh: 'masak', 'seduh').
- nama_layanan : String | Nama jasa (Contoh: 'Jasa Masak Mie', 'Seduh Air Panas').
- biaya_tambahan : Decimal | Harga jasanya (Contoh: Rp2.000 untuk masak).

# kategori_layanan:
- id : String | Primary Key.
- id_kategori : String | Referensi ke tabel kategori.
- id_layanan_tambahan : String | Referensi ke tabel layanan_tambahan.


# 4. Modul Pelanggan & Keuangan (CRM & Piutang)

# member:
- id : String | Primary Key (ID unik member).
- kode_member : String | Kode unik kartu member atau nomor HP (untuk pencarian cepat).
- nama_pelanggan : String | Nama lengkap member.
- nomor_telepon : String | Untuk keperluan kontak atau pengiriman struk digital.
- alamat : Text | Alamat tempat tinggal member. (OPSIONAL)
- total_poin : Number | Akumulasi poin yang bisa ditukar dengan hadiah/diskon.
- tanggal_registrasi : Timestamp | Tanggal saat member pertama kali mendaftar.
- status_aktif : Boolean | Untuk mematikan member jika sudah tidak berlangganan.

# hutang:
- id : String | Primary Key.
- id_member : String | Referensi ke tabel member (Siapa yang berhutang).
- id_transaksi : String | Referensi ke tabel transaksi (Dari belanjaan yang mana).
- total_hutang : Decimal | Jumlah total hutang awal dari transaksi tersebut.
- sisa_hutang : Decimal | Jumlah yang masih harus dibayar (berkurang jika dicicil).
- tanggal_jatuh_tempo : Date | Tanggal batas akhir pembayaran (opsional).
- status_lunas : Boolean | true jika sudah bayar semua, false jika masih ada sisa.

# pembayaran_hutang:
- id : String | Primary Key.
- id_hutang : String | Referensi ke tabel hutang.
- jumlah_bayar : Decimal | Nominal uang yang dibayarkan saat mencicil.
- tanggal_bayar : Timestamp | Waktu saat cicilan diterima.
- id_kasir : String | Kasir yang menerima uang cicilan.


# 5. Modul Audit & Pelaporan

# log_aktivitas:
- id : String | Primary Key.
- id_pengguna : String | Siapa yang melakukan aksi tersebut (Referensi ke tabel pengguna).
- aksi : String | Jenis tindakan (Contoh: 'HAPUS_TRANSAKSI', 'UBAH_STOK', 'LOGIN').
- tabel_terkait : String | Nama tabel yang dimodifikasi (Contoh: 'transaksi', 'stok').
- id_data_terkait : String | ID dari baris data yang diubah (misal ID transaksi yang dihapus).
- data_sebelumnya : Text/JSON | Nilai data sebelum diubah (penting untuk pembuktian).
- data_sesudah : Text/JSON | Nilai data setelah diubah.
- perangkat : String | Info perangkat (Contoh: 'Tablet-Kasir-01').
- dibuat_pada : Timestamp | Waktu persis kejadian.

# ringkasan_bulanan:
- id : String | Primary Key (Contoh: '2026-04').
- total_omzet : Decimal | Total penjualan kotor bulan itu.
- total_laba : Decimal | Total keuntungan bersih bulan itu.
- total_pengeluaran : Decimal | Jika Anda mencatat biaya listrik/gaji karyawan.


# INDEXING"
Nama Tabel : produk
Kolom Index (Dexie Format) : "++id, kode_produk, nama_produk, id_kategori"
Alasan & Fungsi : Scan barcode (kode_produk) dan cari nama barang (nama_produk).

Nama Tabel : satuan_produk
Kolom Index (Dexie Format) : "++id, id_produk"
Alasan & Fungsi : Mengambil semua jenis satuan (Pcs/Dus) milik satu produk tertentu.

Nama Tabel : kategori
Kolom Index (Dexie Format) : "++id, nama_kategori"
Alasan & Fungsi : Menampilkan daftar barang per kategori.

Nama Tabel : stok
Kolom Index (Dexie Format) : "++id, id_produk, tanggal_kadaluarsa"
Alasan & Fungsi : Cek stok barang tertentu dan peringatan barang hampir basi.

Nama Tabel : transaksi
Kolom Index (Dexie Format) : "++id, nomor_struk, dibuat_pada, id_member"
Alasan & Fungsi : "Cari nota, laporan harian (dibuat_pada), dan riwayat belanja member."

Nama Tabel : transaksi_detail
Kolom Index (Dexie Format) : "++id, id_transaksi, id_produk"
Alasan & Fungsi : Menampilkan rincian barang di dalam sebuah struk.

Nama Tabel : member
Kolom Index (Dexie Format) : "++id, kode_member, nama_pelanggan, nomor_telepon"
Alasan & Fungsi : Cari member via kartu atau nomor HP saat transaksi.

Nama Tabel : hutang
Kolom Index (Dexie Format) : "++id, id_member, status_lunas"
Alasan & Fungsi : Memfilter siapa saja pelanggan yang belum bayar bon.

Nama Tabel : layanan_digital
Kolom Index (Dexie Format) : "++id, nama_layanan"
Alasan & Fungsi : Menampilkan pilihan menu top-up/jasa digital.

Nama Tabel : transaksi_layanan_digital
Kolom Index (Dexie Format) : "++id, dibuat_pada, status_transaksi"
Alasan & Fungsi : Laporan harian jasa digital dan cek status transaksi pending.

Nama Tabel : agen
Kolom Index (Dexie Format) : "++id, nama_agen"
Alasan & Fungsi : Mempermudah pencarian saat mau kulakan.

Nama Tabel : harga_agen
Kolom Index (Dexie Format) : "++id, id_produk, id_agen"
Alasan & Fungsi : Bandingkan harga modal produk dari berbagai agen.

Nama Tabel : log_aktivitas
Kolom Index (Dexie Format) : "++id, dibuat_pada, aksi"
Alasan & Fungsi : Melacak siapa melakukan apa pada jam berapa.