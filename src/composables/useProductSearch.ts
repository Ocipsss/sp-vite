import { ref } from 'vue';
import { db } from '@/database';
import { highlightText, formatRupiah } from '@/utils/formatters';

export function useProductSearch() {
  const suggestions = ref<any[]>([]);
  const isFocused = ref(false);

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

  return {
    suggestions,
    isFocused,
    fetchSuggestions,
    highlightText,
    formatRupiah
  };
}
