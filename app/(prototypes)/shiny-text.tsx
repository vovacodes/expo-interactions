import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  useAnimatedSensor,
  SensorType,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { easeGradient } from "react-native-easing-gradient";
import { RadialGradient } from "react-native-gradients";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const gradientColors = [
  { offset: "0%", color: "rgb(255,255,255)", opacity: "0.5" },
  // { offset: "50%", color: "rgb(255,255,255)", opacity: "0.2" },
  { offset: "100%", color: "rgb(255,255,255)", opacity: "0" },
  // { offset: "0%", color: "red", opacity: "1" },
  // { offset: "100%", color: "blue", opacity: "1" },
];

const { colors, locations } = easeGradient({
  colorStops: {
    0: {
      color: "rgba(255,255,255,0)",
    },
    0.5: {
      color: "rgba(255,255,255,0.5)",
    },
    1: {
      color: "rgba(255,255,255,0)",
    },
  },
});

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function ShinyText() {
  const progress = useSharedValue(-100);
  const deviceRotation = useAnimatedSensor(SensorType.ROTATION);

  const animatedStyle = useAnimatedStyle(() => ({
    // left: `${progress.value}%`,
    transform: [
      { translateX: `${deviceRotation.sensor.value.qy * 300}%` },
      { translateY: `${deviceRotation.sensor.value.qx * 30}%` },
    ],
  }));

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: deviceRotation.sensor.value.qy * 10 },
      { translateY: deviceRotation.sensor.value.qx * 10 },
    ],
  }));

  // Start the animation
  useEffect(() => {
    progress.value = withRepeat(
      withDelay(
        1000,
        withTiming(100, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      edges={["bottom", "left", "right"]}
    >
      <Animated.View style={[{ alignSelf: "center" }, parallaxStyle]}>
        {/* For size */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            opacity: 0,
          }}
        >
          Shiny Text
        </Text>
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <Text
              style={[
                {
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "black",
                },
              ]}
            >
              Shiny Text
            </Text>
          }
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(31,30,30,0.4)",
            }}
          />
          {/* <AnimatedLinearGradient
            colors={colors}
            locations={locations}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              {
                width: "100%",
                height: "100%",
                position: "absolute",
              },
              animatedStyle,
            ]}
          /> */}
          <Animated.View
            style={[
              {
                width: "100%",
                height: "200%",
                position: "absolute",
                top: "-100%",
                // backgroundColor: "green",
              },
              animatedStyle,
            ]}
          >
            <RadialGradient
              x="50%"
              y="50%"
              rx="50%"
              ry="50%"
              colorList={gradientColors}
            />
          </Animated.View>
        </MaskedView>
      </Animated.View>
    </SafeAreaView>
  );
}
