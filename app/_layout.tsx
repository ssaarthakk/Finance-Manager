import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthScreen from "../components/AuthScreen";
import { TabBar } from "../components/TabBar";
import { useThemeColors } from "../constants/Colors";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

export default function RootLayout() {
  const { currentUser } = useAuthStore();
  const { theme } = useThemeStore();
  const themeColors = useThemeColors();

  if (!currentUser) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: themeColors.background }}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <AuthScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Tabs 
        tabBar={props => <TabBar {...props} />}
        screenOptions={{ 
          headerShown: false,
          sceneStyle: { backgroundColor: themeColors.background } 
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="balance" options={{ title: "Balance" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}
