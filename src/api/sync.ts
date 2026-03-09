// src/api/sync.ts
import { ref, set, remove, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";
import { fdb } from "./firebase";
import { db } from "../database";
import { DB_TABLES } from "../database/schema"; // Import daftar tabel pusat

let isSyncing = false;

// --- 1. LOGIKA PUSH: DARI LOKAL KE CLOUD ---
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
  // Menggunakan DB_TABLES dari schema.ts
  DB_TABLES.forEach((tableName) => {
    const table = (db as any)[tableName];
    if (!table) return;
    
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
};

// --- 2. LOGIKA PULL: DARI CLOUD KE LOKAL ---
export const startPullSync = () => {
  // Menggunakan DB_TABLES dari schema.ts
  DB_TABLES.forEach(tableName => {
    const tableRef = ref(fdb, tableName);
    const table = (db as any)[tableName];
    if (!table) return;

    const prepareData = (snapshot: any) => {
      const val = snapshot.val();
      if (!val) return null;
      return {
        ...val,
        id: val.id || snapshot.key 
      };
    };

    onChildAdded(tableRef, async (snapshot) => {
      const data = prepareData(snapshot);
      if (data) {
        try {
          isSyncing = true; 
          await table.put(data); 
          console.log(`[SYNC] Pulling ${tableName}: ${data.name || data.id}`);
        } catch (err) {
          console.error(`[SYNC ERROR] Gagal simpan ${tableName}:`, err);
        } finally {
          isSyncing = false;
        }
      }
    });

    onChildChanged(tableRef, async (snapshot) => {
      const data = prepareData(snapshot);
      if (data) {
        isSyncing = true; 
        await table.put(data); 
        isSyncing = false;
      }
    });

    onChildRemoved(tableRef, async (snapshot) => {
      const id = snapshot.key;
      if (id) {
        isSyncing = true; 
        await table.delete(id); 
        isSyncing = false;
      }
    });
  });
};