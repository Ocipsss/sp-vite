<template>
  <div class="space-y-1.5 px-1 mt-1">
    <label class="text-[10px] font-black uppercase tracking-widest block ml-1" :class="labelClass">{{ label }}</label>
    <div class="relative flex items-center h-14 rounded-2xl border px-5 transition-all" :class="containerClass">
      <span class="font-bold mr-1.5 opacity-50">Rp</span>
      <input 
        :value="displayValue" 
        @input="handleInput"
        type="text" inputmode="numeric" 
        class="flex-1 bg-transparent border-none outline-none font-black p-0 m-0 w-full"
        :class="inputClass"
        placeholder="0"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['label', 'displayValue', 'labelClass', 'containerClass', 'inputClass']);
const emit = defineEmits(['update']);

const handleInput = (e: any) => {
  const raw = e.target.value.replace(/\D/g, "");
  emit('update', parseInt(raw) || 0);
};
</script>
