<template>
  <div class="p-4 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-15px_30px_rgba(0,0,0,0.08)] rounded-t-4xl shrink-0 z-50">
    
    <transition name="slide-up">
      <div v-if="cart.payMethod === 'Tunai'" class="mb-4">
        <div class="bg-gray-900 p-5 rounded-3xl shadow-2xl relative">
          <div class="flex items-center gap-4 mb-4 relative z-10">
            <div class="flex-1">
              <label class="text-[9px] text-gray-500 font-black uppercase block mb-1 tracking-widest">Input Tunai</label>
              <div class="flex items-baseline gap-1">
                <span class="text-blue-500 text-sm font-black italic">Rp</span>
                <input 
                  type="number" inputmode="numeric" v-model.number="cart.cashAmount" 
                  class="w-full bg-transparent border-none text-white text-3xl font-black outline-none p-0 m-0"
                  placeholder="0"
                >
              </div>
            </div>
            <div class="text-right border-l border-white/10 pl-4">
              <div class="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">Kembali</div>
              <div :class="cart.kembalian > 0 ? 'text-green-400' : 'text-white'" class="text-xl font-black italic">
                {{ formatNumber(cart.kembalian) }}
              </div>
            </div>
          </div>
          
          <button 
            @click="handleMainButtonClick"
            :disabled="isButtonDisabled"
            class="w-full border-none py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:scale-100"
          >
            {{ buttonLabel }}
          </button>
        </div>
      </div>
    </transition>

    <div class="flex flex-col gap-3">
      <div class="flex items-end justify-between px-2">
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Total Tagihan</span>
        <span class="text-3xl font-black text-gray-900 tracking-tighter">{{ formatRupiah(cart.totalBelanja) }}</span>
      </div>
      
      <div class="flex gap-2 bg-gray-100 p-1.5 rounded-[1.2rem] border border-gray-200 shadow-inner">
        <button 
        v-for="m in PAYMENT_METHODS" :key="m.id"
        @click="cart.payMethod = (cart.payMethod === m.id ? null : m.id)"
        :class="cart.payMethod === m.id 
        ? 'bg-blue-600 text-white shadow-md border-blue-600' 
        : 'bg-blue-100 text-black border-gray-200'"
        class="flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase transition-all tracking-widest flex items-center justify-center"
      >
        {{ m.label }}
        </button>
      </div>

      <transition name="fade">
        <button 
          v-if="cart.payMethod && cart.payMethod !== 'Tunai'"
          @click="$emit('checkout')"
          :disabled="cart.items.length === 0"
          class="w-full border-none py-4 rounded-[1.2rem] bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
        >
          PROSES {{ cart.payMethod.toUpperCase() }}
        </button>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from "@/stores/cart";
import { formatRupiah, formatNumber } from "@/utils/formatters";
import { PAYMENT_METHODS } from "@/constants/app";

const emit = defineEmits(['checkout']);
const cart = useCartStore();

// Logika Label Tombol
const buttonLabel = computed(() => {
  if (!cart.cashAmount || cart.cashAmount === 0) return 'UANG PAS';
  if (cart.cashAmount < cart.totalBelanja) return 'UANG KURANG';
  return 'SELESAIKAN TRANSAKSI';
});

// Logika Disable Tombol
const isButtonDisabled = computed(() => 
  cart.items.length === 0 || (cart.cashAmount > 0 && cart.cashAmount < cart.totalBelanja)
);

const handleMainButtonClick = () => {
  if (!cart.cashAmount || cart.cashAmount === 0) {
    cart.cashAmount = cart.totalBelanja;
  }
  emit('checkout');
};
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen CartCheckout.vue yang berfungsi sebagai Panel Pembayaran (Payment Summary) di aplikasi Sinar Pagi POS. Panel ini terletak di bagian paling bawah layar transaksi dan merupakan langkah terakhir sebelum pesanan disimpan. Komponen ini sangat krusial karena mengelola pilihan metode pembayaran (Tunai, QRIS, dll.), menghitung kembalian secara otomatis, dan memberikan validasi pintar jika uang yang dimasukkan kasir masih kurang, memastikan setiap transaksi yang diselesaikan sudah akurat secara nominal.

PENJELASAN FUNGSI TIAP BARIS:
Baris 2: Kontainer Utama; memiliki desain melengkung ke atas (rounded-t-4xl) dengan efek kaca (backdrop-blur) dan bayangan lembut agar terlihat melayang di atas konten daftar belanja.
Baris 4-29: Panel Pembayaran Tunai; bagian ini hanya muncul (v-if) jika kasir memilih metode "Tunai". Di dalamnya terdapat input untuk jumlah uang yang diterima dan tampilan nominal kembalian secara real-time.
Baris 11-14: Input Nominal; menggunakan 'inputmode="numeric"' untuk memunculkan keyboard angka. Terhubung ke data 'cart.cashAmount' di pusat data (store).
Baris 20-22: Logika Kembalian; menampilkan hasil pengurangan uang tunai dengan total belanja. Warna teks akan berubah menjadi hijau jika ada kembalian yang harus diberikan.
Baris 33-35: Tombol Aksi Utama; tombol dinamis yang teksnya bisa berubah (Uang Pas / Selesaikan Transaksi) tergantung pada jumlah uang yang diketik oleh kasir.
Baris 38-41: Ringkasan Total; menampilkan angka "Total Tagihan" yang sangat besar dan tebal (font-black) agar kasir tidak salah membacakan nominal kepada pelanggan.
Baris 43-52: Pilihan Metode Pembayaran; menampilkan daftar tombol (Tunai, QRIS, Piutang) secara berjajar. Tombol yang dipilih akan berwarna biru mencolok, sementara yang lain berwarna pudar.
Baris 54-61: Tombol Proses Non-Tunai; tombol khusus yang hanya muncul jika metode pembayaran selain tunai dipilih (seperti QRIS), digunakan untuk langsung memproses transaksi tanpa input uang kembali.
Baris 66-70: Bagian Script; mengimpor fungsi format mata uang dan konstanta daftar metode pembayaran yang didukung oleh sistem Sinar Pagi.
Baris 73-77: Computed buttonLabel; logika pintar yang menentukan teks pada tombol. Jika kasir tidak mengisi uang tunai, tombol otomatis menjadi "UANG PAS". Jika uang kurang, label berubah menjadi "UANG KURANG".
Baris 80-82: Computed isButtonDisabled; sistem pengaman yang mencegah transaksi diproses jika keranjang kosong atau jika uang tunai yang dimasukkan belum mencukupi total tagihan.
Baris 84-89: Fungsi handleMainButtonClick; jika kasir menekan tombol saat input kosong, sistem mengasumsikan pembayaran dengan uang pas, lalu mengirim sinyal 'checkout' ke sistem utama.
Baris 92-102: Styling CSS Scoped; mengatur animasi transisi 'slide-up' dan 'fade' agar elemen pembayaran muncul dengan gerakan halus dari bawah, memberikan kesan aplikasi yang modern dan elegan. -->