import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
                    //   <TouchableOpacity style={styles.forgotPasswordButton}>
                    //     <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    //   </TouchableOpacity>
                    // }
                    />
                )}
            />

            <Button title="Sign In" onPress={onSubmit} isLoading={isLoading} />
        </View>
    );
}

const styles = StyleSheet.create({
    forgotPasswordButton: {
        marginTop: 16,
    },
    forgotPasswordText: {
        color: 'white',
        fontSize: 13,
        textAlign: 'right',
        fontWeight: '500',
    }
});