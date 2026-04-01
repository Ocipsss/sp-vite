import { ref, nextTick, watch, type Ref } from 'vue';

// Kita izinkan input berupa Ref atau Fungsi (Getter)
export function useAutoScroll(dataToWatch: Ref<any> | (() => any)) {
  const scrollContainer = ref<HTMLElement | null>(null);

  const scrollToBottom = () => {
    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
          top: scrollContainer.value.scrollHeight,
          behavior: 'smooth',
        });
      }
    });
  };

  // Vue Watch sudah sangat cerdas, bisa menerima Ref atau Getter secara native
  watch(dataToWatch, () => {
    scrollToBottom();
  }, { deep: true });

  return {
    scrollContainer,
    scrollToBottom
  };
}



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah sebuah Composable kustom bernama useAutoScroll yang berfungsi untuk menangani logika gulir otomatis (auto-scroll) pada elemen kontainer di aplikasi Sinar Pagi POS. Kegunaan utamanya adalah untuk memastikan bahwa setiap kali ada data baru yang masuk (seperti saat barang ditambahkan ke keranjang belanja), layar akan secara otomatis bergeser ke bagian paling bawah. Komposabel ini dirancang fleksibel sehingga dapat memantau perubahan data baik dalam bentuk variabel reaktif (Ref) maupun fungsi pengambil data (Getter).

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1: Mengimpor fungsi inti dari Vue seperti ref untuk reaktivitas, nextTick untuk menunggu render DOM selesai, watch untuk memantau perubahan data, dan tipe Ref untuk validasi TypeScript.
// Baris 4: Ekspor fungsi useAutoScroll yang menerima parameter dataToWatch; parameter ini bisa berupa objek reaktif atau fungsi yang mengembalikan data.
// Baris 5: Inisialisasi variabel scrollContainer sebagai referensi ke elemen HTML (DOM) yang akan diberikan aksi gulir.
// Baris 7: Definisi fungsi scrollToBottom; logika utama untuk menggerakkan posisi gulir ke titik paling bawah.
// Baris 8: Penggunaan nextTick; memastikan perintah gulir dijalankan hanya setelah Vue selesai memperbarui tampilan (DOM) dengan data terbaru.
// Baris 9-14: Logika pengecekan elemen; jika kontainer ditemukan, lakukan perintah .scrollTo ke koordinat scrollHeight (tinggi total konten) dengan efek transisi 'smooth' agar pergerakan terlihat halus.
// Baris 19-21: Penggunaan fungsi watch; memantau dataToWatch secara mendalam (deep: true) agar setiap ada perubahan pada isi array atau objek, fungsi scrollToBottom langsung dipicu.
// Baris 23-26: Mengembalikan (return) variabel scrollContainer dan fungsi scrollToBottom agar dapat digunakan di dalam komponen Vue (seperti pada daftar barang di halaman Penjualan).