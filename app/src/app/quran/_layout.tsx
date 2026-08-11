import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import type { SalahMateTheme } from '@/theme';

export default function QuranLayout() {
  const theme = useTheme<SalahMateTheme>();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: theme.colors.background,
        }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="browse" />
      <Stack.Screen name="reader" />
      {/* Placeholders for future routes */}
      {/* <Stack.Screen name="juz" /> */}
      {/* <Stack.Screen name="bookmarks" /> */}
      {/* <Stack.Screen name="search" /> */}
      {/* <Stack.Screen name="reader" /> */}
    </Stack>
  );
}
