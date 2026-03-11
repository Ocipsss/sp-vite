// src/composables/useAutoScroll.ts
import { ref, nextTick, watch, type Ref } from 'vue';

// Kita izinkan input berupa Ref atau Fungsi (Getter)
export function useAutoScroll(dataToWatch: Ref<any> | (() => any)) {
  const scrollContainer = ref<HTMLElement | null>(null);

  const scrollToBottom = () => {
    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTo({
          top: scrollContainer.value.scrollHeight,
          behavior: 'smooth',
        });
      }
    });
  };

  // Vue Watch sudah sangat cerdas, bisa menerima Ref atau Getter secara native
  watch(dataToWatch, () => {
    scrollToBottom();
  }, { deep: true });

  return {
    scrollContainer,
    scrollToBottom
  };
}