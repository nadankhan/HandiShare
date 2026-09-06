import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/auth-store';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const init = useAuthStore((state) => state.init);
  const initializing = useAuthStore((state) => state.initializing);
  const uid = useAuthStore((state) => state.uid);
  const group = useAuthStore((state) => state.group);
  const profile = useAuthStore((state) => state.profile);

  useEffect(() => init(), [init]);

  const isSignedIn = Boolean(uid);
  const hasGroup = Boolean(profile?.groupId && group);

  if (initializing) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.dark.background,
        }}
      >
        <ActivityIndicator color={Colors.dark.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!initializing && !isSignedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={!initializing && isSignedIn && !hasGroup}>
            <Stack.Screen name="(onboarding)" />
          </Stack.Protected>
          <Stack.Protected guard={!initializing && isSignedIn && hasGroup}>
            <Stack.Screen name="(tabs)" />
          </Stack.Protected>
          <Stack.Screen
            name="add-task"
            options={{ presentation: 'modal', title: 'New Task' }}
          />
          <Stack.Screen
            name="add-item"
            options={{ presentation: 'modal', title: 'New Item' }}
          />
          <Stack.Screen
            name="add-expense"
            options={{ presentation: 'modal', title: 'New Expense' }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
