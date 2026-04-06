import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface LoginFormProps {
    control: any;
    errors: any;
    onSubmit: () => void;
    isLoading: boolean;
}

export function LoginForm({ control, errors, onSubmit, isLoading }: LoginFormProps) {
    return (
        <View>
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
                        placeholder="Enter your password"
                        isPassword
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message as string}
                    // rightElement={
                    //   <TouchableOpacity className="mt-4">
                    //     <Text className="text-white text-[13px] text-right font-medium">Forgot password?</Text>
                    //   </TouchableOpacity>
                    // }
                    />
                )}
            />

            <Button title="Sign In" onPress={onSubmit} isLoading={isLoading} />
        </View>
    );
}