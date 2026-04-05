import { TRANSACTION_STATUS } from '../constants/app';

export const highlightText = (text: string, query: string): string => {
  const search = query.trim();
  if (!search) return text;
  const safeQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return text.replace(regex, '<span class="text-blue-600 font-black">$1</span>');
};

export const capitalize = (text: string): string => {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const truncateText = (text: string, limit: number = 20): string => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

export const formatRupiah = (val: number | string): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(Number(val) || 0);
};

export const formatNumber = (val: number | string): string => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(Number(val) || 0);
};

export const parseRawNumber = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string') return 0;
  return parseInt(val.replace(/\D/g, ""), 10) || 0;
};


export const formatTransactionStatus = (status: string): string => {
  if (!status) return "-";
  
  const statusMap: Record<string, string> = {
    [TRANSACTION_STATUS.SUCCESS]: 'LUNAS',
    [TRANSACTION_STATUS.PENDING]: 'TEMPO',
    [TRANSACTION_STATUS.CANCELED]: 'BATAL',
    
    'partial': 'CICILAN',
    'overdue': 'JATUH TEMPO',
    'unpaid': 'BELUM LUNAS',
    'paid': 'LUNAS',
    'tempo': 'TEMPO',
    'hutang': 'PIUTANG'
  };
  
  return statusMap[status.toLowerCase()] || status.toUpperCase();
};

export const formatMemberId = (id: string): string => {
  if (!id) return "-";
  const cleanId = id.toUpperCase().startsWith('SP-') ? id : `SP-${id}`;
  return cleanId.toUpperCase();
};

export const formatPhone = (phone: string): string => {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{1,})$/);
  if (match) return `${match[1]}-${match[2]}-${match[3]}`;
  return phone;
};

export const formatPoints = (val: number | string): string => {
  return (Number(val) || 0).toLocaleString('id-ID') + " Pts";
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return "-";
  try {
    return new Date(date).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch (e) {
    return "-";
  }
};

export const cleanBarcode = (code: string): string => {
  return code ? code.trim().replace(/[^a-zA-Z0-9]/g, "") : "";
};

export const deepCopy = <T>(data: T): T => {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
};
