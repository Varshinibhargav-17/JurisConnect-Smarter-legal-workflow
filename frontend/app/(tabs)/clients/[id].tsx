import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Alert } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/config';

import { authStore } from '@/constants/authStore';

export default function ClientDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchClient = useCallback(async () => {
        const userId = authStore.user?.id;
        if (!userId) {
            router.replace("/(auth)/login");
            return;
        }

        if (!id) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/clients/${id}`);
            const data = await res.json();
            if (res.ok) {
                setClient(data);
            } else {
                Alert.alert("Error", data.error || "Failed to fetch client");
            }
        } catch (err: any) {
            console.error("Error fetching client:", err);
            Alert.alert("Connection Error", "Is the backend server running?");
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useFocusEffect(
        useCallback(() => {
            fetchClient();
        }, [fetchClient])
    );

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    if (!client) {
        return (
            <View className="flex-1 bg-[#f8fafc] items-center justify-center p-6">
                <IconSymbol name="person.fill" size={48} color="#cbd5e1" />
                <Text className="text-slate-400 font-bold mt-4">Client profile not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-8 bg-indigo-600 px-8 py-3 rounded-2xl shadow-lg shadow-indigo-100">
                    <Text className="text-white font-bold">Return to List</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-[#f8fafc]">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* HEADER */}
            <View className="bg-white px-6 pt-16 pb-6 border-b border-slate-100 shadow-sm flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="bg-slate-50 w-10 h-10 rounded-xl items-center justify-center mr-4 border border-slate-100">
                    <IconSymbol name="chevron.right" size={20} color="#64748b" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <View>
                    <Text className="text-slate-900 text-xl font-bold tracking-tight">Client Profile</Text>
                    <Text className="text-indigo-500 text-[10px] font-bold uppercase tracking-wider">Verified Identity</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>

                {/* PROFILE CARD */}
                <View className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 mb-8 items-center">
                    <View className="w-24 h-24 rounded-[32px] bg-indigo-50 items-center justify-center mb-6">
                        <Text className="text-indigo-600 text-4xl font-bold">
                            {client.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)}
                        </Text>
                    </View>
                    <Text className="text-2xl font-extrabold text-slate-900 mb-1">{client.name}</Text>
                    <View className="bg-emerald-50 px-3 py-1 rounded-full mb-8">
                        <Text className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Active Partner</Text>
                    </View>

                    <View className="w-full gap-5 border-t border-slate-50 pt-8">
                        <View className="flex-row items-center">
                            <View className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mr-4">
                                <IconSymbol name="phone.fill" size={16} color="#64748b" />
                            </View>
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">Mobile Number</Text>
                                <Text className="text-slate-900 font-bold text-base">{client.phone || 'N/A'}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <View className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mr-4">
                                <IconSymbol name="envelope.fill" size={16} color="#64748b" />
                            </View>
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">Primary Email</Text>
                                <Text className="text-slate-900 font-bold text-base">{client.email || 'N/A'}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-start">
                            <View className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mr-4">
                                <IconSymbol name="house.fill" size={16} color="#64748b" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-0.5">Communication Address</Text>
                                <Text className="text-slate-900 font-bold text-base leading-snug">{client.address || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* LINKED MATTERS */}
                <View className="flex-row justify-between items-center mb-4 px-2">
                    <Text className="text-slate-800 text-lg font-bold">Associated Matters</Text>
                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">{client.matters?.length || 0} Total</Text>
                </View>

                {client.matters && client.matters.length > 0 ? (
                    client.matters.map((m: any, idx: number) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => router.push(`/(tabs)/matters/${m.id}` as any)}
                            activeOpacity={0.7}
                            className="bg-white p-5 rounded-3xl border border-slate-100 mb-3 shadow-sm flex-row justify-between items-center"
                        >
                            <View className="flex-1 mr-4">
                                <Text className="text-slate-900 font-bold text-base mb-0.5">{m.title}</Text>
                                <View className={`px-2 py-0.5 rounded-full self-start ${m.status === 'Active' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                    <Text className={`text-[10px] font-bold uppercase ${m.status === 'Active' ? 'text-emerald-700' : 'text-slate-500'}`}>{m.status}</Text>
                                </View>
                            </View>
                            <View className="bg-slate-50 p-2 rounded-xl">
                                <IconSymbol name="chevron.right" size={14} color="#cbd5e1" />
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View className="bg-white p-10 rounded-[32px] items-center border border-slate-100">
                        <Text className="text-slate-400 font-medium">No matters associated yet</Text>
                    </View>
                )}

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
