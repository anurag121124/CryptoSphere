import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,  // This hides the header for all screens
        contentStyle: { backgroundColor: '#121212' },
        animation: 'slide_from_right',
      }}
    >
      {/* If you need to customize specific screens, you can add them here */}
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}