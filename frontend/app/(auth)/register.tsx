import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config";
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        Alert.alert("Workspace Created", "Your practice management account is ready.");
        router.push("/(auth)/login");
      } else {
        const data = await response.json();
        Alert.alert("Registration Failed", data.error || "Please try again");
      }
    } catch (error) {
      Alert.alert("Network Issue", "Unable to establish connection to LegalFlow servers.");
    }
  };

  return (
    <View className="flex-1 bg-white px-8">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* HEADER DECO */}
      <View className="pt-20 pb-10 items-center">
        <View className="bg-indigo-50 w-20 h-20 rounded-[28px] items-center justify-center mb-6">
          <IconSymbol name="plus" size={32} color="#4f46e5" />
        </View>
        <Text className="text-3xl font-black text-[#1e1b4b] tracking-tight">Practice Registry</Text>
        <Text className="text-slate-400 font-medium text-sm mt-1">Initialize your secure workspace</Text>
      </View>

      <View className="gap-5">
        <View>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Practitioner Name</Text>
          <TextInput
            placeholder="Adv. Sharma"
            value={name}
            onChangeText={setName}
            className="bg-slate-50 border border-slate-100 rounded-3xl p-5 text-slate-800 font-semibold"
            placeholderTextColor="#cbd5e1"
          />
        </View>

        <View>
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Registry Email</Text>
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
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Setup Password</Text>
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
          onPress={handleRegister}
          className="bg-[#1e1b4b] py-5 rounded-[28px] shadow-2xl shadow-indigo-200 mt-4 items-center"
        >
          <Text className="text-white font-extrabold text-lg">Create Secure Registry</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-12 items-center">
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text className="text-slate-400 font-semibold text-sm">
            Already registered? <Text className="text-indigo-600 font-black">Authorized Login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-end pb-12 items-center">
        <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Industry Compliant Encryption</Text>
      </View>
    </View>
  );
}
