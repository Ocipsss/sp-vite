import { ref as fRef, set, remove, onChildAdded, onChildChanged, onChildRemoved } from "firebase/database";
import { fdb } from "./firebase";
import { db, DB_TABLES } from "@/database";
import { deepCopy } from "@/utils/formatters";
import { useSyncStore } from "@/stores/sync";

// Helper agar tidak perlu memanggil useSyncStore berkali-kali di dalam loop
const getSyncStore = () => useSyncStore();

const syncToCloud = async (table: string, id: string | number, data: any) => {
  const syncStore = getSyncStore();
  
  if (syncStore.isSyncing) return;

  try {
    const itemRef = fRef(fdb, `${table}/${id}`);
    if (data === null) {
      await remove(itemRef);
    } else {
      const cleanData = deepCopy(data);
      await set(itemRef, cleanData);
    }
  } catch (e) {
    console.warn(`Sync Cloud Gagal [${table}]:`, e);
  }
};

export const setupSyncHooks = () => {
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

export const startPullSync = () => {
  const syncStore = getSyncStore();

  DB_TABLES.forEach(tableName => {
    const tableRef = fRef(fdb, tableName);
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
          syncStore.setSyncStatus(true); // LOCK
          await table.put(data); 
          console.log(`[SYNC] Pulling ${tableName}: ${data.name || data.id}`);
        } catch (err) {
          console.error(`[SYNC ERROR] Gagal simpan ${tableName}:`, err);
        } finally {
          syncStore.setSyncStatus(false); // UNLOCK
        }
      }
    });

    onChildChanged(tableRef, async (snapshot) => {
      const data = prepareData(snapshot);
      if (data) {
        try {
          syncStore.setSyncStatus(true);
          await table.put(data); 
        } finally {
          syncStore.setSyncStatus(false);
        }
      }
    });

    onChildRemoved(tableRef, async (snapshot) => {
      const id = snapshot.key;
      if (id) {
        try {
          syncStore.setSyncStatus(true);
          await table.delete(id); 
        } finally {
          syncStore.setSyncStatus(false);
        }
      }
    });
  });
};
