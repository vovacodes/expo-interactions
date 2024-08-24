import { ScrollView, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrototypesHomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={
          {
            // backgroundColor: "red",
          }
        }
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Link
            href="./skia-layout-transitions"
            style={{ textDecorationLine: "underline", fontSize: 16 }}
          >
            Skia Enter/Exit Layout Transitions
          </Link>
          <Link
            href="./shiny-text"
            style={{ textDecorationLine: "underline", fontSize: 16 }}
          >
            Shiny Text
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
