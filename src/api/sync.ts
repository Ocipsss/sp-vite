// src/api/sync.ts
import { ref, set, remove, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";
import { fdb } from "./firebase";
import { db } from "../database";

let isSyncing = false;

const syncToCloud = async (table: string, id: string | number, data: any) => {
  if (isSyncing) return;
  try {
    const itemRef = ref(fdb, `${table}/${id}`);
    if (data === null) {
      await remove(itemRef);
    } else {
      const cleanData = JSON.parse(JSON.stringify(data));
      await set(itemRef, cleanData);
    }
  } catch (e) {
    console.warn(`Sync Cloud Gagal [${table}]:`, e);
  }
};

export const setupSyncHooks = () => {
  const allTables = ['products', 'product_packages', 'categories', 'transactions', 'members', 'expenses', 'digital_transactions', 'services', 'settings'];

  allTables.forEach((tableName) => {
    const table = (db as any)[tableName];
    
    table.hook('creating', (pk: any, obj: any) => {
      syncToCloud(tableName, pk || obj.id, obj);
    });

    table.hook('updating', (mods: any, pk: any, obj: any) => {
      syncToCloud(tableName, pk, { ...obj, ...mods });
    });

    table.hook('deleting', (pk: any) => {
      syncToCloud(tableName, pk, null);
    });
  });
}; // <--- INI PENTING: Tutup fungsi setupSyncHooks di sini

export const startPullSync = () => { // <--- Sekarang fungsi ini berdiri sendiri dan bisa di-export
  const allTables = ['products', 'product_packages', 'categories', 'transactions', 'members', 'expenses', 'digital_transactions', 'services', 'settings'];

  allTables.forEach(tableName => {
    const tableRef = ref(fdb, tableName);
    const table = (db as any)[tableName];

    onChildAdded(tableRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        isSyncing = true; 
        await table.put(data); 
        isSyncing = false;
      }
    });

    onChildChanged(tableRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        isSyncing = true; 
        await table.put(data); 
        isSyncing = false;
      }
    });

    onChildRemoved(tableRef, async (snapshot) => {
      const id = snapshot.key;
      if (id) {
        const targetId = isNaN(Number(id)) ? id : Number(id);
        isSyncing = true; 
        await table.delete(targetId); 
        isSyncing = false;
      }
    });
  });
};