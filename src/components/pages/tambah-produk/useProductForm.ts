import { ref, watch, onMounted } from 'vue';
import { db } from '@/database';

export function useProductForm() {
  const isSaving = ref(false);
  const listCategories = ref<any[]>([]);
  const allProducts = ref<any[]>([]);
  const suggestions = ref<any[]>([]);
  const showSuggestions = ref(false);
  const isExistingProduct = ref(false);

  const displayModal = ref("");
  const displaySell = ref("");
  const displayPack = ref("");

  const product = ref({
    id: '', image: null as string | null, name: '', code: '',
    category: 'Umum', unit: 'pcs', price_modal: 0, price_sell: 0,
    qty: 0, pack_price: 0, pack_size: 1 as number | null
  });

  const formatDisplay = (val: number) => {
    if (!val || val === 0) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const updateNumber = (field: 'price_modal' | 'price_sell' | 'pack_price', val: number) => {
    product.value[field] = val;
    if (field === 'price_modal') displayModal.value = formatDisplay(val);
    if (field === 'price_sell') displaySell.value = formatDisplay(val);
    if (field === 'pack_price') {
      displayPack.value = formatDisplay(val);
      if (product.value.pack_size && product.value.pack_size > 0) {
        const unitModal = Math.round(val / product.value.pack_size);
        product.value.price_modal = unitModal;
        displayModal.value = formatDisplay(unitModal);
      }
    }
  };

  const selectProduct = (p: any) => {
    product.value = { 
      ...p, 
      qty: 0,
      id: p.id 
    };
    displayModal.value = formatDisplay(p.price_modal);
    displaySell.value = formatDisplay(p.price_sell);
    isExistingProduct.value = true;
    showSuggestions.value = false;
  };

  const resetForm = () => {
    product.value = {
      id: '', image: null, name: '', code: '',
      category: 'Umum', unit: 'pcs', price_modal: 0, price_sell: 0,
      qty: 0, pack_price: 0, pack_size: 1
    };
    displayModal.value = "";
    displaySell.value = "";
    displayPack.value = "";
    isExistingProduct.value = false;
    showSuggestions.value = false;
  };

  watch(() => product.value.name, (newName) => {
    if (isExistingProduct.value) return;
    
    const query = newName.toLowerCase().trim();
    
    if (query.length >= 1) {
      const filtered = allProducts.value
        .filter(p => p.name.toLowerCase().includes(query))
        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          const startA = nameA.startsWith(query);
          const startB = nameB.startsWith(query);
          if (startA && !startB) return -1;
          if (!startA && startB) return 1;
          return nameA.localeCompare(nameB);
        });

      suggestions.value = filtered.slice(0, 8);
      showSuggestions.value = suggestions.value.length > 0;
    } else {
      showSuggestions.value = false;
    }
  });

  watch(() => product.value.code, (newCode) => {
    if (newCode && !isExistingProduct.value) {
      const exist = allProducts.value.find(p => p.code === newCode);
      if (exist) selectProduct(exist);
    }
  });

  const saveProduct = async () => {
    if(!product.value.name || !product.value.price_sell) return alert("Nama dan Harga Jual wajib diisi!");
    isSaving.value = true;
    try {
      if (isExistingProduct.value) {
        const oldProduct = allProducts.value.find(p => p.id === product.value.id);
        const totalQty = (oldProduct?.qty || 0) + product.value.qty;
        await db.table('products').update(product.value.id, { 
          ...product.value, 
          qty: totalQty,
          updatedAt: new Date().toISOString() 
        });
      } else {
        const finalId = 'SP-' + Date.now().toString(36);
        await db.table('products').add({ 
          ...product.value, 
          id: finalId, 
          updatedAt: new Date().toISOString() 
        });
      }
      alert("Berhasil Disimpan!");
      resetForm();
      allProducts.value = await db.table('products').toArray();
    } catch (err: any) { 
      alert("Gagal: " + err.message); 
    } finally { 
      isSaving.value = false; 
    }
  };

  onMounted(async () => {
    const [cats, prods] = await Promise.all([
      db.table('categories').toArray(),
      db.table('products').toArray()
    ]);
    listCategories.value = cats;
    allProducts.value = prods;
  });

  return { 
    product, isSaving, listCategories, displayModal, displaySell, displayPack, 
    suggestions, showSuggestions, isExistingProduct,
    updateNumber, saveProduct, selectProduct, resetForm 
  };
}



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah modul logika formulir produk (useProductForm.ts) yang berfungsi sebagai "otak" di balik pengelolaan data barang pada aplikasi Sinar Pagi. Menggunakan Vue Composable, file ini menangani seluruh siklus hidup data produk, mulai dari inisialisasi formulir, validasi input, hingga sinkronisasi ke database Dexie. Fitur paling krusial di sini adalah sistem "Smart Autocomplete" yang memantau ketikan nama atau pemindaian barcode secara real-time; jika produk sudah terdaftar, sistem akan otomatis mengisi formulir (auto-fill). Selain itu, terdapat logika "Wholesale Splitter" yang secara otomatis membagi harga modal satu pak menjadi harga satuan, memastikan perhitungan margin keuntungan tetap akurat tanpa perlu kalkulator eksternal.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Impor Dependensi; mengambil fungsi reaktivitas (ref, watch, onMounted) dari Vue dan koneksi database lokal (db).
// Baris 4: Definisi Composable; membungkus seluruh logika formulir agar bisa digunakan kembali di berbagai komponen UI.
// Baris 5-10: State UI; mendefinisikan variabel reaktif untuk memantau status penyimpanan (isSaving), daftar kategori, saran produk (suggestions), dan penanda apakah barang yang diinput adalah barang lama (isExistingProduct).
// Baris 12-14: State Display; variabel string khusus untuk menampilkan format angka ribuan (dengan titik) pada kolom harga agar lebih mudah dibaca manusia.
// Baris 16-20: Objek Product; skema data utama produk yang mencakup ID unik, gambar, nama, kode, kategori, hingga detail harga grosir (pack_price).
// Baris 22-25: Fungsi formatDisplay; utilitas untuk mengubah angka mentah menjadi format ribuan (Contoh: 10000 menjadi 10.000) menggunakan regex.
// Baris 27-40: Fungsi updateNumber; logika inti yang memperbarui nilai numerik produk. Jika harga satu pak (pack_price) diubah, fungsi ini otomatis menghitung harga modal satuan (price_modal) berdasarkan isi per pak (pack_size).
// Baris 42-52: Fungsi selectProduct; memproses pemilihan produk dari daftar saran. Fungsi ini memindahkan data produk lama ke formulir dan mengaktifkan mode update (isExistingProduct = true).
// Baris 54-65: Fungsi resetForm; mengembalikan seluruh state produk dan tampilan harga ke kondisi awal (kosong), biasanya dijalankan setelah sukses menyimpan data.
// Baris 67-86: Watcher Nama Produk; memantau setiap ketikan pada kolom nama. Jika pengguna mengetik, sistem akan mencari kecocokan nama di database, mengurutkannya, dan menampilkan maksimal 8 saran produk serupa.
// Baris 88-93: Watcher Kode Barcode; memantau input barcode. Jika barcode yang di-scan cocok dengan data lama, sistem akan langsung memicu fungsi selectProduct untuk mengisi data secara otomatis.
// Baris 95-121: Fungsi saveProduct; logika penyimpanan utama. Melakukan validasi kolom wajib, menghitung akumulasi stok jika barang lama, memberikan ID unik (prefix 'SP-') untuk barang baru, dan menyimpan hasilnya ke IndexedDB melalui Dexie.
// Baris 123-130: Lifecycle onMounted; melakukan pemuatan data kategori dan seluruh daftar produk dari database segera setelah formulir diakses untuk mendukung fitur pencarian instan.
// Baris 132-137: Return Value; mengekspos state dan fungsi-fungsi kontrol agar bisa dihubungkan ke elemen HTML pada komponen Vue (Template).