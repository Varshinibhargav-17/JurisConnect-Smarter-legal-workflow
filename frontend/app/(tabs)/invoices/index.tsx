import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, StatusBar } from "react-native";
import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { API_BASE_URL } from '@/config';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { authStore } from '@/constants/authStore';

export default function InvoicesList() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [showStatusPicker, setShowStatusPicker] = useState(false);

    const statuses = ['Draft', 'Sent', 'Paid', 'Overdue'];

    const fetchInvoices = useCallback(() => {
        const userId = authStore.user?.id;
        if (!userId) {
            router.replace("/(auth)/login");
            return;
        }

        fetch(`${API_BASE_URL}/invoices?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setInvoices(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching invoices:", err);
                setLoading(false);
            });
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchInvoices();
        }, [fetchInvoices])
    );

    const updateInvoiceStatus = async (newStatus: string) => {
        if (!selectedInvoice) return;

        try {
            const res = await fetch(`${API_BASE_URL}/invoices/${selectedInvoice.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchInvoices();
                setShowStatusPicker(false);
            }
        } catch (err) {
            console.error("Error updating invoice status:", err);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#f8fafc]">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* HEADER */}
            <View className="bg-white px-6 pt-16 pb-6 border-b border-slate-100 shadow-sm flex-row items-center justify-between">
                <View>
                    <Text className="text-slate-900 text-2xl font-bold tracking-tight">Invoices</Text>
                    <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Billing & Accounts</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/invoices/add-invoice")}
                    className="bg-indigo-600 w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-indigo-200"
                >
                    <Text className="text-white text-2xl font-light">+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {invoices.map((inv) => (
                    <View key={inv.id} className="bg-white p-6 rounded-[32px] border border-slate-100 mb-5 shadow-sm">
                        <View className="flex-row justify-between items-start mb-4">
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{inv.invoice_number}</Text>
                                <Text className="text-slate-900 font-extrabold text-xl mt-1">{inv.amount}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedInvoice(inv);
                                    setShowStatusPicker(true);
                                }}
                                className={`px-4 py-1.5 rounded-full border border-slate-100 flex-row items-center ${inv.status === 'Paid' ? 'bg-emerald-50' :
                                    inv.status === 'Overdue' ? 'bg-rose-50' : 'bg-amber-50'
                                    }`}
                            >
                                <Text className={`text-[10px] font-bold uppercase mr-1 ${inv.status === 'Paid' ? 'text-emerald-700' :
                                    inv.status === 'Overdue' ? 'text-rose-700' : 'text-amber-700'
                                    }`}>{inv.status}</Text>
                                <IconSymbol name="chevron.right" size={10} color="#cbd5e1" style={{ transform: [{ rotate: '90deg' }] }} />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between items-end border-t border-slate-50 pt-4">
                            <View>
                                <Text className="text-slate-900 font-bold text-base">{inv.client}</Text>
                                <Text className="text-slate-400 text-[10px] font-medium mt-0.5">Payment due by {inv.due}</Text>
                            </View>
                            <TouchableOpacity className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                                <IconSymbol name="paperplane.fill" size={16} color="#4f46e5" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {invoices.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <View className="bg-slate-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                            <IconSymbol name="paperplane.fill" size={32} color="#94a3b8" />
                        </View>
                        <Text className="text-slate-400 font-medium">No invoices generated</Text>
                        <TouchableOpacity onPress={() => router.push("/(tabs)/invoices/add-invoice")} className="mt-4">
                            <Text className="text-indigo-600 font-bold">Create new invoice</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* STATUS PICKER MODAL */}
            <Modal visible={showStatusPicker} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/60">
                    <TouchableOpacity activeOpacity={1} onPress={() => setShowStatusPicker(false)} className="absolute inset-0" />
                    <View className="bg-white rounded-t-[40px] p-8">
                        <View className="w-12 h-1.5 bg-slate-100 rounded-full self-center mb-6" />
                        <Text className="text-2xl font-bold text-slate-900 mb-6 text-center">Update Status</Text>

                        <View className="gap-3">
                            {statuses.map(s => (
                                <TouchableOpacity
                                    key={s}
                                    onPress={() => updateInvoiceStatus(s)}
                                    className={`p-5 rounded-3xl flex-row justify-between items-center border ${selectedInvoice?.status === s
                                        ? 'bg-indigo-50 border-indigo-100'
                                        : 'bg-slate-50 border-slate-50'
                                        }`}
                                >
                                    <Text className={`font-bold text-base ${selectedInvoice?.status === s ? 'text-indigo-600' : 'text-slate-600'}`}>
                                        {s}
                                    </Text>
                                    {selectedInvoice?.status === s && <IconSymbol name="checkmark" size={20} color="#4f46e5" />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={() => setShowStatusPicker(false)}
                            className="mt-8 py-4 bg-slate-900 rounded-3xl"
                        >
                            <Text className="text-white text-center font-bold text-base">Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
