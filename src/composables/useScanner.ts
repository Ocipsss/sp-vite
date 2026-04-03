import { ref } from 'vue';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { SCANNER_CONFIG } from '@/constants/app';

export function useScanner() {
  let html5QrCode: Html5Qrcode | null = null;
  const isScanning = ref(false);

  const stopScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop();
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

      const config = { 
        ...SCANNER_CONFIG,
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
        () => {}
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
