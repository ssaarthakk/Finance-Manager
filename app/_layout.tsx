import { Tabs } from "expo-router";
import AuthScreen from "../components/AuthScreen";
import { TabBar } from "../components/TabBar";
import { useAuthStore } from "../store/authStore";
import { Colors } from "../constants/Colors";
import { View } from "react-native";

export default function RootLayout() {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <AuthScreen />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
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
    </View>
  );
}
