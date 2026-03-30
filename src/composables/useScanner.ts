import { ref } from 'vue';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export function useScanner() {
  let html5QrCode: Html5Qrcode | null = null;
  const isScanning = ref(false);

  const stopScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop();
        // Beri jeda sedikit untuk hardware release kamera
        await new Promise((resolve) => setTimeout(resolve, 100));
        html5QrCode.clear();
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
      if (html5QrCode) await stopScanner();

      html5QrCode = new Html5Qrcode(elementId);
      isScanning.value = true;

      // Konfigurasi Responsif
      const config = { 
        fps: 15, // Ditingkatkan sedikit agar lebih smooth
        // qrbox dinamis: 80% dari lebar area, tinggi disesuaikan untuk barcode
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const boxWidth = Math.floor(minEdge * 0.8);
          return { 
            width: boxWidth, 
            height: Math.floor(boxWidth * 0.6) // Rasio kotak persegi panjang cocok untuk barcode
          };
        },
        aspectRatio: 1.0, // Match dengan aspect-square di UI
        formatsToSupport: [ 
          Html5QrcodeSupportedFormats.EAN_13, 
          Html5QrcodeSupportedFormats.EAN_8, 
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_128 
        ]
      };

      await html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        (decodedText) => {
          onScanSuccessCallback(decodedText);
        }, 
        () => { /* Frame scan fail normal */ }
      );
    } catch (err) {
      console.error("Gagal memulai scanner:", err);
      isScanning.value = false;
      if (onScanError) onScanError(err);
      throw err;
    }
  };

  return {
    startScanner,
    stopScanner,
    isScanning
  };
}
