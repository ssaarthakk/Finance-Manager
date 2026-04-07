import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import { useThemeColors } from '../../constants/Colors';

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
}

export function NotificationModal({ visible, onClose }: NotificationModalProps) {
    const themeColors = useThemeColors();

    if (!visible) return null;

    return (
        <Modal 
            visible={visible} 
            transparent={true} 
            animationType="none" 
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View 
                    entering={SlideInRight} 
                    exiting={SlideOutRight}
                    style={[styles.panel, { backgroundColor: themeColors.background }]}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <View style={[styles.header, { borderColor: themeColors.border }]}>
                            <Text style={[styles.title, { color: themeColors.text }]}>Notifications</Text>
                            <Pressable onPress={onClose} style={styles.closeBtn}>
                                <Feather name="x" size={24} color={themeColors.text} />
                            </Pressable>
                        </View>
                        <View style={styles.content}>
                            <Feather name="bell-off" size={48} color={themeColors.textMuted} style={styles.icon} />
                            <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>No new notifications</Text>
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    panel: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeBtn: {
        padding: 4,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 16,
        opacity: 0.8,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
    }
});