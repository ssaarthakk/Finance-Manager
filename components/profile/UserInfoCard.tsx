import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors, useThemeColors } from '../../constants/Colors';
import { useThemeStore } from '../../store/themeStore';

interface UserInfoCardProps {
    isEditMode: boolean;
    name: string;
    email: string;
    onNameChange: (n: string) => void;
    onEmailChange: (e: string) => void;
    onSave?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SaveButton({ onSave }: { onSave?: () => void }) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <AnimatedPressable 
            style={[styles.saveButton, animatedStyle]} 
            onPress={onSave}
            onPressIn={() => scale.value = withSpring(0.95)}
            onPressOut={() => scale.value = withSpring(1)}
        >
            <Text style={styles.saveButtonText}>Save Details</Text>
        </AnimatedPressable>
    );
}

export function UserInfoCard({ isEditMode, name, email, onNameChange, onEmailChange, onSave }: UserInfoCardProps) {
    const { theme } = useThemeStore();
    const themeColors = useThemeColors();

    return (
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.card}>
            <LinearGradient
              colors={theme === 'dark' ? ['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)'] : ['rgba(255,255,255,0.8)', 'rgba(0,0,0,0.05)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 20, borderWidth: 1, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.1)' }]}
            />
            <View style={styles.fieldSection}>
                <Text style={[styles.label, { color: themeColors.textMuted }]}>Full Name</Text>
                {isEditMode ? (
                    <TextInput 
                        style={[styles.input, { color: themeColors.text, backgroundColor: theme === 'dark' ? '#222' : '#f3f4f6' }]} 
                        value={name} 
                        onChangeText={onNameChange} 
                        placeholder="Enter full name"
                        autoCapitalize="words"
                        placeholderTextColor={themeColors.textMuted}
                    />
                ) : (
                    <Text style={[styles.value, { color: themeColors.text }]}>{name || 'Not provided'}</Text>
                )}
            </View>
            <View style={[styles.separator, { backgroundColor: themeColors.layer1 }]} />
            <View style={styles.fieldSection}>
                <Text style={[styles.label, { color: themeColors.textMuted }]}>Email Address</Text>
                {isEditMode ? (
                    <TextInput 
                        style={[styles.input, { color: themeColors.text, backgroundColor: theme === 'dark' ? '#222' : '#f3f4f6' }]} 
                        value={email} 
                        onChangeText={onEmailChange} 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter email address"
                        placeholderTextColor={themeColors.textMuted}
                    />
                ) : (
                    <Text style={[styles.value, { color: themeColors.text }]}>{email}</Text>
                )}
            </View>

            {isEditMode && (
                <SaveButton onSave={onSave} />
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'transparent',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    fieldSection: {
        paddingVertical: 12,
    },
    separator: {
        height: 1,
        backgroundColor: '#2A2A2A',
    },
    label: {
        color: Colors.textMuted,
        fontSize: 12,
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#3A3A3A',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    saveButtonText: {
        color: Colors.black,
        fontWeight: 'bold',
        fontSize: 16,
    }
});