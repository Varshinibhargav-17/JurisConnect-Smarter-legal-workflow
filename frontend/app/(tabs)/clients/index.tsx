import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/config';

import { authStore } from '@/constants/authStore';

export default function ClientsList() {
    const router = useRouter();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const userId = authStore.user?.id;
            if (!userId) {
                router.replace("/(auth)/login");
                return;
            }

            fetch(`${API_BASE_URL}/clients?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    setClients(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching clients:", err);
                    setLoading(false);
                });
        }, [])
    );

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
                    <Text className="text-slate-900 text-2xl font-bold tracking-tight">Clients</Text>
                    <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">{clients.length} Verified Contacts</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/clients/add-client")}
                    className="bg-indigo-600 w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-indigo-200"
                >
                    <Text className="text-white text-2xl font-light">+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {clients.map((client) => (
                    <TouchableOpacity
                        key={client.id}
                        onPress={() => router.push(`/(tabs)/clients/${client.id}` as any)}
                        activeOpacity={0.7}
                        className="bg-white p-5 rounded-3xl border border-slate-100 mb-4 shadow-sm flex-row items-center"
                    >
                        <View className="w-14 h-14 rounded-2xl bg-indigo-50 items-center justify-center mr-4">
                            <Text className="text-indigo-600 font-bold text-lg">
                                {client.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)}
                            </Text>
                        </View>

                        <View className="flex-1">
                            <Text className="text-slate-900 font-bold text-lg leading-tight mb-1">{client.name}</Text>
                            <Text className="text-slate-400 text-xs font-medium">{client.phone} • {client.email}</Text>
                            <View className="flex-row items-center mt-2">
                                <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                <Text className="text-emerald-600 text-[10px] font-bold uppercase">
                                    {client.activeMatters} Active Case{client.activeMatters !== 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>

                        <View className="bg-slate-50 p-2 rounded-xl">
                            <IconSymbol name="chevron.right" size={16} color="#cbd5e1" />
                        </View>
                    </TouchableOpacity>
                ))}

                {clients.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <View className="bg-slate-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                            <IconSymbol name="person.fill" size={32} color="#94a3b8" />
                        </View>
                        <Text className="text-slate-400 font-medium">No clients registered</Text>
                        <TouchableOpacity onPress={() => router.push("/(tabs)/clients/add-client")} className="mt-4">
                            <Text className="text-indigo-600 font-bold">Add your first client</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
