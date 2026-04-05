<template>
  <div class="flex flex-col items-center mb-2">
    <div @click="handleClip" class="w-40 h-40 bg-slate-50 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 relative cursor-pointer active:scale-95 transition-transform">
      <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover">
      <div v-else class="text-center text-slate-400 p-4">
        <i class="ri-camera-lens-line text-4xl"></i>
        <span class="block text-[10px] mt-2 uppercase font-black tracking-widest">Foto Produk</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const handleClip = () => {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400; canvas.height = 400;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 400, 400);
        emit('update:modelValue', canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  };
  input.click();
};
</script>
