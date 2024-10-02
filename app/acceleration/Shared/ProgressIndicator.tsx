import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface Props {
  remainingTime: number;
}

const CIRCLE_RADIUS = 20; // The radius of the progress circle
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // The circumference of the circle, used for the progress animation

// Creating an animated version of the SVG Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressIndicator({ remainingTime }: Props) {
  // Animated value to track the progress (0 to 100)
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animationDuration = 60000 - remainingTime; // Calculate the remaining time for the animation (in milliseconds)

    // Trigger the progress animation that lasts for the remaining time (up to 60 seconds)
    Animated.timing(progressAnim, {
      toValue: 100, // Progress to 100% (full circle)
      duration: animationDuration, // Animation duration is based on the remaining time
      useNativeDriver: false, // Native driver can't handle strokeDashoffset, so we disable it
    }).start();
  }, [remainingTime]);

  // Map the animated value (0 to 100) to the strokeDashoffset of the progress circle
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100], // Interpolation range from 0% to 100% progress
    outputRange: [CIRCLE_CIRCUMFERENCE, 0], // Progress starts with a full circle and moves to 0 (complete)
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressCircleContainer}>
        <Svg height={120} width={120}>
          <G rotation={"-90"} origin={"60, 60"}>
            {/* Background circle (static, light grey) */}
            <Circle
              cx={60}
              cy={60}
              r={CIRCLE_RADIUS}
              stroke="#e0e0e0" // Light grey background circle
              strokeWidth={5}
              fill="none"
            />
            {/* Animated progress circle */}
            <AnimatedCircle
              cx={60}
              cy={60}
              r={CIRCLE_RADIUS}
              stroke="#007AFF" // Blue progress color
              strokeWidth={5}
              fill="none"
              strokeDasharray={CIRCLE_CIRCUMFERENCE} // Total length of the circle's path
              strokeDashoffset={strokeDashoffset} // Animated stroke offset (decreases as progress increases)
            />
          </G>
        </Svg>
        {/* Display text below the progress circle */}
        <Text style={styles.text}>
          Collecting enough data to generate graph
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%", // Set the container width
    alignItems: "center", // Center items horizontally
    justifyContent: "center", // Center items vertically
  },
  progressCircleContainer: {
    marginVertical: 10, // Vertical margin for spacing
    alignItems: "center", // Center circle horizontally
    justifyContent: "center", // Center circle vertically
  },
  text: {
    fontSize: 14, // Font size for the text
    color: "green", // Text color
    textAlign: "center", // Center-align text
  },
});
