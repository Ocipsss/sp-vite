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
import { db } from "../../../database"; 
import { useCartStore } from "../../../stores/cart";
import ProductItem from "./ProductItem.vue";
import ProductDetailModal from "./ProductDetailModal.vue"; // Kamu perlu buat file ini
import ProductEditModal from "./ProductEditModal.vue";     // Kamu perlu buat file ini
import type { Product } from "../../../types";

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