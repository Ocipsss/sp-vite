<template>
  <div class="space-y-1.5 px-1 mt-1">
    <label class="text-[10px] font-black uppercase tracking-widest block ml-1" :class="labelClass">{{ label }}</label>
    <div class="relative flex items-center h-14 rounded-2xl border px-5 transition-all" :class="containerClass">
      <span class="font-bold mr-1.5 opacity-50">Rp</span>
      <input 
        :value="displayValue" 
        @input="handleInput"
        type="text" inputmode="numeric" 
        class="flex-1 bg-transparent border-none outline-none font-black p-0 m-0 w-full"
        :class="inputClass"
        placeholder="0"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['label', 'displayValue', 'labelClass', 'containerClass', 'inputClass']);
const emit = defineEmits(['update']);

const handleInput = (e: any) => {
  const raw = e.target.value.replace(/\D/g, "");
  emit('update', parseInt(raw) || 0);
};
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen PriceInput.vue yang berfungsi sebagai Komponen Input Mata Uang Kustom (Custom Currency Input) untuk aplikasi Sinar Pagi POS. Komponen ini dirancang untuk memberikan pengalaman mengetik nominal uang yang nyaman dan konsisten di seluruh bagian aplikasi (seperti saat mengedit harga modal atau harga jual). Keunggulan utamanya adalah penggunaan 'inputmode="numeric"' yang secara otomatis memicu munculnya papan ketik angka (numpad) pada perangkat mobile, serta sistem pembersihan karakter otomatis yang memastikan hanya angka murni yang diproses oleh sistem.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-3: Kontainer Luar; menggunakan sistem jarak 'space-y-1.5' untuk mengatur ruang antara label teks dan kotak input secara otomatis.
Baris 4: Elemen Label; menampilkan judul input (seperti "Harga Jual") dalam format huruf besar dan tebal. Menggunakan ':class="labelClass"' agar warna atau gaya label bisa diatur secara fleksibel dari komponen induk.
Baris 5: Bingkai Input (Wrapper); kotak utama input dengan tinggi tetap (h-14) dan sudut melengkung besar (rounded-2xl). Properti 'relative flex items-center' memastikan simbol mata uang dan kolom ketik sejajar secara horizontal.
Baris 6: Simbol Mata Uang; menampilkan teks "Rp" secara statis dengan opasitas rendah (50%) agar terlihat sebagai petunjuk visual tanpa mengganggu fokus pada angka yang diketik.
Baris 7-14: Elemen Input Utama; kolom tempat kasir mengetik angka. Menggunakan ':value="displayValue"' untuk menampilkan angka yang sudah diformat dari luar, serta menonaktifkan border bawaan browser (border-none outline-none) agar menyatu dengan desain kustom.
Baris 19-20: Script Setup & Emits; mendefinisikan properti yang diterima (props) dan mendaftarkan event 'update' untuk mengirimkan data angka kembali ke formulir utama.
Baris 22-25: Fungsi handleInput (Pembersih Data); jantung logika komponen ini. Setiap kali kasir mengetik, perintah '.replace(/\D/g, "")' akan langsung menghapus karakter non-angka (seperti titik, koma, atau huruf).
Baris 24: Emit Update; setelah dibersihkan, data diubah menjadi angka bulat (parseInt) dan dikirim keluar. Jika input kosong, sistem secara otomatis mengirimkan angka 0 untuk mencegah kerusakan data pada database. -->