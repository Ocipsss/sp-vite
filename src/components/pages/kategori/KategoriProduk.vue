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

// LiveQuery Dexie to Observable (Auto-sync UI)
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
File ini adalah komponen KategoriProduk.vue yang berfungsi sebagai modul pengelola klasifikasi barang dalam aplikasi Sinar Pagi POS. Komponen ini memungkinkan pemilik toko untuk menambah atau menghapus kategori produk (seperti Snack, Minyak, atau Kurma) guna merapikan inventaris. Keunggulan teknis file ini adalah penggunaan "Live Query", yang berarti daftar kategori di layar akan otomatis bertambah atau berkurang secara instan tanpa perlu memuat ulang halaman (refresh) setiap kali ada perubahan data di database lokal.

PENJELASAN FUNGSI TIAP BARIS:
Baris 1-6: Header Halaman; menampilkan judul "Manajemen Kategori" dengan gaya tipografi tebal dan deskripsi singkat untuk memberikan konteks navigasi bagi pengguna.
Baris 8-26: Formulir Input Kategori; area kartu putih yang berisi kolom teks untuk mengetik nama kategori baru. Dilengkapi dengan fungsi '@keyup.enter' agar kasir bisa menekan tombol 'Enter' di keyboard untuk menyimpan data dengan cepat.
Baris 29-33: Label Status; menampilkan jumlah total kategori yang aktif saat ini secara dinamis (reactive counting).
Baris 35-51: Daftar Kategori (List); menggunakan 'transition-group' untuk memberikan efek animasi halus saat kategori baru muncul atau kategori lama dihapus. Setiap baris kategori dilengkapi dengan ikon label dan tombol hapus berwarna merah.
Baris 54-59: Tampilan Kosong (Empty State); bagian ini hanya akan muncul (v-if) jika database kategori benar-benar kosong, memberikan petunjuk visual berupa ikon transparan dan teks "Belum ada kategori".
Baris 63-68: Indikator Cloud Sync; memberikan kepastian visual kepada pengguna bahwa setiap kategori yang dibuat sedang dipantau oleh sistem sinkronisasi cloud melalui lampu indikator hijau yang berkedip.
Baris 72-78: Bagian Script; mengimpor fungsi 'liveQuery' dari Dexie dan 'useObservable' dari VueUse. Ini adalah teknologi yang membuat antarmuka (UI) selalu selaras dengan isi database secara real-time.
Baris 80: Variabel categoryName; menampung teks yang sedang diketik pengguna di kolom input.
Baris 83-86: liveQuery Logic; memerintahkan aplikasi untuk terus memantau tabel 'categories' di database. Jika ada perubahan data, variabel 'listCategories' akan otomatis diperbarui.
Baris 88-98: Fungsi addCategory; logika untuk menyimpan kategori baru ke database. Terdapat pengecekan (trim) untuk memastikan nama kategori tidak kosong sebelum disimpan.
Baris 100-107: Fungsi deleteCategory; memberikan konfirmasi keamanan (pop-up confirm) sebelum menghapus kategori dari sistem untuk mencegah ketidaksengajaan.
Baris 111-115: CSS Transition; mengatur animasi gerak 'geser ke kiri' saat data masuk dan 'geser ke kanan' saat data dihapus, memberikan pengalaman pengguna yang lebih elegan dan responsif. -->