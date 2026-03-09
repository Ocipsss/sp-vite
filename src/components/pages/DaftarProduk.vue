<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { db } from "../../database"; 
import { useCartStore } from "../../stores/cart";
import type { Product } from "../../types";

const cart = useCartStore();
const products = ref<Product[]>([]);
const listCategories = ref<any[]>([]);

// State Modal
const isEditModalOpen = ref(false);
const isDetailModalOpen = ref(false);
const editingProduct = ref<Product | null>(null);
const detailProduct = ref<Product | null>(null);

// State untuk input format Rupiah di Modal
const displayModal = ref("");
const displaySell = ref("");

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(val || 0);
};

const formatRupiahDisplay = (val: number) => {
  if (!val && val !== 0) return "";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Filter Pencarian (Sinkron dengan Header)
const filteredProducts = computed(() => {
  const query = (cart.searchQuery || "").toLowerCase().trim();
  if (!query) return products.value;
  return products.value.filter(p => 
    p.name.toLowerCase().includes(query) || 
    (p.code && p.code.toLowerCase().includes(query))
  );
});

const loadData = async () => {
  try {
    products.value = await db.table('products').orderBy('name').toArray();
    listCategories.value = await db.table('categories').toArray();
  } catch (err) {
    console.error("Database Error:", err);
  }
};

const openDetail = (p: Product) => {
  detailProduct.value = p;
  isDetailModalOpen.value = true;
};

const openEdit = (p: Product) => {
  editingProduct.value = JSON.parse(JSON.stringify(p));
  displayModal.value = formatRupiahDisplay(p.price_modal);
  displaySell.value = formatRupiahDisplay(p.price_sell);
  isDetailModalOpen.value = false;
  isEditModalOpen.value = true;
};

const updateNumber = (field: 'price_modal' | 'price_sell', event: any) => {
  let rawValue = event.target.value.replace(/\D/g, "");
  let numValue = parseInt(rawValue) || 0;
  if (editingProduct.value) {
    editingProduct.value[field] = numValue;
    if (field === 'price_modal') displayModal.value = formatRupiahDisplay(numValue);
    if (field === 'price_sell') displaySell.value = formatRupiahDisplay(numValue);
  }
};

const updateProduct = async () => {
  if (!editingProduct.value) return;
  try {
    await db.table('products').put(JSON.parse(JSON.stringify(editingProduct.value)));
    isEditModalOpen.value = false;
    await loadData(); 
    alert("Produk berhasil diperbarui");
  } catch (err: any) {
    alert("Gagal memperbarui: " + err.message);
  }
};

const deleteProduct = async (id: any) => {
  if (confirm("Hapus produk ini secara permanen?")) {
    try {
      await db.table('products').delete(id);
      isDetailModalOpen.value = false;
      await loadData();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  }
};

// --- LOGIKA EVENT LISTENER DARI FILE LAMA ---

const handleScanEvent = (e: any) => {
  if (isEditModalOpen.value && editingProduct.value) {
    editingProduct.value.code = e.detail;
  }
};

const handleOpenDetailEvent = (e: any) => {
  const p = products.value.find(item => item.id === e.detail);
  if (p) openDetail(p);
};

onMounted(() => {
  loadData();
  window.addEventListener('barcode-scanned-edit', handleScanEvent);
  window.addEventListener('open-product-detail', handleOpenDetailEvent);
});

onUnmounted(() => {
  window.removeEventListener('barcode-scanned-edit', handleScanEvent);
  window.removeEventListener('open-product-detail', handleOpenDetailEvent);
});
</script>

<template>
  <div class="min-h-full bg-slate-50">
    <div class="flex flex-col gap-3 px-4 pt-4 pb-48">
      <div 
        v-for="p in filteredProducts" :key="p.id" 
        @click="openDetail(p)"
        class="bg-white p-4 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all cursor-pointer"
      >
        <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
          <img v-if="p.image" :src="p.image" class="w-full h-full object-cover">
          <i v-else class="ri-shopping-bag-3-fill text-blue-300 text-xl"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-[13px] font-black text-slate-800 uppercase truncate leading-tight">{{ p.name }}</div>
          <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{{ p.code || 'Tanpa Kode' }}</span>
              <span v-if="p.category" class="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">{{ p.category }}</span>
          </div>
          <div class="text-[11px] font-black text-blue-600 mt-1">{{ formatRupiah(p.price_sell) }}</div>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="text-[10px] font-black px-3 py-1 rounded-xl tracking-tighter" :class="p.qty <= 5 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'">
            {{ p.qty }} <span class="text-[8px] opacity-60 uppercase">{{ p.unit }}</span>
          </span>
          <i class="ri-arrow-right-s-line text-slate-300"></i>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="py-20 text-center opacity-40">
        <i class="ri-archive-line text-4xl mb-2 block"></i>
        <p class="text-[10px] font-black uppercase tracking-widest">Tidak ada data ditemukan</p>
      </div>
    </div>

    <div v-if="isDetailModalOpen && detailProduct" class="fixed inset-0 z-110 flex items-end justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="isDetailModalOpen = false">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] p-6 animate-slide-up shadow-2xl">
        <div class="flex justify-center mb-4"><div class="w-12 h-1.5 bg-slate-100 rounded-full"></div></div>
        
        <div class="text-center mb-6">
            <div class="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-3 overflow-hidden">
                <img v-if="detailProduct.image" :src="detailProduct.image" class="w-full h-full object-cover">
                <i v-else class="ri-shopping-bag-3-line text-4xl text-blue-500"></i>
            </div>
            <h2 class="text-lg font-black text-slate-800 uppercase italic leading-none">{{ detailProduct.name }}</h2>
            <div class="flex justify-center gap-2 mt-3">
                <span class="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase">{{ detailProduct.category || 'Tanpa Kategori' }}</span>
                <span class="px-3 py-1 bg-blue-100 rounded-full text-[9px] font-black text-blue-600 uppercase">{{ detailProduct.code || 'Tanpa Barcode' }}</span>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div class="text-[9px] font-black text-slate-400 uppercase mb-1">Stok & Satuan</div>
                <div class="text-base font-black text-slate-800">{{ detailProduct.qty }} <small class="text-[10px] font-bold uppercase opacity-50">{{ detailProduct.unit }}</small></div>
            </div>
            <div class="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-100 text-right">
                <div class="text-[9px] font-black text-white/60 uppercase mb-1">Harga Jual</div>
                <div class="text-base font-black text-white">{{ formatRupiah(detailProduct.price_sell) }}</div>
            </div>
        </div>

        <div class="flex gap-3">
          <button @click="deleteProduct(detailProduct.id)" class="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">Hapus</button>
          <button @click="openEdit(detailProduct)" class="flex-2 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg">Edit Data</button>
        </div>
      </div>
    </div>

    <div v-if="isEditModalOpen && editingProduct" class="fixed inset-0 z-120 flex items-end justify-center p-4 bg-slate-900/80 backdrop-blur-md" @click.self="isEditModalOpen = false">
      <div class="bg-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl animate-slide-up overflow-y-auto max-h-[90vh]">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs">Update Produk</h3>
          <button @click="isEditModalOpen = false" class="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-400"><i class="ri-close-line text-xl"></i></button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Nama Produk</label>
            <input v-model="editingProduct.name" type="text" class="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-all uppercase text-sm">
          </div>

          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Kategori</label>
            <select v-model="editingProduct.category" class="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none appearance-none">
                <option value="">Tanpa Kategori</option>
                <option v-for="cat in listCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-black text-red-400 uppercase ml-2 mb-1 block">Harga Modal</label>
              <input :value="displayModal" @input="updateNumber('price_modal', $event)" type="text" inputmode="numeric" class="w-full px-5 py-3 bg-red-50/50 border border-red-100 rounded-2xl font-black text-red-500 text-center outline-none">
            </div>
            <div>
              <label class="text-[10px] font-black text-blue-500 uppercase ml-2 mb-1 block">Harga Jual</label>
              <input :value="displaySell" @input="updateNumber('price_sell', $event)" type="text" inputmode="numeric" class="w-full px-5 py-3 bg-blue-50 border border-blue-100 rounded-2xl font-black text-blue-600 text-center outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Stok</label>
              <input v-model.number="editingProduct.qty" type="number" class="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none text-center">
            </div>
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Satuan</label>
              <input v-model="editingProduct.unit" type="text" class="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none text-center uppercase">
            </div>
          </div>
        </div>

        <button @click="updateProduct" class="w-full mt-8 py-4 bg-blue-600 text-white rounded-[20px] font-black uppercase text-[11px] tracking-[0.3em] shadow-lg active:scale-95 transition-all">Simpan Perubahan</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
