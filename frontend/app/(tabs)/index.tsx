import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/config';

import { authStore } from '@/constants/authStore';
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const user = authStore.user;
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      fetch(`${API_BASE_URL}/dashboard?userId=${user.id}`)
        .then(res => res.json())
        .then(json => {
          setData(json);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching dashboard:", err);
          setLoading(false);
        });
    }, [])
  );

  if (loading || !data) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-slate-500 font-medium tracking-wide">Initializing workspace...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f8fafc]">
      <StatusBar barStyle="light-content" backgroundColor="#1e1b4b" />

      {/* PREMIUM HEADER */}
      <View className="bg-[#1e1b4b] pt-14 pb-12 px-6 rounded-b-[40px] shadow-2xl">
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-indigo-200 text-xs font-bold uppercase tracking-[2px] mb-1">Practice Management</Text>
            <Text className="text-white text-3xl font-bold tracking-tight">JurisConnect</Text>
          </View>
          <TouchableOpacity className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-400/30">
            <IconSymbol name="house.fill" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-xl">
          <View>
            <Text className="text-indigo-200 text-xs font-semibold mb-1">Monthly Billing</Text>
            <Text className="text-white text-2xl font-bold">{data.stats.revenueMonth || "₹0"}</Text>
          </View>
          <View className="h-10 w-[1px] bg-white/20" />
          <View className="items-end">
            <Text className="text-indigo-200 text-xs font-semibold mb-1">Active Matters</Text>
            <Text className="text-white text-2xl font-bold">{data.stats.activeMatters || "0"}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 -mt-6" showsVerticalScrollIndicator={false}>

        {/* ACTION CARDS */}
        <View className="flex-row justify-between mb-8">
          <View className="w-[48%] bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <View className="bg-amber-100 w-10 h-10 rounded-2xl items-center justify-center mb-3">
              <IconSymbol name="chevron.right" size={18} color="#d97706" style={{ transform: [{ rotate: '-90deg' }] }} />
            </View>
            <Text className="text-2xl font-extrabold text-slate-900">{data.stats.hearingsWeek || "0"}</Text>
            <Text className="text-slate-500 text-xs font-bold uppercase mt-1">Hearings</Text>
            <Text className="text-slate-400 text-[10px] mt-1">Scheduled this week</Text>
          </View>

          <View className="w-[48%] bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <View className="bg-rose-100 w-10 h-10 rounded-2xl items-center justify-center mb-3">
              <IconSymbol name="paperplane.fill" size={18} color="#e11d48" />
            </View>
            <Text className="text-2xl font-extrabold text-rose-600">{data.stats.overdueTasks || "0"}</Text>
            <Text className="text-slate-500 text-xs font-bold uppercase mt-1">Alerts</Text>
            <Text className="text-slate-400 text-[10px] mt-1">Overdue tasks found</Text>
          </View>
        </View>

        {/* UPCOMING DEADLINES */}
        <View className="mb-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-slate-800 text-lg font-bold">Upcoming Deadlines</Text>
            <TouchableOpacity><Text className="text-indigo-600 font-bold text-xs uppercase">View All</Text></TouchableOpacity>
          </View>

          <View className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            {data.deadlines && data.deadlines.length > 0 ? data.deadlines.map((dl: any, idx: number) => (
              <View key={idx} className={`p-5 flex-row items-center ${idx !== data.deadlines.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <View className="w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4">
                  <Text className="text-slate-400 font-bold text-[10px] uppercase">{new Date(dl.date).toLocaleString('default', { month: 'short' })}</Text>
                  <Text className="text-slate-900 font-bold text-lg">{new Date(dl.date).getDate()}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-slate-900 text-base">{dl.purpose || 'Hearing'}</Text>
                  <Text className="text-xs text-indigo-500 font-semibold">{dl.matter?.title || 'Unknown Matter'}</Text>
                </View>
                <IconSymbol name="chevron.right" size={16} color="#cbd5e1" />
              </View>
            )) : (
              <View className="p-10 items-center">
                <Text className="text-slate-400 font-medium">All clear for today</Text>
              </View>
            )}
          </View>
        </View>

        {/* OUTSTANDING INVOICES */}
        <View className="mb-12">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-slate-800 text-lg font-bold">Outstanding Invoices</Text>
            <TouchableOpacity><Text className="text-indigo-600 font-bold text-xs uppercase">Billing Details</Text></TouchableOpacity>
          </View>

          {data.invoices && data.invoices.length > 0 ? data.invoices.map((inv: any, idx: number) => (
            <View key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-3 flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="font-bold text-slate-900 text-base">{inv.client}</Text>
                <Text className="text-xs text-slate-400 font-medium mt-1">Invoice {inv.id} • Due {inv.due}</Text>
              </View>
              <View className="items-end">
                <Text className="font-extrabold text-slate-900 text-lg">{inv.amount}</Text>
                <View className={`mt-1 px-2 py-0.5 rounded-full ${inv.status === 'Overdue' ? 'bg-rose-50' : 'bg-amber-50'}`}>
                  <Text className={`text-[10px] font-bold uppercase ${inv.status === 'Overdue' ? 'text-rose-600' : 'text-amber-600'}`}>{inv.status}</Text>
                </View>
              </View>
            </View>
          )) : (
            <View className="bg-white p-10 rounded-3xl items-center border border-slate-100">
              <Text className="text-slate-400">No pending payments</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}
