import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center p-8">
      <StatusBar barStyle="dark-content" />

      <View className="bg-indigo-50 w-20 h-20 rounded-[28px] items-center justify-center mb-8">
        <IconSymbol name="plus" size={32} color="#4f46e5" />
      </View>

      <Text className="text-2xl font-black text-[#1e1b4b] tracking-tight mb-2">Workspace Insight</Text>
      <Text className="text-slate-500 text-center font-medium leading-relaxed mb-10">
        This space is reserved for specialized workflow alerts and system notifications. You're currently viewing a placeholder modal for advanced features.
      </Text>

      <TouchableOpacity
        onPress={() => router.back()}
        className="w-full bg-[#1e1b4b] py-5 rounded-[28px] shadow-xl shadow-indigo-100 items-center"
      >
        <Text className="text-white font-extrabold text-lg">Return to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="mt-6"
      >
        <Text className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Main Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
