import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sp-dark': '#0f172a',    // Navy/Hitam (Background Sidebar)
        'sp-bg': '#f1f5f9',      // Abu-abu Terang (Background Utama)
        'sp-gold': '#fbbf24',    // Gold/Amber (Brand/Active Menu)
        'sp-blue': '#3b82f6',    // Biru (Aksi/Tombol Bayar)
        'sp-card': '#ffffff',    // Putih Bersih (Main Card/Produk)
        'sp-success': '#10b981', // Hijau (Stok Aman/Lunas)
        'sp-error': '#ef4444',   // Merah (Stok Habis/Hapus)
        'sp-muted': '#94a3b8',   // Slate (Teks Keterangan/Icon Mati)
      },
    },
  },
  plugins: [],
} as Config