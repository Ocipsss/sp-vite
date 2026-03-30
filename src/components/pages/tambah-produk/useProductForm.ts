import { ref, watch, onMounted } from 'vue';
import { db } from '@/database';

export function useProductForm() {
  const isSaving = ref(false);
  const listCategories = ref<any[]>([]);
  const displayModal = ref("");
  const displaySell = ref("");
  const displayPack = ref("");

  const product = ref({
    id: '', image: null as string | null, name: '', code: '',
    category: 'Umum', unit: 'pcs', price_modal: 0, price_sell: 0,
    qty: 0, pack_price: 0, pack_size: 1 as number | null
  });

  const formatDisplay = (val: number) => {
    if (!val) return "";
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

  const saveProduct = async () => {
    if(!product.value.name || !product.value.price_sell) return alert("Nama dan Harga Jual wajib diisi!");
    isSaving.value = true;
    try {
      const finalId = 'SP-' + Date.now().toString(36);
      await db.products.add({ ...JSON.parse(JSON.stringify(product.value)), id: finalId, updatedAt: new Date().toISOString() });
      alert("Produk Berhasil Disimpan!");
      location.reload(); // Simple reset
    } catch (err: any) { alert("Gagal: " + err.message); }
    finally { isSaving.value = false; }
  };

  onMounted(async () => { listCategories.value = await db.categories.toArray(); });

  return { product, isSaving, listCategories, displayModal, displaySell, displayPack, updateNumber, saveProduct };
}
