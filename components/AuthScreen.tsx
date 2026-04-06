import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Keyboard,
    Platform,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { useAuthStore } from '../store/authStore';

import { Colors } from '../constants/Colors';
import { AuthHeader } from './auth/AuthHeader';
import { AuthTabBar } from './auth/AuthTabBar';
import { LoggedInCard } from './auth/LoggedInCard';
import { Button } from './ui/Button';
import { ErrorBanner } from './ui/ErrorBanner';
import { Input } from './ui/Input';

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
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid={true}
            extraHeight={Platform.OS === 'ios' ? 40 : 120}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Animated.View style={{ alignItems: 'center', width: '100%' }} layout={LinearTransition.springify().stiffness(300)}>
                <AuthHeader />

                <Animated.View style={styles.formContainer} layout={LinearTransition.springify().stiffness(300)}>
                    <Animated.Text style={styles.formTitle} layout={LinearTransition.springify().stiffness(300)}>Get started</Animated.Text>
                    <Animated.Text style={styles.formSubtitle} layout={LinearTransition.springify().stiffness(300)}>
                        Sign in to your account or create a new one
                    </Animated.Text>

                    <Animated.View layout={LinearTransition.springify().stiffness(300)}>
                        <AuthTabBar activeTab={activeTab} onTabChange={handleTabSwitch} />
                    </Animated.View>

                    <Animated.View layout={LinearTransition.springify().stiffness(300)}>
                        <ErrorBanner error={globalError} />
                    </Animated.View>

                    <Animated.View layout={LinearTransition.springify().stiffness(300)}>
                        {activeTab === 'signup' && (
                            <Animated.View entering={FadeInUp.springify().stiffness(300)} exiting={FadeOutUp.duration(150)}>
                                <Controller
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Full Name"
                                            placeholder="Enter your full name"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            error={errors.name?.message as string}
                                        />
                                    )}
                                />
                            </Animated.View>
                        )}

                        <Animated.View layout={LinearTransition.springify().stiffness(300)}>
                            <Controller
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' }
                                }}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Email"
                                        placeholder="Enter your email"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.email?.message as string}
                                    />
                                )}
                            />
                        </Animated.View>

                        <Animated.View layout={LinearTransition.springify().stiffness(300)}>
                            <Controller
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Minimum 6 characters' }
                                }}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Password"
                                        placeholder={activeTab === 'signin' ? "Enter your password" : "Create a password"}
                                        isPassword
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        error={errors.password?.message as string}
                                    />
                                )}
                            />
                        </Animated.View>

                        {activeTab === 'signup' && (
                            <Animated.View entering={FadeInUp.springify().stiffness(300)} exiting={FadeOutUp.duration(150)}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: 'Confirmed password is required',
                                        validate: val => val === watch('password') || 'Passwords do not match'
                                    }}
                                    name="confirmPassword"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Confirm Password"
                                            placeholder="Confirm your password"
                                            isPassword
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            error={errors.confirmPassword?.message as string}
                                        />
                                    )}
                                />
                            </Animated.View>
                        )}

                        <Animated.View layout={LinearTransition.springify().stiffness(300)}>
                            <Button
                                title={activeTab === 'signin' ? "Sign In" : "Create Account"}
                                onPress={handleSubmit(onSubmit)}
                                isLoading={isLoading}
                            />
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingBottom: 80
    },
    formContainer: {
        backgroundColor: Colors.card,
        padding: 24, // p-6
        borderRadius: 24, // rounded-3xl
        width: '90%',
        maxWidth: 400
    },
    formTitle: {
        color: Colors.white,
        fontSize: 24, // text-2xl
        fontWeight: '600',
        marginBottom: 4 // mb-1
    },
    formSubtitle: {
        color: Colors.textMuted, // text-gray-400
        fontSize: 15,
        marginBottom: 24 // mb-6
    }
});