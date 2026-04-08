import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, useThemeColors } from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SettingsAndLogoutProps {
    onLogout: () => void;
    isLoggingOut?: boolean;
}

export function SettingsAndLogout({ onLogout, isLoggingOut }: SettingsAndLogoutProps) {
    const logoutScale = useSharedValue(1);
    const { theme, toggleTheme } = useThemeStore();
    const themeColors = useThemeColors();

    const animatedLogoutStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoutScale.value }]
    }));

    return (
        <>
            <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.settingsSection}>
                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Settings</Text>
                <View style={[styles.card, { backgroundColor: 'transparent' }]}>
                    <LinearGradient
                        colors={theme === 'dark' ? ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)'] : ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.05)']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, borderWidth: 1, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)' }]}
                    />
                    <View style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Feather name="moon" size={20} color={themeColors.text} />
                            <Text style={[styles.settingText, { color: themeColors.text }]}>Dark Mode</Text>
                        </View>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ true: themeColors.primary, false: '#ccc' }}
                        />
                    </View>
                </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.logoutContainer}>
                <AnimatedPressable
                    disabled={isLoggingOut}
                    onPressIn={() => { if (!isLoggingOut) logoutScale.value = withSpring(0.95); }}
                    onPressOut={() => { logoutScale.value = withSpring(1); }}
                    onPress={isLoggingOut ? undefined : onLogout}
                    style={[styles.logoutButton, animatedLogoutStyle, isLoggingOut && { opacity: 0.7 }]}
                >
                    {isLoggingOut ? (
                        <ActivityIndicator color="#f87171" style={{ marginRight: 8 }} />
                    ) : (
                        <Feather name="log-out" size={20} color="#f87171" style={{ marginRight: 8 }} />
                    )}
                    <Text style={styles.logoutText}>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</Text>
                </AnimatedPressable>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    settingsSection: {
        marginBottom: 0,
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    card: {
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
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
        marginBottom: 100
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