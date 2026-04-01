<template>
  <div class="flex flex-col items-center mb-2">
    <div @click="handleClip" class="w-40 h-40 bg-slate-50 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 relative cursor-pointer active:scale-95 transition-transform">
      <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover">
      <div v-else class="text-center text-slate-400 p-4">
        <i class="ri-camera-lens-line text-4xl"></i>
        <span class="block text-[10px] mt-2 uppercase font-black tracking-widest">Foto Produk</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const handleClip = () => {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400; canvas.height = 400;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 400, 400);
        emit('update:modelValue', canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  };
  input.click();
};
</script>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen ImageUpload.vue yang berfungsi sebagai Modul Kamera & Kompresi Foto untuk aplikasi Sinar Pagi POS. Komponen ini memungkinkan kasir atau admin untuk mengambil foto produk secara langsung menggunakan kamera HP atau memilih gambar dari galeri. Keunggulan utamanya adalah adanya fitur "Auto-Resizing" dan "Auto-Compression"; setiap foto yang diambil akan otomatis dipotong menjadi ukuran kotak (400x400 piksel) dan diperkecil ukuran filenya (kompresi 70%) agar tidak membebani memori HP dan mempercepat proses sinkronisasi ke cloud.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-4: Area Bingkai Foto; membuat kotak berukuran 40-unit (w-40 h-40) dengan sudut melengkung dan garis tepi putus-putus (border-dashed). Jika foto sudah ada, gambar akan ditampilkan; jika belum, akan muncul ikon kamera sebagai petunjuk.
Baris 5-10: Efek Interaksi; menggunakan 'active:scale-95' untuk memberikan umpan balik visual saat layar ditekan, memberikan kesan tombol yang responsif dan nyata.
Baris 14-15: Script Setup; mendefinisikan 'modelValue' sebagai variabel untuk menampung data gambar dan 'emit' untuk mengirimkan hasil foto kembali ke formulir utama produk.
Baris 17-20: Pemicu Kamera; fungsi 'handleClip' secara otomatis membuat elemen input file tersembunyi. Properti 'capture="environment"' memerintahkan HP untuk langsung membuka kamera belakang (bukan sekadar galeri) saat kotak ditekan.
Baris 21-25: Pembaca File (FileReader); setelah foto diambil, sistem membaca data gambar mentah dari memori perangkat untuk diproses lebih lanjut secara asinkron.
Baris 26-28: Mesin Pengolah Gambar (Canvas); sistem membuat kanvas virtual berukuran 400x400 piksel. Gambar asli yang mungkin berukuran sangat besar akan digambar ulang ke dalam kanvas ini untuk diseragamkan ukurannya.
Baris 29-31: Kompresi & Output; hasil gambar di kanvas dikonversi menjadi format JPEG dengan kualitas 0.7 (70%). Teknik ini sangat krusial dalam aplikasi PWA agar database lokal (IndexedDB) tidak cepat penuh.
Baris 32-35: Pengiriman Data; hasil akhir berupa string teks (Base64) dikirimkan kembali ke komponen induk untuk disimpan bersama detail produk lainnya.
Baris 37: Eksekusi Input; perintah 'input.click()' adalah pemicu yang secara fisik memunculkan jendela pilihan kamera/file di layar pengguna. -->