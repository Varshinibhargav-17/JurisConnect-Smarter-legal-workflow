import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, FlatList, StatusBar } from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/config';

import { authStore } from '@/constants/authStore';
import { useRouter } from "expo-router";

export default function TimeTracking() {
    const router = useRouter();
    const [isTiming, setIsTiming] = useState(false);
    const [timeInSeconds, setTimeInSeconds] = useState(0);

    const [entries, setEntries] = useState<any[]>([]);
    const [matters, setMatters] = useState<any[]>([]);
    const [selectedMatterId, setSelectedMatterId] = useState<string | null>(null);
    const [showMatterPicker, setShowMatterPicker] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useFocusEffect(
        useCallback(() => {
            const userId = authStore.user?.id;
            if (!userId) {
                router.replace("/(auth)/login");
                return;
            }

            fetch(`${API_BASE_URL}/time-entries?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setEntries(data);
                    else setEntries([]);
                })
                .catch(console.error);

            fetch(`${API_BASE_URL}/matters?userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    setMatters(data);
                    if (data.length > 0 && !selectedMatterId) {
                        setSelectedMatterId(data[0].id);
                    }
                })
                .catch(console.error);
        }, [selectedMatterId])
    );

    useEffect(() => {
        if (isTiming) {
            intervalRef.current = setInterval(() => {
                setTimeInSeconds((t) => t + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isTiming]);

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const stopAndSave = async () => {
        if (timeInSeconds === 0) return;
        if (!selectedMatterId) {
            Alert.alert("Error", "Please select a matter first!");
            return;
        }
        setIsTiming(false);

        const hours = (timeInSeconds / 3600).toFixed(2);
        const rate = 5000;

        try {
            const res = await fetch(`${API_BASE_URL}/time-entries`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matter_id: selectedMatterId,
                    date: new Date().toISOString(),
                    hours: parseFloat(hours),
                    description: "Timer session",
                    billable: true,
                    rate: rate
                })
            });

            if (res.ok) {
                Alert.alert("Success", "Time logged!");
                setTimeInSeconds(0);
                const freshEntries = await fetch(`${API_BASE_URL}/time-entries?userId=${authStore.user?.id}`).then(r => r.json());
                if (Array.isArray(freshEntries)) setEntries(freshEntries);
                else setEntries([]);
            }
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    const selectedMatter = matters.find(m => m.id === selectedMatterId);

    return (
        <View className="flex-1 bg-[#f8fafc]">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* HEADER */}
            <View className="bg-white px-6 pt-16 pb-6 border-b border-slate-100 shadow-sm">
                <Text className="text-slate-900 text-2xl font-bold tracking-tight">Time Tracker</Text>
                <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">Log billable hours</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>

                {/* TIMER CARD */}
                <View className="bg-white rounded-[40px] border border-slate-100 p-8 items-center shadow-xl shadow-slate-200/50 mb-8">

                    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4 self-start px-2">Current Engagement</Text>

                    <TouchableOpacity
                        onPress={() => setShowMatterPicker(true)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-10 flex-row justify-between items-center"
                    >
                        <View className="flex-1 mr-4">
                            <Text className="text-slate-900 font-bold text-base">
                                {selectedMatter ? selectedMatter.title : "Pick a Matter..."}
                            </Text>
                            <Text className="text-indigo-500 text-[10px] font-bold uppercase mt-0.5">Linked Case</Text>
                        </View>
                        <View className="bg-white p-2 rounded-xl shadow-sm border border-slate-50">
                            <IconSymbol name="chevron.right" size={14} color="#4f46e5" style={{ transform: [{ rotate: '90deg' }] }} />
                        </View>
                    </TouchableOpacity>

                    <Text className="text-6xl font-light text-slate-900 mb-10 tracking-widest">
                        {formatTime(timeInSeconds)}
                    </Text>

                    <View className="flex-row justify-between w-full h-16">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className={`flex-[0.65] rounded-3xl flex-row justify-center items-center shadow-lg ${isTiming ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-600 shadow-indigo-200'}`}
                            onPress={() => setIsTiming(!isTiming)}
                        >
                            <Text className="text-white font-bold text-lg">{isTiming ? '⏸ Pause' : '▶ Start Timer'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={stopAndSave}
                            activeOpacity={0.8}
                            className="flex-[0.3] bg-rose-500 rounded-3xl flex-row justify-center items-center shadow-lg shadow-rose-200"
                        >
                            <Text className="text-white font-bold text-lg">⏹ Stop</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LOGGED ENTRIES */}
                <View className="flex-row justify-between items-center mb-4 px-2">
                    <Text className="text-slate-800 text-lg font-bold">Recent Entries</Text>
                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider">{entries.length} History</Text>
                </View>

                {entries.map((entry, idx) => (
                    <View key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 mb-3 shadow-sm flex-row justify-between items-center">
                        <View className="flex-1 mr-4">
                            <Text className="font-bold text-slate-900 text-base mb-0.5">{entry.matter}</Text>
                            <Text className="text-xs text-slate-400 font-medium italic">{entry.task}</Text>
                        </View>
                        <View className="items-end bg-indigo-50 px-4 py-2 rounded-2xl">
                            <Text className="font-bold text-indigo-600 text-base">{entry.duration}</Text>
                            <Text className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">{entry.amount}</Text>
                        </View>
                    </View>
                ))}

                {entries.length === 0 && (
                    <View className="bg-white p-10 rounded-[32px] items-center border border-slate-100">
                        <Text className="text-slate-400">No time recorded today</Text>
                    </View>
                )}

            </ScrollView>

            <Modal visible={showMatterPicker} transparent animationType="slide">
                <View className="flex-1 justify-end bg-black/60">
                    <TouchableOpacity activeOpacity={1} onPress={() => setShowMatterPicker(false)} className="absolute inset-0" />
                    <View className="bg-white rounded-t-[40px] p-8 h-[60%]">
                        <View className="w-12 h-1.5 bg-slate-100 rounded-full self-center mb-6" />
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold text-slate-900">Select Case</Text>
                            <TouchableOpacity onPress={() => setShowMatterPicker(false)}>
                                <Text className="text-indigo-600 font-bold">Done</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={matters}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedMatterId(item.id);
                                        setShowMatterPicker(false);
                                    }}
                                    className={`p-5 rounded-3xl mb-3 flex-row justify-between items-center border ${selectedMatterId === item.id
                                        ? 'bg-indigo-50 border-indigo-100'
                                        : 'bg-slate-50 border-slate-50'
                                        }`}
                                >
                                    <View className="flex-1 mr-4">
                                        <Text className={`font-bold text-base ${selectedMatterId === item.id ? 'text-indigo-600' : 'text-slate-900'}`}>{item.title}</Text>
                                        <Text className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">{item.court}</Text>
                                    </View>
                                    {selectedMatterId === item.id && <IconSymbol name="checkmark" size={20} color="#4f46e5" />}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
