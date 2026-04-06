import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { useAuthStore } from '../store/authStore';

import { AuthHeader } from './auth/AuthHeader';
import { AuthTabBar } from './auth/AuthTabBar';
import { LoggedInCard } from './auth/LoggedInCard';
import { LoginForm } from './auth/LoginForm';
import { SignupForm } from './auth/SignupForm';
import { ErrorBanner } from './ui/ErrorBanner';

export default function AuthScreen() {
    const { currentUser, login, signUp, logout } = useAuthStore();

    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: any) => {
        Keyboard.dismiss();
        setGlobalError('');
        setIsLoading(true);

        try {
            if (activeTab === 'signin') {
                await login(data.email, data.password);
            } else {
                await signUp(data.name, data.email, data.password);
            }
        } catch (error: any) {
            setGlobalError(error.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabSwitch = (tab: 'signin' | 'signup') => {
        if (activeTab === tab) return;
        setActiveTab(tab);
        setGlobalError('');
        reset();
    };

    if (currentUser) {
        return <LoggedInCard email={currentUser.email} onLogout={logout} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <AuthHeader />

                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Get started</Text>
                    <Text style={styles.formSubtitle}>
                        Sign in to your account or create a new one
                    </Text>

                    <AuthTabBar activeTab={activeTab} onTabChange={handleTabSwitch} />

                    <ErrorBanner error={globalError} />

                    {activeTab === 'signin' ? (
                        <LoginForm
                            control={control}
                            errors={errors}
                            onSubmit={handleSubmit(onSubmit)}
                            isLoading={isLoading}
                        />
                    ) : (
                        <SignupForm
                            control={control}
                            errors={errors}
                            watch={watch}
                            onSubmit={handleSubmit(onSubmit)}
                            isLoading={isLoading}
                        />
                    )}

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e0e0e'
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40
    },
    formContainer: {
        backgroundColor: '#1c1c1c',
        padding: 24, // p-6
        borderRadius: 24, // rounded-3xl
        width: '90%',
        maxWidth: 400
    },
    formTitle: {
        color: 'white',
        fontSize: 24, // text-2xl
        fontWeight: '600',
        marginBottom: 4 // mb-1
    },
    formSubtitle: {
        color: '#9ca3af', // text-gray-400
        fontSize: 15,
        marginBottom: 24 // mb-6
    }
});