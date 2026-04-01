<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click')"
    :class="[
      'flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100',
      variantClasses,
      sizeClasses,
      block ? 'w-full' : ''
    ]"
  >
    <i v-if="loading" class="ri-loader-4-line animate-spin"></i>
    <i v-else-if="icon" :class="icon"></i>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: { type: String as () => 'button' | 'submit', default: 'button' },
  variant: { type: String as () => 'primary' | 'secondary' | 'danger' | 'ghost', default: 'primary' },
  size: { type: String as () => 'sm' | 'md' | 'lg', default: 'md' },
  icon: String,
  disabled: Boolean,
  loading: Boolean,
  block: Boolean
});

defineEmits(['click']);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-blue-600 text-white shadow-lg shadow-blue-200';
    case 'secondary': return 'bg-slate-900 text-white';
    case 'danger': return 'bg-red-50 text-red-600 border border-red-100';
    case 'ghost': return 'bg-transparent text-slate-500 hover:bg-slate-100';
    default: return '';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1.5 rounded-xl text-[10px] font-bold';
    case 'lg': return 'px-6 py-4 rounded-[1.5rem] text-[14px] font-black tracking-widest';
    default: return 'px-4 py-3 rounded-2xl text-[12px] font-black';
  }
});
</script>



<!-- 
DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen BaseButton (Atom) yang bersifat reusable (dapat digunakan kembali) untuk seluruh aplikasi Sinar Pagi. Komponen ini berfungsi sebagai pembungkus elemen tombol standar dengan sistem styling dinamis menggunakan Tailwind CSS. Mendukung berbagai varian warna, ukuran, status loading dengan animasi, serta penempatan ikon otomatis agar tampilan antarmuka (UI) tetap konsisten dan responsif di perangkat mobile.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-17: Struktur template tombol yang menggunakan binding atribut untuk tipe data, status non-aktif (disabled), dan pengiriman event klik ke komponen induk.
Baris 6-12: Penerapan kelas CSS dinamis yang menggabungkan gaya dasar (seperti efek tekan active:scale-95) dengan hasil perhitungan logika (varian warna, ukuran, dan lebar penuh).
Baris 14-15: Logika tampilan ikon yang secara otomatis menampilkan animasi berputar (loader) saat proses loading aktif, atau menampilkan ikon kustom jika didefinisikan.
Baris 16: Penggunaan tag slot untuk memberikan fleksibilitas konten di dalam tombol, baik berupa teks maupun elemen HTML lainnya.
Baris 20-21: Bagian skrip setup menggunakan TypeScript dan mengambil fungsi computed dari Vue untuk optimasi reaktivitas.
Baris 23-31: Pendefinisian Props sebagai parameter masukan yang mengatur perilaku tombol seperti jenis (button/submit), pilihan warna, ukuran, hingga status boolean (disabled/loading/block).
Baris 33: Deklarasi pengiriman event (emit) agar komponen induk dapat menangkap aksi klik dari pengguna.
Baris 35-43: Fungsi computed variantClasses yang menentukan skema warna latar belakang dan teks berdasarkan pilihan varian (Primary, Secondary, Danger, atau Ghost).
Baris 45-51: Fungsi computed sizeClasses yang mengatur besaran padding, radius sudut (border-radius), dan ukuran font agar sesuai dengan skala desain yang diinginkan. 
-->