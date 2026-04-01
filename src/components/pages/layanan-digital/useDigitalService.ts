import { ref, computed } from 'vue';
import { calculateDigitalPhysicalCash } from '@/utils/calculators';
import { db } from '@/database'; 
import type { TransactionType } from '@/types'; 

interface DigitalForm {
    type: 'topup' | 'tariktunai';
    provider: string;
    nominal: number | null;
    adminFee: number;
    adminPaymentMethod: 'cash' | 'digital';
}

export function useDigitalService() {
    const form = ref<DigitalForm>({
        type: 'topup',
        provider: '', 
        nominal: null,
        adminFee: 2000,
        adminPaymentMethod: 'cash'
    });

    const estimatedCash = computed(() => {
        const nominal = Number(form.value.nominal || 0);
        const fee = Number(form.value.adminFee || 0);

        if (form.value.adminPaymentMethod === 'digital') {
            return form.value.type === 'topup' ? nominal : -nominal;
        }

        return calculateDigitalPhysicalCash(
            form.value.type,
            nominal,
            fee
        );
    });

    const saveTransaction = async () => {
        if (!form.value.provider || !form.value.nominal) {
            return alert("Lengkapi data!");
        }
        
        const doc = {
            date: new Date().toISOString(),
            ...form.value,
            provider: form.value.provider.toUpperCase(),
            nominal: Number(form.value.nominal),
            adminFee: Number(form.value.adminFee),
            profit: Number(form.value.adminFee) 
        };

        try {
            await (db as any).digital_transactions.add(doc);
            alert("Transaksi Berhasil!");
            resetForm();
        } catch (err: any) { 
            alert("Error: " + (err.message || "Gagal menyimpan transaksi")); 
        }
    };

    const resetForm = () => {
        form.value = { 
            type: 'topup', 
            provider: '', 
            nominal: null, 
            adminFee: 2000, 
            adminPaymentMethod: 'cash' 
        };
    };

    return { form, estimatedCash, saveTransaction };
}
