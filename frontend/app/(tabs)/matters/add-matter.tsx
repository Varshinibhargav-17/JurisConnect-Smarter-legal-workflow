import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { authStore } from '@/constants/authStore';

export default function AddMatter() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [caseNumber, setCaseNumber] = useState("");
    const [courtName, setCourtName] = useState("");
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

    const saveMatter = async () => {
        const user = authStore.user;
        if (!user) return;

        if (!title || !selectedClientId) {
            Alert.alert("Required Fields", "Please provide a Case Title and link a Client.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/matters`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    case_number: caseNumber,
                    court_name: courtName,
                    client_id: selectedClientId,
                    status: "Active",
                    user_id: user.id
                }),
            });

            if (response.ok) {
                Alert.alert("Success", "New case registry established.");
                router.back();
            } else {
                Alert.alert("Error", "Failed to register case.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Unable to communicate with the registry server.");
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
                    <Text className="text-slate-900 text-xl font-bold tracking-tight">New Case Matter</Text>
                    <Text className="text-indigo-500 text-[10px] font-bold uppercase tracking-wider">Registry Entry</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>

                <View className="gap-6">
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Case Designation (Title)</Text>
                        <TextInput
                            placeholder="e.g. Sharma vs. State of Delhi"
                            value={title}
                            onChangeText={setTitle}
                            className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100"
                            placeholderTextColor="#cbd5e1"
                        />
                    </View>

                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Assigned Client</Text>
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

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Court Case ID</Text>
                            <TextInput
                                placeholder="Case No."
                                value={caseNumber}
                                onChangeText={setCaseNumber}
                                className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100"
                                placeholderTextColor="#cbd5e1"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Court Forum</Text>
                            <TextInput
                                placeholder="Supreme Court..."
                                value={courtName}
                                onChangeText={setCourtName}
                                className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100"
                                placeholderTextColor="#cbd5e1"
                            />
                        </View>
                    </View>

                    <View className="p-6 bg-indigo-50 rounded-[32px] mt-4">
                        <Text className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Automated Workflow</Text>
                        <Text className="text-indigo-400 text-[11px] leading-relaxed">By registering this matter, an automated dashboard will be generated to track all hearings, tasks, and billing cycles.</Text>
                    </View>

                    <TouchableOpacity
                        onPress={saveMatter}
                        activeOpacity={0.8}
                        className="bg-[#1e1b4b] py-5 rounded-[28px] shadow-2xl shadow-indigo-200 mt-6 items-center"
                    >
                        <Text className="text-white font-extrabold text-lg">Initialize Registry</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
