import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/config';

import { authStore } from '@/constants/authStore';

export default function MattersList() {
    const router = useRouter();
    const [matters, setMatters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const userId = authStore.user?.id;
            if (!userId) {
                router.replace("/(auth)/login");
                return;
            }

            fetch(`${API_BASE_URL}/matters?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    setMatters(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching matters:", err);
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

            {/* STICKY HEADER */}
            <View className="bg-white px-6 pt-16 pb-6 border-b border-slate-100 shadow-sm flex-row items-center justify-between">
                <View>
                    <Text className="text-slate-900 text-2xl font-bold tracking-tight">Matters</Text>
                    <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">{matters.length} Active Cases</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/matters/add-matter")}
                    className="bg-indigo-600 w-12 h-12 rounded-2xl items-center justify-center shadow-lg shadow-indigo-200"
                >
                    <Text className="text-white text-2xl font-light">+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {matters.map((matter) => (
                    <TouchableOpacity
                        key={matter.id}
                        onPress={() => router.push(`/(tabs)/matters/${matter.id}`)}
                        activeOpacity={0.7}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 mb-5 shadow-sm"
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1 mr-4">
                                <Text className="text-slate-900 font-bold text-lg mb-1 leading-tight">{matter.title}</Text>
                                <View className="flex-row items-center">
                                    <View className="bg-indigo-50 px-2 py-0.5 rounded-full mr-2">
                                        <Text className="text-indigo-600 text-[10px] font-bold uppercase">{matter.caseNo || 'N/A'}</Text>
                                    </View>
                                    <Text className="text-slate-400 text-xs font-medium">{matter.court}</Text>
                                </View>
                            </View>
                            <View className={`px-3 py-1 rounded-full ${matter.status === 'Active' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                <Text className={`text-[10px] font-bold uppercase ${matter.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                    {matter.status}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between border-t border-slate-50 mt-2 pt-4">
                            <View className="flex-row -space-x-2">
                                {/* Mock avatars for extra flair */}
                                <View className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white items-center justify-center">
                                    <Text className="text-indigo-600 text-[10px] font-bold">JD</Text>
                                </View>
                                <View className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white items-center justify-center">
                                    <IconSymbol name="person.fill" size={12} color="#64748b" />
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <Text className="text-indigo-600 text-xs font-bold mr-1">Case Details</Text>
                                <IconSymbol name="chevron.right" size={14} color="#4f46e5" />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {matters.length === 0 && (
                    <View className="items-center justify-center py-20">
                        <View className="bg-slate-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                            <IconSymbol name="paperplane.fill" size={32} color="#94a3b8" />
                        </View>
                        <Text className="text-slate-400 font-medium">No matters found</Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(tabs)/matters/add-matter")}
                            className="mt-4"
                        >
                            <Text className="text-indigo-600 font-bold">Create your first case</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
