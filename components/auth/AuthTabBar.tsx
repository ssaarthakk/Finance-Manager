import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface AuthTabBarProps {
  activeTab: 'signin' | 'signup';
  onTabChange: (tab: 'signin' | 'signup') => void;
}

export function AuthTabBar({ activeTab, onTabChange }: AuthTabBarProps) {
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeTab === 'signin' ? 0 : tabWidth,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  }, [activeTab, tabWidth]);

  const onLayout = (e: LayoutChangeEvent) => {
    setTabWidth(e.nativeEvent.layout.width / 2);
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View
        style={[
          styles.activeBackground,
          {
            width: tabWidth,
            transform: [{ translateX }],
          },
        ]}
      />
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('signin')}
      >
        <Text style={[styles.tabText, activeTab === 'signin' ? styles.activeTabText : styles.inactiveTabText]}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabChange('signup')}
      >
        <Text style={[styles.tabText, activeTab === 'signup' ? styles.activeTabText : styles.inactiveTabText]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    borderRadius: 9999, // rounded-full
    padding: 4,
    marginBottom: 24,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    backgroundColor: Colors.white,
    borderRadius: 9999,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    zIndex: 1,
  },
  tabText: {
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.black,
  },
  inactiveTabText: {
    color: Colors.textMuted, // text-gray-400
  }
});