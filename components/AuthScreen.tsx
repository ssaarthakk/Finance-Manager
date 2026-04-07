import React from 'react';
import {
    Platform,
    StyleSheet
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { useThemeColors } from '../constants/Colors';
import { AuthCard } from './auth/AuthCard';
import { AuthHeader } from './auth/AuthHeader';

export default function AuthScreen() {
    const themeColors = useThemeColors();
    return (
        <KeyboardAwareScrollView
            style={[styles.container, { backgroundColor: themeColors.background }]}
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid={true}
            extraHeight={Platform.OS === 'ios' ? 40 : 120}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Animated.View style={{ alignItems: 'center', width: '100%' }} layout={LinearTransition.springify().stiffness(300)}>
                <AuthHeader />
                <AuthCard />
            </Animated.View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingBottom: 80
    }
});