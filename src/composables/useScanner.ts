// src/composables/useScanner.ts
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
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0 
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