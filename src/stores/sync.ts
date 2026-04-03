import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSyncStore = defineStore('sync', () => {
  const isSyncing = ref(false);
  const lastSyncTime = ref<Date | null>(null);

  const setSyncStatus = (status: boolean) => {
    isSyncing.value = status;
    if (!status) {
      lastSyncTime.value = new Date();
    }
  };

  return { isSyncing, lastSyncTime, setSyncStatus };
});
