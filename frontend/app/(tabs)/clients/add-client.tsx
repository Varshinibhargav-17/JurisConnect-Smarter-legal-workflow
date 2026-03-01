import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config";
import { IconSymbol } from "@/components/ui/icon-symbol";

import { authStore } from '@/constants/authStore';

export default function AddClient() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const saveClient = async () => {
        const user = authStore.user;
        if (!user) {
            router.replace("/(auth)/login");
            return;
        }

        if (!name || !phone) {
            Alert.alert("Required Fields", "Name and Contact Number are mandatory for registry.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clients`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, email, address, user_id: user.id }),
            });

            if (response.ok) {
                Alert.alert("Success", "Identity verified and registry established.");
                router.back();
            } else {
                Alert.alert("Error", "Failed to register client.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Unable to establish connection with the client registry.");
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
                    <Text className="text-slate-900 text-xl font-bold tracking-tight">Client Admission</Text>
                    <Text className="text-indigo-500 text-[10px] font-bold uppercase tracking-wider">Identity Registry</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>

                <View className="gap-6">
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Legal Name</Text>
                        <TextInput
                            placeholder="Full Name (as per documents)"
                            value={name}
                            onChangeText={setName}
                            className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100"
                            placeholderTextColor="#cbd5e1"
                        />
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Mobile Contact</Text>
                            <TextInput
                                placeholder="+91 XXXX XXXX"
                                value={phone}
                                onChangeText={setPhone}
                                className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100"
                                keyboardType="phone-pad"
                                placeholderTextColor="#cbd5e1"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">E-Mail Address</Text>
                            <TextInput
                                placeholder="client@address.com"
                                value={email}
                                onChangeText={setEmail}
                                className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#cbd5e1"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Postal Address</Text>
                        <TextInput
                            placeholder="Full Residential or Commercial Address"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={3}
                            className="bg-white border border-slate-200 rounded-3xl p-5 text-slate-800 font-semibold shadow-sm shadow-slate-100 min-h-[120px]"
                            placeholderTextColor="#cbd5e1"
                        />
                    </View>


                    <TouchableOpacity
                        onPress={saveClient}
                        activeOpacity={0.8}
                        className="bg-[#1e1b4b] py-5 rounded-[28px] shadow-2xl shadow-indigo-200 mt-6 items-center"
                    >
                        <Text className="text-white font-extrabold text-lg">Initialize Client Registry</Text>
                    </TouchableOpacity>
                </View>

                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
