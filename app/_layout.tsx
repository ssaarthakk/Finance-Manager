import { Stack } from "expo-router";
import AuthScreen from "../components/AuthScreen";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const { currentUser } = useAuthStore();

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
