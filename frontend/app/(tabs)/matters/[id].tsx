import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Alert, Modal, TextInput, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { API_BASE_URL } from '@/config';
import { authStore } from '@/constants/authStore';

const TABS = ["Overview", "Time", "Billing"];

// Sub-components to isolate rendering and potential interop issues
const OverviewTab = ({ matter, onAddHearing, totalBilled, totalPaid, totalDue }: any) => {
    return (
        <View style={styles.tabContent}>
            <View style={styles.card}>
                <View style={{ flex: 1, marginRight: 16 }}>
                    <Text style={styles.label}>Key Partner</Text>
                    <Text style={styles.cardTitle}>{matter.client?.name || 'N/A'}</Text>
                    <Text style={styles.cardSubtitle}>📞 {matter.client?.phone || 'N/A'}</Text>
                </View>
                <View style={[styles.iconBox, { backgroundColor: '#eef2ff' }]}>
                    <IconSymbol name="person.fill" size={20} color="#4f46e5" />
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Adversary & Counsel</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <View style={[styles.badge, { backgroundColor: '#fff1f2' }]}>
                            <Text style={[styles.badgeText, { color: '#e11d48' }]}>Opposition</Text>
                        </View>
                        <Text style={styles.cardTitleMedium}>{matter.opposing_party || 'N/A'}</Text>
                    </View>
                    <View style={styles.dividerVertical} />
                    <View style={{ flex: 1, paddingLeft: 16 }}>
                        <View style={[styles.badge, { backgroundColor: '#f8fafc' }]}>
                            <Text style={[styles.badgeText, { color: '#64748b' }]}>Counsel</Text>
                        </View>
                        <Text style={styles.cardTitleMediumSecondary}>{matter.opposing_counsel || 'N/A'}</Text>
                    </View>
                </View>
            </View>

            {matter.court_dates && matter.court_dates.length > 0 && (
                <View style={styles.darkCard}>
                    <Text style={styles.darkLabel}>Next Hearing Session</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateText}>{new Date(matter.court_dates[0].date).getDate()}</Text>
                        </View>
                        <View>
                            <Text style={styles.monthText}>{new Date(matter.court_dates[0].date).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</Text>
                            <Text style={styles.actionText}>Scheduled Action</Text>
                        </View>
                    </View>
                    <View style={styles.darkNote}>
                        <Text style={styles.darkNoteText}>Purpose: {matter.court_dates[0].purpose || 'N/A'}</Text>
                    </View>
                </View>
            )}

            <View style={styles.card}>
                <Text style={styles.label}>Billing Snapshot</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Billed</Text>
                        <Text style={styles.statValue}>₹{totalBilled}</Text>
                    </View>
                    <View style={styles.dividerVerticalTiny} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#10b981' }]}>Paid</Text>
                        <Text style={[styles.statValue, { color: '#059669' }]}>₹{totalPaid}</Text>
                    </View>
                    <View style={styles.dividerVerticalTiny} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#f43f5e' }]}>Due</Text>
                        <Text style={[styles.statValue, { color: '#e11d48' }]}>₹{totalDue}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={onAddHearing}
                style={styles.actionButton}
            >
                <View style={styles.plusIcon}>
                    <IconSymbol name="plus" size={14} color="#fff" />
                </View>
                <Text style={styles.actionButtonText}>Schedule New Hearing</Text>
            </TouchableOpacity>
        </View>
    );
};

const TimeTab = ({ matter }: any) => {
    return (
        <View style={styles.tabContentBox}>
            <Text style={styles.tabHeading}>Engagement Log</Text>
            {matter.time_entries && matter.time_entries.length > 0 ? (
                matter.time_entries.map((entry: any, i: number) => (
                    <View key={i} style={[styles.listItem, i !== matter.time_entries.length - 1 && styles.borderBottom]}>
                        <View style={{ flex: 1, marginRight: 16 }}>
                            <Text style={styles.listTitle}>{new Date(entry.date).toLocaleDateString()}</Text>
                            <Text style={styles.listSubtitle}>{entry.description}</Text>
                        </View>
                        <View style={styles.hoursBadge}>
                            <Text style={styles.hoursText}>{entry.hours}h</Text>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No billable sessions found</Text>
                </View>
            )}
        </View>
    );
};

const BillingTab = ({ matter }: any) => {
    return (
        <View style={[styles.tabContentBox, { borderRadius: 40 }]}>
            <Text style={styles.tabHeading}>Financial Records</Text>
            {matter.invoices && matter.invoices.length > 0 ? (
                matter.invoices.map((inv: any, i: number) => (
                    <View key={i} style={[styles.listItem, i !== matter.invoices.length - 1 && styles.borderBottom]}>
                        <View>
                            <Text style={styles.listTitle}>{inv.invoice_number}</Text>
                            <Text style={styles.listSubtitleThin}>Status • Due {new Date(inv.due_date).toLocaleDateString()}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.moneyText}>₹{inv.total_amount}</Text>
                            <View style={[styles.pillBadge, { backgroundColor: inv.status === 'Paid' ? '#ecfdf5' : '#fffbeb' }]}>
                                <Text style={[styles.pillBadgeText, { color: inv.status === 'Paid' ? '#047857' : '#b45309' }]}>{inv.status}</Text>
                            </View>
                        </View>
                    </View>
                ))
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>Financial ledger brand new</Text>
                </View>
            )}
        </View>
    );
};

export default function MatterDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [matter, setMatter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showHearingModal, setShowHearingModal] = useState(false);
    const [hearingDate, setHearingDate] = useState("");
    const [hearingPurpose, setHearingPurpose] = useState("");
    const [savingHearing, setSavingHearing] = useState(false);

    const updateStatus = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const res = await fetch(`${API_BASE_URL}/matters/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                const updated = await res.json();
                setMatter(updated);
                Alert.alert("Success", `Status updated to ${newStatus}`);
            } else {
                const errData = await res.json();
                Alert.alert("Error", errData.error || "Failed to update status");
            }
        } catch (err: any) {
            console.error("Error updating status:", err);
            Alert.alert("Error", err.message);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const saveHearing = async () => {
        if (!hearingDate || !hearingPurpose) {
            Alert.alert("Required", "Date and Purpose are mandatory.");
            return;
        }
        setSavingHearing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/court-dates`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matter_id: id,
                    date: hearingDate,
                    purpose: hearingPurpose
                })
            });
            if (res.ok) {
                Alert.alert("Success", "Hearing scheduled successfully.");
                setShowHearingModal(false);
                setHearingDate("");
                setHearingPurpose("");
                fetch(`${API_BASE_URL}/matters/${id}`)
                    .then(r => r.json())
                    .then(data => setMatter(data));
            }
        } catch (err) {
            Alert.alert("Error", "Failed to save hearing.");
        } finally {
            setSavingHearing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!id) return;
            const userId = authStore.user?.id;
            if (!userId) {
                router.replace("/(auth)/login");
                return;
            }

            fetch(`${API_BASE_URL}/matters/${id}`)
                .then(res => res.json())
                .then(data => {
                    setMatter(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching matter:", err);
                    setLoading(false);
                });
        }, [id, router])
    );

    if (loading || !matter) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    const totalBilled = matter.invoices?.reduce((acc: number, inv: any) => acc + inv.total_amount, 0) || 0;
    const totalPaid = matter.invoices?.filter((i: any) => i.status === 'Paid').reduce((acc: number, inv: any) => acc + inv.total_amount, 0) || 0;
    const totalDue = totalBilled - totalPaid;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.right" size={20} color="#64748b" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Case Intelligence</Text>
                    <Text style={styles.headerSubtitle}>Matter #{id?.toString().substring(0, 6)}</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* MATTER HEADER CARD */}
                <View style={{ marginBottom: 32 }}>
                    <View style={styles.mainCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                            <View style={{ flex: 1, marginRight: 16 }}>
                                <Text style={styles.matterTitle}>{matter.title}</Text>
                                <Text style={styles.matterCaseInfo}>
                                    Case No: {matter.case_number || 'N/A'} • {matter.court_name || 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.accentIcon}>
                                <IconSymbol name="paperplane.fill" size={22} color="#ffffff" />
                            </View>
                        </View>

                        <Text style={styles.workflowLabel}>Workflow State</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {["Active", "Ongoing", "Future", "Closed"].map((s) => (
                                <TouchableOpacity
                                    key={s}
                                    onPress={() => updateStatus(s)}
                                    style={[
                                        styles.statusButton,
                                        matter.status === s ? styles.statusButtonActive : styles.statusButtonInactive
                                    ]}
                                >
                                    <Text style={[
                                        styles.statusButtonText,
                                        matter.status === s ? styles.statusTextActive : styles.statusTextInactive
                                    ]}>{s}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* TAB SWITCHER */}
                <View style={styles.tabBar}>
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabItem,
                                activeTab === tab && styles.tabItemActive
                            ]}
                        >
                            <Text style={[
                                styles.tabItemText,
                                activeTab === tab ? styles.tabTextActive : styles.tabTextInactive
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* TAB CONTENT */}
                {activeTab === "Overview" && <OverviewTab matter={matter} onAddHearing={() => setShowHearingModal(true)} totalBilled={totalBilled} totalPaid={totalPaid} totalDue={totalDue} />}
                {activeTab === "Time" && <TimeTab matter={matter} />}
                {activeTab === "Billing" && <BillingTab matter={matter} />}

                <View style={{ height: 40 }} />
            </ScrollView>

            <Modal visible={showHearingModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <TouchableOpacity activeOpacity={1} onPress={() => setShowHearingModal(false)} style={styles.modalDismiss} />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Schedule Hearing</Text>

                        <View style={{ gap: 20 }}>
                            <View>
                                <Text style={styles.inputLabel}>Hearing Date</Text>
                                <TextInput
                                    placeholder="YYYY-MM-DD"
                                    value={hearingDate}
                                    onChangeText={setHearingDate}
                                    style={styles.input}
                                />
                            </View>
                            <View>
                                <Text style={styles.inputLabel}>Purpose / Stage</Text>
                                <TextInput
                                    placeholder="e.g. Evidence, Final Arguments"
                                    value={hearingPurpose}
                                    onChangeText={setHearingPurpose}
                                    style={styles.input}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={saveHearing}
                                disabled={savingHearing}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.confirmButtonText}>{savingHearing ? 'Saving...' : 'Confirm Schedule'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    loaderContainer: { flex: 1, backgroundColor: 'white', itemsCenter: 'center', justifyContent: 'center' },
    header: { backgroundColor: 'white', paddingHorizontal: 24, paddingTop: 64, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center' },
    backButton: { backgroundColor: '#f8fafc', width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderBottomColor: '#f1f5f9' },
    headerTitle: { color: '#0f172a', fontSize: 20, fontWeight: 'bold' },
    headerSubtitle: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    scrollView: { flex: 1 },
    mainCard: { backgroundColor: 'white', padding: 32, borderRadius: 40, borderWidth: 1, borderColor: '#f1f5f9' },
    matterTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', lineHeight: 30, marginBottom: 8 },
    matterCaseInfo: { color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, lineHeight: 20 },
    accentIcon: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 16 },
    workflowLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
    statusButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, borderWidth: 1, height: 36, justifyContent: 'center' },
    statusButtonActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
    statusButtonInactive: { backgroundColor: '#f8fafc', borderColor: '#f1f5f9' },
    statusButtonText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    statusTextActive: { color: 'white' },
    statusTextInactive: { color: '#94a3b8' },
    tabBar: { backgroundColor: 'rgba(79, 70, 229, 0.05)', padding: 6, borderRadius: 24, flexDirection: 'row', marginBottom: 24, marginHorizontal: 8, borderWidth: 1, borderColor: '#e0e7ff' },
    tabItem: { flex: 1, paddingVertical: 12, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    tabItemActive: { backgroundColor: 'white' },
    tabItemText: { fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
    tabTextActive: { color: '#4f46e5' },
    tabTextInactive: { color: '#a5b4fc' },
    tabContent: { gap: 24, marginTop: 16 },
    card: { backgroundColor: 'white', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { fontWeight: 'bold', color: '#0f172a', fontSize: 18, marginBottom: 4 },
    cardTitleMedium: { fontWeight: 'bold', color: '#0f172a', fontSize: 16 },
    cardTitleMediumSecondary: { fontWeight: 'bold', color: '#334155', fontSize: 16 },
    cardSubtitle: { color: '#4f46e5', fontWeight: 'bold', fontSize: 12 },
    label: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
    iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, alignSelf: 'flex-start', marginBottom: 4 },
    badgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    dividerVertical: { width: 1, height: '100%', backgroundColor: '#f8fafc', marginHorizontal: 16 },
    dividerVerticalTiny: { width: 1, height: '100%', backgroundColor: '#f8fafc' },
    darkCard: { backgroundColor: '#1e1b4b', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    darkLabel: { color: '#c7d2fe', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    dateBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    dateText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
    monthText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    actionText: { color: '#818cf8', fontWeight: 'medium', fontSize: 12 },
    darkNote: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    darkNoteText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '500' },
    statItem: { alignItems: 'center', flex: 1 },
    statLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
    statValue: { fontWeight: 'bold', color: '#0f172a', fontSize: 16 },
    actionButton: { backgroundColor: '#eef2ff', borderWidth: 1, borderColor: '#e0e7ff', padding: 24, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    plusIcon: { backgroundColor: '#4f46e5', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    actionButtonText: { color: '#4f46e5', fontWeight: 'bold' },
    tabContentBox: { backgroundColor: 'white', borderRadius: 32, borderWidth: 1, borderColor: '#f1f5f9', marginTop: 16, padding: 24 },
    tabHeading: { color: '#1e293b', fontSize: 18, fontWeight: 'bold', marginBottom: 16, paddingHorizontal: 4 },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
    listTitle: { fontWeight: 'bold', color: '#1e293b', fontSize: 16, marginBottom: 4 },
    listSubtitle: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
    listSubtitleThin: { fontSize: 12, color: '#94a3b8', fontWeight: '500', letterSpacing: -0.2 },
    hoursBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    hoursText: { fontWeight: 'bold', color: '#4f46e5', fontSize: 14 },
    moneyText: { fontWeight: 'bold', color: '#0f172a', fontSize: 18 },
    pillBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, marginTop: 4 },
    pillBadgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
    emptyState: { alignItems: 'center', py: 40, paddingVertical: 40 },
    emptyText: { color: '#94a3b8', fontStyle: 'italic' },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalDismiss: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32 },
    modalHandle: { width: 48, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, alignSelf: 'center', marginBottom: 32 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 24 },
    inputLabel: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
    input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 16, padding: 16, color: '#1e293b', fontWeight: 'bold' },
    confirmButton: { backgroundColor: '#4f46e5', paddingVertical: 20, borderRadius: 24, alignItems: 'center', marginTop: 16 },
    confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});
