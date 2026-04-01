<template>
  <div class="flex flex-col gap-4 pb-24">
    <div class="px-4 mt-2">
      <h1 class="text-xl font-black text-slate-800 uppercase tracking-tighter">Manajemen Kategori</h1>
      <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kelola kategori produk retail Anda</p>
    </div>

    <div class="mx-4 p-5 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tambah Kategori</label>
      <div class="flex items-stretch gap-2 h-12">
        <input 
          v-model="categoryName" 
          @keyup.enter="addCategory"
          type="text" 
          class="flex-1 bg-slate-50 border border-slate-100 px-4 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700" 
          placeholder="Snack, Minyak, Kurma..."
        >
        
        <BaseButton 
          variant="primary"
          icon="ri-add-fill"
          class="rounded-xl px-5"
          @click="addCategory" 
        />
      </div>
    </div>

    <div class="flex flex-col gap-2 px-4">
      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block">
        Kategori Aktif ({{ listCategories?.length || 0 }})
      </label>
      
      <transition-group name="list" tag="div" class="flex flex-col gap-2">
        <div v-for="cat in listCategories || []" :key="cat.id" 
          class="p-4 bg-white rounded-2xl border border-slate-50 flex justify-between items-center shadow-sm hover:border-blue-100 transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <i class="ri-price-tag-3-fill text-lg"></i>
            </div>
            <span class="font-bold text-slate-700 uppercase text-xs tracking-tight">{{ cat.name }}</span>
          </div>
          
          <button 
            @click="deleteCategory(cat.id)" 
            class="w-10 h-10 flex items-center justify-center text-red-400 bg-red-50 rounded-xl active:bg-red-500 active:text-white transition-all"
          >
            <i class="ri-delete-bin-7-line text-lg"></i>
          </button>
        </div>
      </transition-group>

      <div v-if="listCategories && listCategories.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-300">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
          <i class="ri-price-tag-3-line text-3xl opacity-20"></i>
        </div>
        <p class="text-[10px] italic uppercase font-black tracking-widest">Belum ada kategori</p>
      </div>
    </div>
    
    <div class="px-4 text-center mt-4">
      <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 bg-slate-100 w-fit mx-auto px-3 py-1.5 rounded-full">
        <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        Cloud Sync Active
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { db } from "@/database";
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { Observable } from 'rxjs';
import BaseButton from "@/common/BaseButton.vue";

const categoryName = ref('');

const listCategories = useObservable(
  (liveQuery(() => db.categories.toArray()) as unknown) as Observable<any[]>
);

const addCategory = async () => {
  const name = categoryName.value.trim();
  if (!name) return;

  try {
    await db.categories.add({ name });
    categoryName.value = ''; 
  } catch (err) {
    console.error("Gagal menambah kategori:", err);
  }
};

const deleteCategory = async (id: number | undefined) => {
  if (!id || !confirm("Hapus kategori ini?")) return;
  try {
    await db.categories.delete(id);
  } catch (err) {
    console.error("Gagal menghapus kategori:", err);
  }
};
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateX(-20px); }
.list-leave-to { opacity: 0; transform: translateX(20px); }
</style>



<!-- DESKRIPSI KESELURUHAN FILE:
File ini adalah komponen Manajemen Kategori (CategoryManagement.vue) yang berfungsi sebagai pusat pengaturan klasifikasi produk dalam ekosistem Sinar Pagi POS. Komponen ini dirancang dengan antarmuka yang bersih dan minimalis, memungkinkan pemilik toko untuk menambah atau menghapus kategori barang (seperti "Snack", "Minuman", dll) secara instan. Fitur unggulannya adalah penggunaan "Live Query" dari Dexie.js dan RxJS yang membuat daftar kategori bersifat reaktif secara otomatis—artinya, setiap perubahan data di database akan langsung tercermin di layar tanpa perlu memuat ulang halaman (reload), lengkap dengan animasi transisi yang halus untuk pengalaman pengguna yang lebih premium.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-7: Header Halaman; menampilkan judul utama "Manajemen Kategori" dan sub-teks instruksi dengan tipografi uppercase yang konsisten dengan gaya desain retail Sinar Pagi.
Baris 9-27: Area Input Kategori; wadah kartu putih (card) yang berisi field teks untuk mengetik nama kategori baru. Mendukung aksi tekan tombol "Enter" (keyup.enter) atau klik tombol "Plus" untuk menyimpan data.
Baris 29-33: Label Status; menampilkan jumlah total kategori yang aktif saat ini secara dinamis berdasarkan panjang array data.
Baris 35-51: Iterasi Daftar Kategori (v-for); merender setiap kategori dalam sebuah baris yang dilengkapi dengan ikon tag biru dan tombol hapus berwarna merah. Dibungkus dengan <transition-group> untuk memberikan efek animasi masuk/keluar.
Baris 53-59: State Kosong (Empty State); menampilkan ilustrasi ikon tag yang transparan dan teks miring jika database kategori masih kosong, memberikan panduan visual bagi pengguna baru.
Baris 62-67: Indikator Cloud Sync; menampilkan status sinkronisasi awan dengan titik hijau berkedip (pulse) untuk memberi kepastian bahwa data tersimpan dengan aman di sistem cloud.
Baris 71-76: Impor Modul; mengambil fungsi reaktivitas Vue, koneksi database Dexie, dan pustaka RxJS/VueUse untuk mengaktifkan pemantauan data secara live (liveQuery).
Baris 78: State categoryName; variabel reaktif untuk menampung teks yang sedang diketik pengguna di kolom input kategori.
Baris 80-82: Variable listCategories; menggunakan useObservable untuk memantau tabel 'categories' di database secara terus-menerus dan memperbarui UI secara otomatis saat data berubah.
Baris 84-95: Fungsi addCategory; logika asinkron untuk memvalidasi input (tidak boleh kosong) dan menyimpan nama kategori baru ke database lokal sebelum mengosongkan kembali kolom input.
Baris 97-104: Fungsi deleteCategory; memproses penghapusan data berdasarkan ID unik kategori dengan tambahan proteksi konfirmasi (pop-up) untuk mencegah penghapusan yang tidak sengaja.
Baris 108-112: Animasi CSS; mendefinisikan transisi '.list' untuk memberikan efek geser (slide) dan memudar (fade) saat sebuah kategori ditambah atau dihapus dari daftar. -->