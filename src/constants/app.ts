// src/constants/app.ts

export const APP_NAME = 'Sinar Pagi POS';

export const CATEGORIES_WITH_SERVICE = ['Minyak', 'Kurma', 'Madu', 'Kitab'];

export const PAYMENT_METHODS = [
  { id: 'Tunai', label: 'TUNAI', icon: 'ri-money-dollar-circle-line' },
  { id: 'QRIS', label: 'QRIS', icon: 'ri-qr-code-line' },
  { id: 'Tempo', label: 'TEMPO', icon: 'ri-calendar-todo-line' }
] as const;

export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  PENDING: 'pending',
  CANCELED: 'canceled'
} as const;

export const SCANNER_CONFIG = { 
  fps: 10, 
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0 
};