import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* HEADER */}
      <View className="flex-row items-center justify-between px-8 pt-16 pb-6 bg-white">
        <Text className="text-2xl font-black tracking-tight text-[#1e1b4b]">
          JurisConnect
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="px-5 py-2.5 rounded-2xl border border-slate-100 bg-slate-50"
        >
          <Text className="text-sm font-bold text-slate-600">Login</Text>
        </TouchableOpacity>
      </View>

      {/* HERO SECTION */}
      <View className="flex-1 px-8 justify-center items-center">
        <View className="bg-indigo-50 px-4 py-1.5 rounded-full mb-6">
          <Text className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">Next-Gen Legal OS</Text>
        </View>

        <Text className="text-5xl font-black text-center text-[#1e1b4b] leading-[54px] tracking-tighter">
          Elevate Your Legal Practice.
        </Text>

        <Text className="text-slate-500 text-center mt-8 text-lg font-medium leading-relaxed px-4">
          The all-in-one intelligence platform for modern lawyers to manage cases, clients, and billing with precision.
        </Text>

        <View className="w-full gap-4 mt-12 mb-8">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            activeOpacity={0.9}
            className="w-full bg-[#1e1b4b] py-5 rounded-[28px] shadow-2xl shadow-indigo-200 items-center"
          >
            <Text className="text-white font-extrabold text-lg">Create Professional Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.7}
            className="w-full bg-white border border-slate-100 py-5 rounded-[28px] items-center"
          >
            <Text className="text-slate-600 font-bold text-lg">Enter Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <View className="flex-row -space-x-2 mr-3">
            {[1, 2, 3].map(i => (
              <View key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white items-center justify-center">
                <Text className="text-[8px] font-bold text-slate-400">U{i}</Text>
              </View>
            ))}
          </View>
          <Text className="text-slate-400 text-xs font-semibold">Trusted by 2,000+ law firms</Text>
        </View>
      </View>

      {/* FOOTER DECORATION */}
      <View className="h-20 bg-slate-50 border-t border-slate-100 items-center justify-center px-8">
        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Crafted for Excellence • JurisConnect © 2026</Text>
      </View>
    </View>
  );
}
