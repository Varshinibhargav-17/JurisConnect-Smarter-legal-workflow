import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { authStore } from '@/constants/authStore';

export default function AddInvoice() {
    const router = useRouter();
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Math.random() * 90000) + 10000}`);
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState("");

    useEffect(() => {
        const userId = authStore.user?.id;
        if (!userId) {
            router.replace("/(auth)/login");
            return;
        }

        fetch(`${API_BASE_URL}/clients?userId=${userId}`)
            .then(res => res.json())
            .then(data => setClients(data))
            .catch(console.error);
    }, []);

    const saveInvoice = async () => {
        if (!amount || !selectedClientId) {
            Alert.alert("Missing Information", "Fill in Amount and select a Client.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/invoices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invoice_number: invoiceNumber,
                    client_id: selectedClientId,
                    total_amount: parseFloat(amount),
                    status: "Draft",
                    due_date: new Date(dueDate || Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                }),
            });

            if (response.ok) {
                Alert.alert("Success", "Professional Invoice Issued.");
                router.back();
            } else {
                Alert.alert("Error", "Failed to issue invoice.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Unable to communicate with the billing server.");
        }
    };

    return (
        <View className="flex-1 bg-[#f8fafc]">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View className="bg-white px-6 pt-16 pb-6 border-b border-slate-100 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="bg-slate-50 w-10 h-10 rounded-xl items-center justify-center mr-4 border border-slate-100">
                    <IconSymbol name="chevron.right" size={20} color="#64748b" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <View>
                    <Text className="text-slate-900 text-xl font-bold tracking-tight">Invoice Issuance</Text>
                    <Text className="text-indigo-500 text-[10px] font-bold uppercase tracking-wider">Financial Ledger Registry</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>

                <View className="gap-6">
                    <View className="flex-row gap-4 mb-2">
                        <View className="flex-1">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Reference Number</Text>
                            <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 items-center justify-center">
                                <Text className="text-slate-500 font-black tracking-widest">{invoiceNumber}</Text>
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Today's Date</Text>
                            <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 items-center justify-center">
                                <Text className="text-slate-500 font-bold">{new Date().toLocaleDateString()}</Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Recipient Client</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {clients.map(c => (
                                <TouchableOpacity
                                    key={c.id}
                                    onPress={() => setSelectedClientId(c.id)}
                                    className={`px-4 py-3 rounded-2xl border ${selectedClientId === c.id ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}
                                >
                                    <Text className={`text-xs font-bold ${selectedClientId === c.id ? 'text-white' : 'text-slate-500'}`}>{c.name}</Text>
                                </TouchableOpacity>
                            ))}
                            {clients.length === 0 && (
                                <TouchableOpacity onPress={() => router.push("/(tabs)/clients/add-client")} className="p-4 border border-dashed border-slate-300 rounded-2xl w-full items-center">
                                    <Text className="text-slate-400 font-bold text-xs">+ Register Client First</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Billing Amount (INR)</Text>
                        <TextInput
                            placeholder="₹ 0.00"
                            value={amount}
                            onChangeText={setAmount}
                            className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 font-black text-2xl shadow-sm shadow-slate-100"
                            keyboardType="numeric"
                            placeholderTextColor="#cbd5e1"
                        />
                    </View>

                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Payment Maturity (Due Date)</Text>
                        <TextInput
                            placeholder="YYYY-MM-DD"
                            value={dueDate}
                            onChangeText={setDueDate}
                            className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100"
                            placeholderTextColor="#cbd5e1"
                        />
                        <Text className="text-slate-400 text-[9px] mt-2 px-1">Default is 7-day payment cycle unless specified otherwise.</Text>
                    </View>

                    <View className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex-row items-center">
                        <View className="w-10 h-10 rounded-2xl bg-white items-center justify-center mr-4">
                            <IconSymbol name="checkmark" size={16} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Tax Compliant Ledger</Text>
                            <Text className="text-emerald-500 text-[10px] mt-0.5">This invoice will be electronically registered for financial audit.</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={saveInvoice}
                        activeOpacity={0.8}
                        className="bg-[#1e1b4b] py-5 rounded-[28px] shadow-2xl shadow-indigo-200 mt-4 items-center"
                    >
                        <Text className="text-white font-extrabold text-lg">Commit to Ledger</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
