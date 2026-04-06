import React from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SignupFormProps {
    control: any;
    errors: any;
    watch: any;
    onSubmit: () => void;
    isLoading: boolean;
}

export function SignupForm({ control, errors, watch, onSubmit, isLoading }: SignupFormProps) {
    const passwordValue = watch('password');

    return (
        <View>
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
                        placeholder="Create a password"
                        isPassword
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message as string}
                    />
                )}
            />

            <Controller
                control={control}
                rules={{
                    required: 'Confirmed password is required',
                    validate: val => val === passwordValue || 'Passwords do not match'
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

            <Button title="Create Account" onPress={onSubmit} isLoading={isLoading} />
        </View>
    );
}