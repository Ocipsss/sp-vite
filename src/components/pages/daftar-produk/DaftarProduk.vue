<template>
  <div class="min-h-full bg-slate-50">
    <div class="flex flex-col gap-3 px-4 pt-4 pb-48">
      <ProductItem 
        v-for="p in filteredProducts" 
        :key="p.id" 
        :product="p" 
        @click="openDetail" 
      />

      <div v-if="filteredProducts.length === 0" class="py-20 text-center opacity-40">
        <i class="ri-archive-line text-4xl mb-2 block"></i>
        <p class="text-[10px] font-black uppercase tracking-widest">Tidak ada data ditemukan</p>
      </div>
    </div>

    <ProductDetailModal 
      v-if="isDetailModalOpen" 
      :product="selectedProduct" 
      @close="isDetailModalOpen = false"
      @edit="openEdit"
      @delete="handleDelete"
    />

    <ProductEditModal 
      v-if="isEditModalOpen" 
      :product="selectedProduct"
      :categories="listCategories"
      @close="isEditModalOpen = false"
      @save="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { db } from "@/database"; 
import { useCartStore } from "@/stores/cart";
import ProductItem from "./ProductItem.vue";
import ProductDetailModal from "./ProductDetailModal.vue";
import ProductEditModal from "./ProductEditModal.vue";
import type { Product } from "@/types";

const cart = useCartStore();
const products = ref<Product[]>([]);
const listCategories = ref<any[]>([]);

const isEditModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

// Menggunakan filter dari store
const filteredProducts = computed(() => {
  const query = (cart.searchQuery || "").toLowerCase().trim();
  if (!query) return products.value;
  return products.value.filter(p => 
    p.name.toLowerCase().includes(query) || (p.code && p.code.toLowerCase().includes(query))
  );
});

const loadData = async () => {
  products.value = await db.table('products').orderBy('name').toArray();
  listCategories.value = await db.table('categories').toArray();
};

const openDetail = (p: Product) => {
  selectedProduct.value = p;
  isDetailModalOpen.value = true;
};

const openEdit = (p: Product) => {
  selectedProduct.value = p;
  isDetailModalOpen.value = false;
  isEditModalOpen.value = true;
};

const handleUpdate = async (updatedProduct: Product) => {
  try {
    await db.table('products').put({
      ...updatedProduct,
      updatedAt: new Date().toISOString()
    });
    isEditModalOpen.value = false;
    await loadData();
  } catch (err) {
    console.error("Update failed:", err);
  }
};

const handleDelete = async (id: string) => {
  if (confirm("Hapus produk ini secara permanen?")) {
    await db.table('products').delete(id);
    isDetailModalOpen.value = false;
    await loadData();
  }
};

// Event Listeners
const handleOpenDetailEvent = (e: CustomEvent) => {
  const p = products.value.find(item => item.id === e.detail);
  if (p) openDetail(p);
};

onMounted(() => {
  loadData();
  window.addEventListener('open-product-detail', handleOpenDetailEvent as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('open-product-detail', handleOpenDetailEvent as EventListener);
});
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen DaftarProduk.vue yang berfungsi sebagai pusat manajemen inventaris dalam aplikasi Sinar Pagi POS. Komponen ini menangani alur kerja lengkap (CRUD) untuk produk, mulai dari menampilkan daftar barang yang bisa difilter secara real-time, melihat detail spesifikasi barang, hingga melakukan perubahan data atau penghapusan. Desainnya dioptimalkan untuk penggunaan mobile dengan sistem modal (pop-up) yang bertumpuk, memastikan kasir dapat mengelola stok barang dengan cepat tanpa harus berpindah-pindah halaman secara manual.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-17: Area Template Utama; menggunakan elemen ProductItem yang diulang (v-for) untuk menampilkan setiap barang dalam koleksi data. Terdapat juga logika tampilan cadangan jika hasil pencarian kosong (Empty State).
Baris 19-25: Komponen ProductDetailModal; pop-up yang muncul saat sebuah produk diklik untuk menampilkan informasi lengkap, serta menyediakan tombol aksi untuk edit atau hapus.
Baris 27-33: Komponen ProductEditModal; formulir pop-up untuk mengubah informasi produk seperti nama, harga, atau stok, yang terhubung langsung dengan daftar kategori yang ada.
Baris 37-43: Mengimpor fungsi reaktivitas Vue, koneksi database Dexie, state management Pinia (untuk fitur pencarian), serta komponen-komponen pendukung lainnya.
Baris 45-51: Inisialisasi State; menyiapkan variabel reaktif untuk menampung daftar produk, daftar kategori, serta mengontrol status buka/tutup jendela modal detail dan edit.
Baris 54-60: Computed filteredProducts; jantung dari fitur pencarian. Fungsi ini secara otomatis menyaring daftar produk berdasarkan nama atau barcode (code) sesuai dengan apa yang diketikkan kasir di kolom pencarian global.
Baris 62-65: Fungsi loadData; mengambil data produk terbaru dari database lokal dan mengurutkannya berdasarkan nama secara alfabetis agar daftar terlihat rapi.
Baris 67-76: Fungsi openDetail & openEdit; mengatur alur perpindahan antar modal. Saat beralih ke mode edit, modal detail akan ditutup secara otomatis untuk menjaga fokus pengguna.
Baris 78-89: Fungsi handleUpdate; menyimpan perubahan data ke database lokal menggunakan perintah .put, memperbarui stempel waktu (updatedAt), lalu menyegarkan tampilan daftar produk.
Baris 91-97: Fungsi handleDelete; memberikan konfirmasi keamanan sebelum menghapus data produk secara permanen dari penyimpanan perangkat.
Baris 100-103: Fungsi handleOpenDetailEvent; sebuah "Event Listener" kustom yang memungkinkan komponen lain (seperti hasil scan barcode) untuk memerintahkan halaman ini membuka detail produk tertentu secara otomatis.
Baris 105-112: Lifecycle Hooks (onMounted & onUnmounted); menjalankan pengambilan data saat halaman dibuka dan membersihkan pendengar event saat halaman ditinggalkan untuk mencegah kebocoran memori (memory leak). -->