import { ref, onBeforeUnmount } from 'vue';
import { Html5Qrcode } from "html5-qrcode";

export function useScanner() {
  let html5QrCode: Html5Qrcode | null = null;
  const isScanning = ref(false);

  const stopScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop();
        await html5QrCode.clear();
        html5QrCode = null;
        isScanning.value = false;
      } catch (err) {
        console.error("Gagal menghentikan scanner:", err);
      }
    }
  };

  const startScanner = async (
    elementId: string, 
    onScanSuccessCallback: (text: string) => void,
    onScanError?: (err: any) => void
  ) => {
    try {
      // Pastikan instance lama dibersihkan
      if (html5QrCode) await stopScanner();

      html5QrCode = new Html5Qrcode(elementId);
      isScanning.value = true;

      const config = { 
        fps: 10, 
        qrbox: { width: 350, height: 200 },
        aspectRatio: 1.333333
      };

      await html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        (decodedText) => {
          onScanSuccessCallback(decodedText);
        }, 
        () => { /* Ignored: Frame scan fail normal */ }
      );
    } catch (err) {
      console.error("Gagal memulai scanner:", err);
      isScanning.value = false;
      if (onScanError) onScanError(err);
      throw err;
    }
  };

  onBeforeUnmount(() => {
    stopScanner();
  });

  return {
    startScanner,
    stopScanner,
    isScanning
  };
}



// DESKRIPSI KESELURUHAN FILE:
// File ini adalah sebuah Composable kustom bernama useScanner yang berfungsi sebagai pembungkus (wrapper) logika pemindaian barcode menggunakan library html5-qrcode. File ini menangani seluruh siklus hidup kamera, mulai dari inisialisasi hardware, pengaturan area bidik (QR box), hingga pembersihan resource saat scanner tidak lagi digunakan. Dirancang khusus untuk aplikasi Sinar Pagi POS agar dapat berjalan dengan stabil di browser mobile, menggunakan kamera belakang sebagai input utama untuk memproses transaksi dengan cepat.

// PENJELASAN FUNGSI TIAP BARIS:
// Baris 1-2: Mengimpor fungsi reaktivitas Vue (ref, onBeforeUnmount) dan library inti Html5Qrcode untuk mengakses fungsi kamera perangkat.
// Baris 4: Ekspor fungsi useScanner yang merangkapsul seluruh logika pemindaian agar bisa digunakan kembali di berbagai komponen aplikasi.
// Baris 5-6: Inisialisasi variabel internal untuk menyimpan instance scanner dan variabel reaktif isScanning untuk melacak status aktif kamera.
// Baris 8: Definisi fungsi asinkron stopScanner; digunakan untuk mematikan kamera secara aman.
// Baris 9-13: Logika pemutusan koneksi kamera; menghentikan proses pemindaian (stop), membersihkan elemen visual (clear), dan mereset variabel ke kondisi awal.
// Baris 14-16: Blok penanganan error untuk mencatat kegagalan jika browser menolak perintah penghentian kamera.
// Baris 20-24: Definisi fungsi startScanner; menerima parameter ID elemen HTML, fungsi callback saat sukses memindai, dan fungsi opsional saat terjadi error.
// Baris 27: Logika keamanan; memastikan jika ada sesi scanner lama yang masih menggantung, akan dimatikan terlebih dahulu sebelum memulai yang baru.
// Baris 29-30: Membuat instance baru dari Html5Qrcode pada elemen yang ditentukan dan mengubah status isScanning menjadi true.
// Baris 32-36: Konfigurasi teknis scanner; mengatur frame per second (FPS) ke 10 agar hemat baterai, menentukan ukuran kotak bidik (QR box), serta mengatur rasio tampilan kamera ke 4:3 (1.33).
// Baris 38-40: Menjalankan perintah start dengan parameter 'facingMode: environment' untuk memaksa penggunaan kamera belakang (kamera utama ponsel).
// Baris 41-43: Menghubungkan teks hasil pemindaian (decodedText) ke fungsi callback yang dikirim oleh komponen pemanggil (misal: untuk mencari barang di database).
// Baris 46-51: Blok penanganan error; jika kamera gagal diakses (misal: izin ditolak pengguna), status akan direset dan error akan dilempar kembali ke sistem.
// Baris 54-56: Lifecycle Hook onBeforeUnmount; memastikan kamera otomatis mati saat pengguna berpindah halaman untuk mencegah kebocoran memori dan penggunaan baterai yang tidak perlu.
// Baris 58-62: Mengembalikan (return) fungsi start, stop, dan status scanning agar dapat diakses oleh komponen UI.