import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthScreen from "../components/AuthScreen";
import { TabBar } from "../components/TabBar";
import { Colors } from "../constants/Colors";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return (
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
        <AuthScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <Tabs 
        tabBar={props => <TabBar {...props} />}
        screenOptions={{ 
          headerShown: false,
          sceneStyle: { backgroundColor: Colors.background } 
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="balance" options={{ title: "Balance" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}
