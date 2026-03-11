<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click')"
    :class="[
      'flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100',
      variantClasses,
      sizeClasses,
      block ? 'w-full' : ''
    ]"
  >
    <i v-if="loading" class="ri-loader-4-line animate-spin"></i>
    <i v-else-if="icon" :class="icon"></i>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: { type: String as () => 'button' | 'submit', default: 'button' },
  variant: { type: String as () => 'primary' | 'secondary' | 'danger' | 'ghost', default: 'primary' },
  size: { type: String as () => 'sm' | 'md' | 'lg', default: 'md' },
  icon: String,
  disabled: Boolean,
  loading: Boolean,
  block: Boolean
});

defineEmits(['click']);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-blue-600 text-white shadow-lg shadow-blue-200';
    case 'secondary': return 'bg-slate-900 text-white';
    case 'danger': return 'bg-red-50 text-red-600 border border-red-100';
    case 'ghost': return 'bg-transparent text-slate-500 hover:bg-slate-100';
    default: return '';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-3 py-1.5 rounded-xl text-[10px] font-bold';
    case 'lg': return 'px-6 py-4 rounded-[1.5rem] text-[14px] font-black tracking-widest';
    default: return 'px-4 py-3 rounded-2xl text-[12px] font-black';
  }
});
</script>