import { Platform } from 'react-native';

// Fallback IP for LAN if Constants is missing (which happens on Web sometimes)
const LAN_IP = '192.168.0.104';

// A foolproof method to get the correct API Base URL
const getBaseUrl = () => {
    // 1. If Web Browser, it's always localhost.
    if (Platform.OS === 'web') {
        return 'http://localhost:3000/api';
    }

    // 2. If Android Emulator, the loopback alias is 10.0.2.2
    // BUT since we just whitelisted Port 3000 in your Windows Firewall, 
    // the actual LAN IP is now 100% accessible to any device on your Wi-Fi!
    return `http://${LAN_IP}:3000/api`;
};

export const API_BASE_URL = getBaseUrl();
console.log("INITIALIZED API BASE URL:", API_BASE_URL);
