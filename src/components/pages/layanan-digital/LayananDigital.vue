<script setup>
import { useDigitalService } from './useDigitalService';
import { formatRupiah, capitalize } from '@/utils/formatters';

const { form, estimatedCash, saveTransaction } = useDigitalService();
</script>

<template>
    <div class="w-full flex flex-col gap-4 py-2 animate-zoom-in">
        <div class="w-full bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            
            <div class="flex bg-gray-100 p-1.5 rounded-2xl mb-8 gap-2">
                <button @click="form.type = 'topup'" 
                    :class="form.type === 'topup' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400'" 
                    class="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none">
                    TOP UP
                </button>
                <button @click="form.type = 'tariktunai'" 
                    :class="form.type === 'tariktunai' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400'" 
                    class="flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none">
                    TARIK TUNAI
                </button>
            </div>

            <div class="flex flex-col gap-5">
                <div>
                    <label class="text-[8px] font-black text-gray-400 ml-1 uppercase">Layanan / Provider</label>
                    <input v-model="form.provider" type="text" placeholder="DANA, OVO, BRI..." 
                        @input="form.provider = form.provider.toUpperCase()"
                        class="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl text-[12px] font-black text-gray-800 outline-none uppercase">
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[8px] font-black text-gray-400 ml-1 uppercase">Nominal</label>
                        <input v-model="form.nominal" type="number" class="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl text-[14px] font-black text-blue-600 outline-none">
                    </div>
                    <div>
                        <label class="text-[8px] font-black text-gray-400 ml-1 uppercase">Biaya Admin</label>
                        <input v-model="form.adminFee" type="number" class="w-full p-4 mt-1 bg-gray-50 border-none rounded-2xl text-[14px] font-black text-gray-800 outline-none">
                    </div>
                </div>

                <div :class="form.type === 'topup' ? 'bg-blue-600 border-blue-500' : 'bg-orange-500 border-orange-400'" 
                    class="p-5 rounded-[1.8rem] shadow-xl border mt-2 transition-colors duration-500">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-[8px] font-black text-white/70 uppercase">Estimasi Kas Fisik</span>
                        <div class="px-2 py-0.5 bg-white/20 rounded text-[7px] font-black text-white uppercase">
                            {{ form.type === 'topup' ? 'IN' : 'OUT' }}
                        </div>
                    </div>
                    
                    <div class="text-2xl font-black text-white tracking-tighter">
                        {{ formatRupiah(estimatedCash) }} 
                    </div>
                    <p class="text-[8px] font-medium text-white/50 uppercase mt-2 italic">*Otomatis menyesuaikan laci kas</p>
                </div>

                <button @click="saveTransaction" 
                    class="w-full py-4.5 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl mt-2 active:scale-95 transition-all">
                    SIMPAN TRANSAKSI
                </button>
            </div>
        </div>
    </div>
</template>
