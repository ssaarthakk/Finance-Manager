import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useThemeColors } from '../../constants/Colors';

export function AuthHeader() {
  const themeColors = useThemeColors();
  const styles = getStyles(themeColors);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/images/Logo.png')} 
          style={styles.logoImage} 
        />
      </View>
      <Text style={styles.title}>
        Welcome to FlowFi
      </Text>
      <Text style={styles.subtitle}>
        Track your money. Master your flow.
      </Text>
    </View>
  );
}

const getStyles = (themeColors: ReturnType<typeof useThemeColors>) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderRadius: 10,
  },
  logoImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: themeColors.text,
    textAlign: 'center',
    letterSpacing: -0.5, // tracking-tight
  },
  subtitle: {
    color: themeColors.textMuted, // text-gray-400
    fontSize: 15,
    textAlign: 'center',
  }
});