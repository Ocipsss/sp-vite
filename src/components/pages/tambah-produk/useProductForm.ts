import { ref, watch, onMounted } from 'vue';
import { db } from '@/database';

export function useProductForm() {
  const isSaving = ref(false);
  const listCategories = ref<any[]>([]);
  const displayModal = ref("");
  const displaySell = ref("");
  const displayPack = ref("");

  const product = ref({
    id: '', image: null as string | null, name: '', code: '',
    category: 'Umum', unit: 'pcs', price_modal: 0, price_sell: 0,
    qty: 0, pack_price: 0, pack_size: 1 as number | null
  });

  const formatDisplay = (val: number) => {
    if (!val) return "";
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

  const saveProduct = async () => {
    if(!product.value.name || !product.value.price_sell) return alert("Nama dan Harga Jual wajib diisi!");
    isSaving.value = true;
    try {
      const finalId = 'SP-' + Date.now().toString(36);
      await db.products.add({ ...JSON.parse(JSON.stringify(product.value)), id: finalId, updatedAt: new Date().toISOString() });
      alert("Produk Berhasil Disimpan!");
      location.reload(); // Simple reset
    } catch (err: any) { alert("Gagal: " + err.message); }
    finally { isSaving.value = false; }
  };

  onMounted(async () => { listCategories.value = await db.categories.toArray(); });

  return { product, isSaving, listCategories, displayModal, displaySell, displayPack, updateNumber, saveProduct };
}



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah useProductForm.ts, sebuah Composable Function yang bertindak sebagai "Otak Logika" untuk formulir penambahan produk di aplikasi Sinar Pagi POS. File ini memisahkan seluruh aturan bisnis (seperti perhitungan harga grosir ke eceran) dan proses penyimpanan data dari tampilan visual (UI). Dengan menggunakan file ini, formulir produk menjadi cerdas karena mampu memformat angka ribuan secara otomatis saat diketik dan memastikan data yang masuk ke database sudah tervalidasi dengan benar.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Mengimpor fungsi dasar Vue (ref, watch, onMounted) untuk reaktivitas dan koneksi database (db) untuk menyimpan data barang.
// Baris 4: Ekspor fungsi useProductForm; memungkinkan logika formulir ini digunakan kembali di berbagai komponen tanpa menulis ulang kode.
// Baris 5-9: State Reaktif; menyiapkan variabel untuk status loading (isSaving), daftar kategori, dan variabel 'display' yang khusus digunakan untuk menampilkan format titik ribuan di layar.
// Baris 11-15: Struktur Data Produk; mendefinisikan objek 'product' dengan nilai standar (default), seperti unit 'pcs', kategori 'Umum', dan ID yang masih kosong.
// Baris 17-20: Fungsi formatDisplay; menggunakan Regex (Regular Expression) untuk mengubah angka murni (1000) menjadi format tampilan yang mudah dibaca kasir (1.000).
// Baris 22-34: Fungsi updateNumber (Logika Kalkulator); Jantung dari fitur "Wholesale Calculator". Jika kasir mengisi harga pak/dus (pack_price), fungsi ini secara otomatis menghitung harga modal per biji (unitModal) dengan membagi harga pak dengan isi pak tersebut.
// Baris 36-47: Fungsi saveProduct; proses pengiriman data ke database. Fungsi ini membuat ID unik otomatis berbasis waktu (SP-...), memastikan nama dan harga sudah terisi, lalu menyimpan data ke tabel 'products'.
// Baris 42: JSON.parse(JSON.stringify); teknik "Deep Copy" untuk memastikan data yang dikirim ke database adalah data murni tanpa gangguan referensi reaktif Vue.
// Baris 49: onMounted; mengambil daftar kategori dari database segera setelah formulir dibuka agar pilihan kategori (dropdown) sudah tersedia bagi kasir.
// Baris 51-54: Return; mengembalikan seluruh data dan fungsi agar bisa ditempelkan dan digunakan oleh file tampilan (ProductForm.vue).