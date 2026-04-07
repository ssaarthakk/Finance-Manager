import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface UserInfoCardProps {
    isEditMode: boolean;
    name: string;
    email: string;
    onNameChange: (n: string) => void;
    onEmailChange: (e: string) => void;
    onSave?: () => void;
}

export function UserInfoCard({ isEditMode, name, email, onNameChange, onEmailChange, onSave }: UserInfoCardProps) {
    return (
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(0,0,0,0.8)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' }]}
            />
            <View style={styles.fieldSection}>
                <Text style={styles.label}>Full Name</Text>
                {isEditMode ? (
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={onNameChange} 
                        placeholder="Enter full name"
                        autoCapitalize="words"
                        placeholderTextColor={Colors.textMuted}
                    />
                ) : (
                    <Text style={styles.value}>{name || 'Not provided'}</Text>
                )}
            </View>
            <View style={styles.separator} />
            <View style={styles.fieldSection}>
                <Text style={styles.label}>Email Address</Text>
                {isEditMode ? (
                    <TextInput 
                        style={styles.input} 
                        value={email} 
                        onChangeText={onEmailChange} 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Enter email address"
                        placeholderTextColor={Colors.textMuted}
                    />
                ) : (
                    <Text style={styles.value}>{email}</Text>
                )}
            </View>

            {isEditMode && (
                <Pressable style={styles.saveButton} onPress={onSave}>
                    <Text style={styles.saveButtonText}>Save Details</Text>
                </Pressable>
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