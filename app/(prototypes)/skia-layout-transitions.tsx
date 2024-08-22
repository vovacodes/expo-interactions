import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Blur,
  Canvas,
  Group,
  Paint,
  Rect,
  RoundedRect,
} from "@shopify/react-native-skia";
import {
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Presence, PresenceChild } from "@/components/Presence";

export default function SkiaLayoutTransitionsScreen() {
  const size = useSharedValue({
    width: 0,
    height: 0,
  });

  const rect = useDerivedValue(() => {
    // Center the rect in the canvas
    return {
      x: (size.value.width - 256) / 2,
      y: (size.value.height - 256) / 2,
      width: 256,
      height: 256,
    };
  });

  const roundedRect = useDerivedValue(() => {
    // Center the rect in the canvas
    return {
      rect: rect.value,
      rx: 999,
      ry: 999,
    };
  });

  const [shape, setShape] = useState<"rect" | "circle">("rect");

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(setShape)(shape === "rect" ? "circle" : "rect");
  });

  const blur = useSharedValue(0);
  const scale = useSharedValue(1);

  function handleEntering() {
    blur.value = withTiming(0, { duration: 1000 });
    scale.value = withTiming(1, { duration: 1000 });
  }

  function handleExiting(safeToRemove: () => void) {
    blur.value = withTiming(40, { duration: 1000 });
    scale.value = withTiming(0.1, { duration: 1000 }, () => {
      runOnJS(safeToRemove)();
    });
  }

  const itemOrigin = useDerivedValue(() => {
    // center of the item
    return {
      x: rect.value.x + rect.value.width / 2,
      y: rect.value.y + rect.value.height / 2,
    };
  });
  const itemTransform = useDerivedValue(() => {
    return [{ scale: scale.value }];
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/beach.jpg")}
        style={[StyleSheet.absoluteFill]}
        resizeMode={"cover"}
      />
      <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
        <GestureDetector gesture={tapGesture}>
          <Canvas
            style={{
              width: "100%",
              aspectRatio: 1 /*backgroundColor: "pink"*/,
            }}
            onSize={size}
          >
            <Group
              layer={
                <Paint>
                  <Blur blur={blur} />
                </Paint>
              }
            >
              <Presence stateKey={shape}>
                {({ stateKey }) => {
                  return stateKey === "rect" ? (
                    <PresenceChild
                      key={shape}
                      onEntering={handleEntering}
                      onExiting={handleExiting}
                    >
                      <Group origin={itemOrigin} transform={itemTransform}>
                        <Rect rect={rect} color="orange" />
                      </Group>
                    </PresenceChild>
                  ) : (
                    <PresenceChild
                      key={shape}
                      onEntering={handleEntering}
                      onExiting={handleExiting}
                    >
                      <Group origin={itemOrigin} transform={itemTransform}>
                        <RoundedRect rect={roundedRect} color="tomato" />
                      </Group>
                    </PresenceChild>
                  );
                }}
              </Presence>
            </Group>
          </Canvas>
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
}
