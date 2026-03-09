// src/composables/useProductSearch.ts
import { ref } from 'vue';
import { db } from '../database';

export function useProductSearch() {
  const suggestions = ref<any[]>([]);
  const isFocused = ref(false);

  // Fungsi Highlight (Identik dengan script Anda)
  const highlightText = (text: string, query: string) => {
    const search = query.trim();
    if (!search) return text;
    const safeQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safeQuery})`, 'gi');
    return text.replace(regex, '<span class="text-blue-600 font-black">$1</span>');
  };

  // Logika Pintar Fetch Suggestions (Identik: startsWith -> localeCompare -> slice 8)
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 1) {
      suggestions.value = [];
      return;
    }

    const search = query.toLowerCase().trim();
    
    const allMatches = await db.table('products')
      .filter(p => p.name.toLowerCase().includes(search))
      .toArray();

    suggestions.value = allMatches.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(search);
      const bStarts = bName.startsWith(search);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    }).slice(0, 8);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
    }).format(val || 0);
  };

  return {
    suggestions,
    isFocused,
    fetchSuggestions,
    highlightText,
    formatRupiah
  };
}