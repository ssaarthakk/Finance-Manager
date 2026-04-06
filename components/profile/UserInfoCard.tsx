import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface UserInfoCardProps {
    isEditMode: boolean;
    name: string;
    email: string;
    onNameChange: (n: string) => void;
    onEmailChange: (e: string) => void;
}

export function UserInfoCard({ isEditMode, name, email, onNameChange, onEmailChange }: UserInfoCardProps) {
    return (
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.card}>
            <View style={styles.fieldSection}>
                <Text style={styles.label}>Full Name</Text>
                {isEditMode ? (
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={onNameChange} 
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
                        placeholderTextColor={Colors.textMuted}
                    />
                ) : (
                    <Text style={styles.value}>{email}</Text>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1A1A1A',
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
        padding: 0,
        margin: 0,
    },
});