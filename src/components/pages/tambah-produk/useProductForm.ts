import { ref, watch, onMounted } from 'vue';
import { db } from '@/database';

export function useProductForm() {
  const isSaving = ref(false);
  const listCategories = ref<any[]>([]);
  const allProducts = ref<any[]>([]);
  const suggestions = ref<any[]>([]);
  const showSuggestions = ref(false);
  const isExistingProduct = ref(false);

  const displayModal = ref("");
  const displaySell = ref("");
  const displayPack = ref("");

  const product = ref({
    id: '', image: null as string | null, name: '', code: '',
    category: 'Umum', unit: 'pcs', price_modal: 0, price_sell: 0,
    qty: 0, pack_price: 0, pack_size: 1 as number | null
  });

  const formatDisplay = (val: number) => {
    if (!val || val === 0) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const updateNumber = (field: 'price_modal' | 'price_sell' | 'pack_price', val: number) => {
    product.value[field] = val;
    if (field === 'price_modal') displayModal.value = formatDisplay(val);
    if (field === 'price_sell') displaySell.value = formatDisplay(val);
    if (field === 'pack_price') {
      displayPack.value = formatDisplay(val);
      if (product.value.pack_size && product.value.pack_size > 0) {
        const unitModal = Math.round(val / product.value.pack_size);
        product.value.price_modal = unitModal;
        displayModal.value = formatDisplay(unitModal);
      }
    }
  };

  const selectProduct = (p: any) => {
    product.value = { 
      ...p, 
      qty: 0,
      id: p.id 
    };
    displayModal.value = formatDisplay(p.price_modal);
    displaySell.value = formatDisplay(p.price_sell);
    isExistingProduct.value = true;
    showSuggestions.value = false;
  };

  const resetForm = () => {
    product.value = {
      id: '', image: null, name: '', code: '',
      category: 'Umum', unit: 'pcs', price_modal: 0, price_sell: 0,
      qty: 0, pack_price: 0, pack_size: 1
    };
    displayModal.value = "";
    displaySell.value = "";
    displayPack.value = "";
    isExistingProduct.value = false;
    showSuggestions.value = false;
  };

  watch(() => product.value.name, (newName) => {
    if (isExistingProduct.value) return;
    
    const query = newName.toLowerCase().trim();
    
    if (query.length >= 1) {
      const filtered = allProducts.value
        .filter(p => p.name.toLowerCase().includes(query))
        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          const startA = nameA.startsWith(query);
          const startB = nameB.startsWith(query);
          if (startA && !startB) return -1;
          if (!startA && startB) return 1;
          return nameA.localeCompare(nameB);
        });

      suggestions.value = filtered.slice(0, 8);
      showSuggestions.value = suggestions.value.length > 0;
    } else {
      showSuggestions.value = false;
    }
  });

  watch(() => product.value.code, (newCode) => {
    if (newCode && !isExistingProduct.value) {
      const exist = allProducts.value.find(p => p.code === newCode);
      if (exist) selectProduct(exist);
    }
  });

  const saveProduct = async () => {
    if(!product.value.name || !product.value.price_sell) return alert("Nama dan Harga Jual wajib diisi!");
    isSaving.value = true;
    try {
      if (isExistingProduct.value) {
        const oldProduct = allProducts.value.find(p => p.id === product.value.id);
        const totalQty = (oldProduct?.qty || 0) + product.value.qty;
        await db.table('products').update(product.value.id, { 
          ...product.value, 
          qty: totalQty,
          updatedAt: new Date().toISOString() 
        });
      } else {
        const finalId = 'SP-' + Date.now().toString(36);
        await db.table('products').add({ 
          ...product.value, 
          id: finalId, 
          updatedAt: new Date().toISOString() 
        });
      }
      alert("Berhasil Disimpan!");
      resetForm();
      allProducts.value = await db.table('products').toArray();
    } catch (err: any) { 
      alert("Gagal: " + err.message); 
    } finally { 
      isSaving.value = false; 
    }
  };

  onMounted(async () => {
    const [cats, prods] = await Promise.all([
      db.table('categories').toArray(),
      db.table('products').toArray()
    ]);
    listCategories.value = cats;
    allProducts.value = prods;
  });

  return { 
    product, isSaving, listCategories, displayModal, displaySell, displayPack, 
    suggestions, showSuggestions, isExistingProduct,
    updateNumber, saveProduct, selectProduct, resetForm 
  };
}
