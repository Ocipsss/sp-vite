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
File ini adalah komponen utama manajemen katalog (Product Inventory List) yang berfungsi sebagai pusat penampil, pencari, dan pengelola data barang dalam aplikasi Sinar Pagi. Komponen ini mengintegrasikan sistem pencarian reaktif (computed search) dengan database lokal Dexie untuk menyajikan daftar produk secara instan. Selain menampilkan list, file ini juga bertindak sebagai pengendali (controller) untuk alur kerja CRUD (Create, Read, Update, Delete) melalui modal detail dan modal edit, serta menangani sinkronisasi tampilan secara otomatis setiap kali ada perubahan data fisik di penyimpanan.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Pembungkus utama halaman dengan warna latar belakang slate lembut dan area scroll yang dioptimalkan untuk perangkat mobile.
Baris 3-9: Iterasi Produk (v-for); merender setiap data barang menggunakan komponen ProductItem secara dinamis berdasarkan hasil filter pencarian.
Baris 11-14: Tampilan Kosong (Empty State); memberikan umpan balik visual berupa ikon arsip dan teks peringatan jika tidak ada produk yang cocok dengan kata kunci pencarian.
Baris 17-23: Modal Detail Produk; komponen popup yang muncul saat item diklik, berfungsi untuk menampilkan informasi lengkap barang serta menyediakan akses ke fungsi hapus dan edit.
Baris 25-31: Modal Edit Produk; komponen formulir khusus untuk memperbarui data produk (seperti nama, harga, atau kategori) yang terhubung langsung ke skema database.
Baris 35-41: Impor dependensi; mengambil fungsi reaktivitas Vue, koneksi database lokal (IndexedDB), akses ke Cart Store untuk sinkronisasi pencarian, dan tipe data Product.
Baris 43-49: Inisialisasi State; mendefinisikan variabel reaktif untuk menampung daftar produk, kategori, status buka/tutup modal, serta referensi produk yang sedang dipilih oleh pengguna.
Baris 51-57: Computed filteredProducts; logika pencarian pintar yang menyaring daftar barang berdasarkan nama atau barcode secara real-time mengikuti input user di search bar.
Baris 59-62: Fungsi loadData; melakukan query asinkron ke database lokal untuk mengambil data produk terbaru yang diurutkan berdasarkan abjad (A-Z).
Baris 64-67: Fungsi openDetail; menangani aksi klik pengguna untuk menetapkan produk aktif dan membuka jendela detail informasi.
Baris 69-73: Fungsi openEdit; mengalihkan alur kerja dari tampilan detail ke jendela pengeditan data produk.
Baris 75-86: Fungsi handleUpdate; memproses penyimpanan data hasil editan ke database, memperbarui stempel waktu (updatedAt), dan menyegarkan tampilan daftar secara otomatis.
Baris 88-94: Fungsi handleDelete; menjalankan prosedur penghapusan data permanen dari database lokal dengan konfirmasi keamanan terlebih dahulu.
Baris 96-99: Fungsi handleOpenDetailEvent; listener khusus yang memungkinkan komponen lain (seperti hasil scan atau notifikasi) untuk memicu pembukaan detail produk melalui Event Global.
Baris 101-104: Lifecycle onMounted; memicu pemuatan data awal dan mendaftarkan Event Listener eksternal saat komponen pertama kali muncul di layar.
Baris 106-108: Lifecycle onUnmounted; membersihkan Event Listener saat pengguna meninggalkan halaman guna mencegah kebocoran memori (memory leak). -->