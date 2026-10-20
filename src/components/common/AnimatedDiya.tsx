import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  G,
  Ellipse,
  Circle,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';

interface AnimatedDiyaProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  showGlow?: boolean;
}

export const AnimatedDiya: React.FC<AnimatedDiyaProps> = ({
  size = 180,
  style,
  showGlow = true,
}) => {
  // Shared values for realistic, gentle flame flicker
  const flameScaleY = useSharedValue(1);
  const flameScaleX = useSharedValue(1);
  const flameRotate = useSharedValue(0);
  const auraOpacity = useSharedValue(0.4);

  useEffect(() => {
    // Height breathing cycle
    flameScaleY.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 420, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.95, { duration: 320, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.03, { duration: 380, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.97, { duration: 460, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Lateral flicker cycle
    flameScaleX.value = withRepeat(
      withSequence(
        withTiming(0.96, { duration: 360, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.04, { duration: 300, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.98, { duration: 440, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.02, { duration: 340, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );

    // Subtle sway angle (-2deg to +2deg)
    flameRotate.value = withRepeat(
      withSequence(
        withTiming(-1.8, { duration: 520, easing: Easing.inOut(Easing.sin) }),
        withTiming(2.2, { duration: 480, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1.2, { duration: 420, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.6, { duration: 400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Golden halo pulse
    auraOpacity.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.32, { duration: 550, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [flameScaleY, flameScaleX, flameRotate, auraOpacity]);

  const animatedFlameStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: size * 0.55 },
        { scaleY: flameScaleY.value },
        { scaleX: flameScaleX.value },
        { rotate: `${flameRotate.value}deg` },
        { translateY: -size * 0.55 },
      ],
    };
  });

  const animatedAuraStyle = useAnimatedStyle(() => {
    return {
      opacity: auraOpacity.value,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {/* 1. Ambient Golden Halo Aura */}
      {showGlow && (
        <Animated.View style={[StyleSheet.absoluteFill, animatedAuraStyle, styles.auraWrap]}>
          <Svg width={size} height={size} viewBox="0 0 200 200">
            <Defs>
              <RadialGradient id="auraGlow" cx="50%" cy="40%" r="50%">
                <Stop offset="0%" stopColor="#F0BF60" stopOpacity="0.8" />
                <Stop offset="40%" stopColor="#E8751A" stopOpacity="0.4" />
                <Stop offset="75%" stopColor="#FFDBC8" stopOpacity="0.15" />
                <Stop offset="100%" stopColor="#FFF8F0" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="100" cy="80" r="85" fill="url(#auraGlow)" />
          </Svg>
        </Animated.View>
      )}

      {/* 2. Sacred Reanimated Flame Layer */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedFlameStyle]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {/* Outer Sacred Saffron Gradient */}
            <LinearGradient id="outerFlameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
              <Stop offset="0%" stopColor="#C44E00" />
              <Stop offset="25%" stopColor="#E8751A" />
              <Stop offset="65%" stopColor="#F0BF60" />
              <Stop offset="90%" stopColor="#FFF0B3" />
              <Stop offset="100%" stopColor="#FFFFFF" />
            </LinearGradient>

            {/* Inner Radiant Core Gradient */}
            <LinearGradient id="innerFlameGrad" x1="50%" y1="100%" x2="50%" y2="0%">
              <Stop offset="0%" stopColor="#FFD470" />
              <Stop offset="30%" stopColor="#FFF2A3" />
              <Stop offset="75%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#FFFFFF" />
            </LinearGradient>
          </Defs>

          {/* Outer Teardrop Flame */}
          <Path
            d="M 100 114 C 82 104 76 82 84 65 C 89 53 96 40 100 28 C 104 40 111 53 116 65 C 124 82 118 104 100 114 Z"
            fill="url(#outerFlameGrad)"
          />

          {/* Inner Luminous Flame Core */}
          <Path
            d="M 100 112 C 89 104 86 88 91 74 C 95 64 98 52 100 42 C 102 52 105 64 109 74 C 114 88 111 104 100 112 Z"
            fill="url(#innerFlameGrad)"
            opacity={0.92}
          />

          {/* Deep Fire Heart Core */}
          <Ellipse cx="100" cy="98" rx="4.5" ry="7.5" fill="#FFFFFF" opacity={0.95} />
        </Svg>
      </Animated.View>

      {/* 3. Static Brass Lamp & Sculpted Lotus Base Layer */}
      <Svg width={size} height={size} viewBox="0 0 200 200" style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Polished Brass Lamp Metallic Gradient */}
          <LinearGradient id="brassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFF0B3" />
            <Stop offset="18%" stopColor="#E2B755" />
            <Stop offset="55%" stopColor="#B98E34" />
            <Stop offset="85%" stopColor="#7B5800" />
            <Stop offset="100%" stopColor="#4A1E0D" />
          </LinearGradient>

          {/* Brass Bevel Rim Highlight */}
          <LinearGradient id="brassRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#984700" />
            <Stop offset="25%" stopColor="#FFF4D0" />
            <Stop offset="50%" stopColor="#E2B755" />
            <Stop offset="75%" stopColor="#FFF4D0" />
            <Stop offset="100%" stopColor="#984700" />
          </LinearGradient>

          {/* Ghee / Sacred Oil Reservoir */}
          <LinearGradient id="oilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#4A1E0D" />
            <Stop offset="50%" stopColor="#7B5800" />
            <Stop offset="100%" stopColor="#D4A64A" />
          </LinearGradient>

          {/* Lotus Petal Ivory Gradient */}
          <LinearGradient id="lotusPetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="70%" stopColor="#FFFDF8" />
            <Stop offset="100%" stopColor="#F6EDDC" />
          </LinearGradient>

          {/* Lotus Rim Shading */}
          <LinearGradient id="lotusRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#DEC1B1" />
            <Stop offset="100%" stopColor="#B98E34" />
          </LinearGradient>
        </Defs>

        {/* --- Lotus Base --- */}
        <G id="lotusBase">
          {/* Left Far Petal */}
          <Path
            d="M 52 142 C 48 155 64 165 78 152 C 78 152 70 144 52 142 Z"
            fill="url(#lotusPetalGrad)"
            stroke="#DEC1B1"
            strokeWidth="1.2"
          />

          {/* Right Far Petal */}
          <Path
            d="M 148 142 C 152 155 136 165 122 152 C 122 152 130 144 148 142 Z"
            fill="url(#lotusPetalGrad)"
            stroke="#DEC1B1"
            strokeWidth="1.2"
          />

          {/* Left Mid Petal */}
          <Path
            d="M 68 143 C 68 160 88 168 92 149 C 84 144 76 143 68 143 Z"
            fill="url(#lotusPetalGrad)"
            stroke="#DEC1B1"
            strokeWidth="1.2"
          />

          {/* Right Mid Petal */}
          <Path
            d="M 132 143 C 132 160 112 168 108 149 C 116 144 124 143 132 143 Z"
            fill="url(#lotusPetalGrad)"
            stroke="#DEC1B1"
            strokeWidth="1.2"
          />

          {/* Central Royal Lotus Petal */}
          <Path
            d="M 85 145 C 85 168 100 174 100 174 C 100 174 115 168 115 145 Z"
            fill="url(#lotusPetalGrad)"
            stroke="#B98E34"
            strokeWidth="1.2"
          />

          {/* Lotus Base Ring */}
          <Ellipse
            cx="100"
            cy="172"
            rx="18"
            ry="3.5"
            fill="#B98E34"
            opacity={0.4}
          />
        </G>

        {/* --- Brass Deepam Basin --- */}
        <G id="brassLamp">
          {/* Main Deep Basin Curve */}
          <Path
            d="M 38 114 C 40 138 68 148 100 148 C 132 148 160 138 162 114 C 158 122 132 130 100 130 C 68 130 42 122 38 114 Z"
            fill="url(#brassGrad)"
          />

          {/* Basin Under-Shadow */}
          <Path
            d="M 54 136 C 68 147 84 149 100 149 C 116 149 132 147 146 136 C 132 145 116 148 100 148 C 84 148 68 145 54 136 Z"
            fill="#4A1E0D"
            opacity={0.4}
          />

          {/* Sacred Ghee / Oil Interior Reservoir */}
          <Ellipse
            cx="100"
            cy="114"
            rx="60"
            ry="11"
            fill="url(#oilGrad)"
          />

          {/* Upper Brass Lip Rim */}
          <Ellipse
            cx="100"
            cy="113"
            rx="62"
            ry="10.5"
            fill="none"
            stroke="url(#brassRim)"
            strokeWidth="2.5"
          />

          {/* Inner Golden Ghee Sheen */}
          <Ellipse
            cx="100"
            cy="115"
            rx="46"
            ry="6"
            fill="#D4A64A"
            opacity={0.5}
          />

          {/* Diya Wick Point / Charred Cotton Core */}
          <Path
            d="M 98 115 C 98 109 102 109 102 115 Z"
            fill="#3B1E08"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  auraWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
