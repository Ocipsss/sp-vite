<template>
  <div class="flex gap-2 w-full px-1 animate-fade-in">
    
    <div class="relative flex-1 group search-container">
      <input 
        :value="modelValue" 
        @input="handleInput"
        @focus="isFocused = true"
        type="text" 
        :placeholder="placeholder" 
        class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm transition-all"
      >
      
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center z-30">
        <i v-if="!modelValue" class="ri-search-2-line text-slate-400 group-focus-within:text-blue-500"></i>
        <button v-else @click="clearSearch" class="w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors">
          <i class="ri-close-line text-slate-500"></i>
        </button>
      </div>

      <transition name="fade">
        <div v-if="showDropdown" 
          class="absolute top-full right-0 -left-4 mt-2 w-[calc(100%+2rem)] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-999"
        >
          <div class="max-h-80 overflow-y-auto no-scrollbar py-2">
            <div 
              v-for="p in suggestions" :key="p.id"
              @click="selectProduct(p)"
              class="px-6 py-4 hover:bg-blue-50/50 border-b border-slate-50 last:border-0 flex items-center gap-4 active:bg-blue-50 transition-colors cursor-pointer"
            >
              <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                <i class="ri-barcode-line text-slate-300 text-lg"></i>
              </div>

              <div class="flex-1 min-w-0">
                <div class="text-[13px] font-black text-slate-700 uppercase truncate" v-html="highlightText(p.name, modelValue)"></div>
                <div class="text-[9px] text-slate-400 font-bold tracking-wider uppercase">{{ p.code || 'Tanpa Kode' }}</div>
              </div>

              <div class="text-right shrink-0">
                <div class="text-[12px] font-black text-blue-600">{{ formatRupiah(p.price_sell) }}</div>
                <div class="text-[9px] font-bold text-slate-400 uppercase">{{ p.qty }} {{ p.unit }}</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { useProductSearch } from '@/composables/useProductSearch';
import { useCartStore } from '@/stores/cart';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  hideSuggestions?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const cart = useCartStore();

const { 
  suggestions, 
  isFocused, 
  fetchSuggestions, 
  highlightText, 
  formatRupiah 
} = useProductSearch();

const showDropdown = computed(() => {
  return !props.hideSuggestions && 
         isFocused.value && 
         suggestions.value.length > 0 && 
         props.modelValue.length > 0;
});

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
  fetchSuggestions(val);
};

const selectProduct = (p: any) => {
  cart.addToCart(p); 
  clearSearch();
  isFocused.value = false;
};

const clearSearch = () => {
  emit('update:modelValue', '');
  // @ts-ignore
  if (suggestions.value) suggestions.value = [];
};

const handleClickOutside = (e: MouseEvent) => {
  const container = (e.target as HTMLElement).closest('.search-container');
  if (!container) {
    isFocused.value = false;
  }
};

onMounted(() => window.addEventListener('mousedown', handleClickOutside));
onBeforeUnmount(() => window.removeEventListener('mousedown', handleClickOutside));
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px) scale(0.98); }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>



<!-- 
DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen GlobalSearch yang berfungsi sebagai mesin pencari produk real-time untuk aplikasi Sinar Pagi POS. Komponen ini menggunakan sistem "Autocomplete" atau "Live Suggestion" yang akan menampilkan daftar produk yang relevan saat pengguna mengetik. Fitur unggulannya mencakup penyorotan teks (text highlighting), integrasi langsung ke keranjang belanja (Pinia), pembersihan input sekali klik, serta penanganan klik di luar area (click outside) untuk menutup dropdown secara otomatis.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-2: Pembungkus utama dengan animasi fade-in saat komponen dimuat pertama kali ke layar.
Baris 4-15: Struktur input teks utama; menggunakan v-model manual (binding value dan event input) untuk mendukung sinkronisasi data dengan komponen induk.
Baris 17-23: Area ikon pencarian dinamis; menampilkan ikon kaca pembesar saat kosong, dan berubah menjadi tombol silang (X) untuk menghapus teks saat input terisi.
Baris 25-54: Area Dropdown (Saran Produk); menggunakan transisi Vue untuk efek muncul yang halus. Hanya muncul jika ada hasil pencarian dan kolom input sedang aktif (focus).
Baris 30-47: Looping daftar produk hasil pencarian; menampilkan informasi lengkap seperti nama produk (dengan highlight), kode barcode, harga jual yang diformat rupiah, serta sisa stok (qty).
Baris 58-61: Import komposabel useProductSearch untuk logika pencarian dan useCartStore untuk memasukkan produk ke transaksi.
Baris 63-68: Definisi props (modelValue untuk data pencarian) dan emits untuk memperbarui nilai ke komponen induk.
Baris 72-78: Destrukturisasi fungsi dari komposabel pencarian, termasuk fungsi fetchSuggestions untuk mengambil data dari database lokal.
Baris 80-82: Computed showDropdown; logika penentu apakah kotak saran produk layak ditampilkan ke pengguna.
Baris 84-88: Fungsi handleInput; mengirim perubahan teks ke induk dan memicu pencarian data ke database setiap kali pengguna mengetik.
Baris 90-94: Fungsi selectProduct; aksi saat pengguna memilih salah satu produk dari saran, otomatis menambahkannya ke keranjang dan membersihkan pencarian.
Baris 96-100: Fungsi clearSearch; mereset nilai input dan mengosongkan daftar saran produk.
Baris 102-107: Fungsi handleClickOutside; logika keamanan untuk menutup dropdown pencarian jika pengguna mengklik area di luar kotak pencarian.
Baris 109-110: Lifecycle Hooks (onMounted/onBeforeUnmount); mendaftarkan dan membersihkan event listener global untuk mendeteksi klik di luar komponen agar tidak terjadi kebocoran memori.
Baris 113-125: Styling CSS scoped untuk mengatur animasi transisi dropdown, menyembunyikan scrollbar agar tampilan lebih bersih, dan animasi masuk komponen (fade-in).
-->