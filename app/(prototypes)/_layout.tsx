import { Stack } from "expo-router";

export default function PrototypesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="skia-layout-transitions"
        options={{
          title: "Skia Enter/Exit Layout Transitions",
          headerTitleStyle: { fontSize: 15 },
        }}
      />
    </Stack>
  );
}
