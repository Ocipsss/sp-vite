import { ref, nextTick, watch, type Ref } from 'vue';

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

  watch(dataToWatch, () => {
    scrollToBottom();
  }, { deep: true });

  return {
    scrollContainer,
    scrollToBottom
  };
}
