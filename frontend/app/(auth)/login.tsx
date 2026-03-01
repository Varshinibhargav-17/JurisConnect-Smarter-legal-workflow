import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { authStore } from "@/constants/authStore";
import { API_BASE_URL } from "@/config";
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        authStore.user = user;
        Alert.alert("Access Granted", "Welcome back to JurisConnect");
        router.replace("/(tabs)");
      } else {
        const data = await response.json();
        Alert.alert("Authentication Failed", data.error || "Login failed");
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to establish secure connection to the backend.");
    }
  };

  return (
    <View className="flex-1 bg-white px-8">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* HEADER DECO */}
      <View className="pt-24 pb-12 items-center">
        <View className="w-20 h-20 bg-indigo-600 rounded-[28px] items-center justify-center shadow-xl shadow-indigo-100 mb-6">
          <IconSymbol name="house.fill" size={32} color="#ffffff" />
        </View>
        <Text className="text-3xl font-black text-[#1e1b4b] tracking-tight">Welcome Back</Text>
        <Text className="text-slate-400 font-medium text-sm mt-1">Authorized Legal Access Only</Text>
      </View>

      <View className="gap-5">
        <View>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Work Email</Text>
          <TextInput
            placeholder="name@firm.com"
            value={email}
            onChangeText={setEmail}
            className="bg-slate-50 border border-slate-100 rounded-3xl p-5 text-slate-800 font-semibold"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#cbd5e1"
          />
        </View>

        <View>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Security Key (Password)</Text>
          <TextInput
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            className="bg-slate-50 border border-slate-100 rounded-3xl p-5 text-slate-800 font-semibold"
            secureTextEntry
            placeholderTextColor="#cbd5e1"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className="items-end px-1"
        >
          <Text className="text-indigo-600 font-bold text-xs uppercase">Reset Access?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-[#1e1b4b] py-5 rounded-[28px] shadow-2xl shadow-indigo-200 mt-4 items-center"
        >
          <Text className="text-white font-extrabold text-lg">Secure Login</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-12 items-center">
        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text className="text-slate-400 font-semibold text-sm">
            New practitioner? <Text className="text-indigo-600 font-black">Register Workspace</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-end pb-12 items-center">
        <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">TLS Encrypted Channel</Text>
      </View>
    </View>
  );
}
