import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import Animated, { FadeInDown, useSharedValue, withSpring } from 'react-native-reanimated';
import Feather from '@expo/vector-icons/Feather';
import { Colors } from '../../constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SettingsAndLogoutProps {
    onLogout: () => void;
}

export function SettingsAndLogout({ onLogout }: SettingsAndLogoutProps) {
    const logoutScale = useSharedValue(1);

    return (
        <>
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.card}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Feather name="moon" size={20} color={Colors.white} />
                            <Text style={styles.settingText}>Dark Mode</Text>
                        </View>
                        <Switch value={true} trackColor={{ true: Colors.primary, false: '#555' }} />
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Feather name="info" size={20} color={Colors.white} />
                            <Text style={styles.settingText}>App Version</Text>
                        </View>
                        <Text style={styles.versionText}>1.0.0</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Logout */}
            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.logoutContainer}>
                <AnimatedPressable 
                    onPressIn={() => { logoutScale.value = withSpring(0.95); }}
                    onPressOut={() => { logoutScale.value = withSpring(1); }}
                    onPress={onLogout}
                    style={[styles.logoutButton, { transform: [{ scale: logoutScale }] }]}
                >
                    <Feather name="log-out" size={20} color="#f87171" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </AnimatedPressable>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    settingsSection: {
        marginBottom: 10,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        color: Colors.white,
        fontSize: 16,
        marginLeft: 12,
    },
    versionText: {
        color: Colors.textMuted,
        fontSize: 15,
    },
    separator: {
        height: 1,
        backgroundColor: '#2A2A2A',
    },
    logoutContainer: {
        marginTop: 30, 
        marginBottom: 50 
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#f8717115',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f8717130',
    },
    logoutText: {
        color: '#f87171',
        fontSize: 16,
        fontWeight: 'bold',
    },
});