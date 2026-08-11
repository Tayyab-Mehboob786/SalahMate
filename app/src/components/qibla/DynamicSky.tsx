import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  Easing 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useLivePrayerTimings } from '@/hooks/prayer/useLivePrayerTimings';

const { width, height } = Dimensions.get('window');

const getSkyPhase = (prayerName: string | undefined) => {
  switch (prayerName) {
    case 'Fajr': return 'DAWN';
    case 'Sunrise':
    case 'Dhuhr': return 'DAY';
    case 'Asr': return 'EVENING';
    case 'Maghrib': return 'TWILIGHT';
    case 'Isha':
    case 'None':
    default: return 'NIGHT';
  }
};

const GRADIENTS = {
  DAWN: ['#281E5D', '#6A3A7C', '#D35400', '#F39C12'] as const,
  DAY: ['#5DADE2', '#85C1E9', '#EBF5FB', '#FFFFFF'] as const,
  EVENING: ['#D35400', '#F39C12', '#5DADE2', '#EBF5FB'] as const,
  TWILIGHT: ['#D35400', '#E74C3C', '#8E44AD', '#2C3E50'] as const,
  NIGHT: ['#0A192F', '#112240', '#020C1B', '#000000'] as const,
};

const STAR_COUNT = 30;
const CLOUD_COUNT = 3;

// Lightweight Twinkling Star
const Star = ({ index }: { index: number }) => {
  const opacity = useSharedValue(Math.random() * 0.5 + 0.1);
  const size = Math.random() * 2 + 1;
  const top = Math.random() * (height * 0.6);
  const left = Math.random() * width;
  
  useEffect(() => {
    setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(Math.random() * 0.8 + 0.2, { duration: 1500 + Math.random() * 2000 }),
          withTiming(0.1, { duration: 1500 + Math.random() * 2000 })
        ),
        -1,
        true
      );
    }, Math.random() * 2000);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.star, 
        style, 
        { top, left, width: size, height: size, borderRadius: size / 2 }
      ]} 
    />
  );
};

// Drifting Cloud
const Cloud = ({ index }: { index: number }) => {
  const translateX = useSharedValue(-200 - Math.random() * 100);
  const top = Math.random() * (height * 0.4) + 50;
  const scale = Math.random() * 0.5 + 0.8;
  const opacity = Math.random() * 0.4 + 0.2;
  const speed = 25000 + Math.random() * 15000;

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width + 200, { duration: speed, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale }],
  }));

  return (
    <Animated.View style={[styles.cloudWrapper, style, { top, opacity }]}>
      <View style={styles.cloudPart1} />
      <View style={styles.cloudPart2} />
      <View style={styles.cloudPart3} />
    </Animated.View>
  );
};

export const DynamicSky = React.memo(() => {
  const { currentPrayer } = useLivePrayerTimings();
  const phase = getSkyPhase(currentPrayer?.name);

  // Layer Opacities
  const opDawn = useSharedValue(0);
  const opDay = useSharedValue(0);
  const opEvening = useSharedValue(0);
  const opTwilight = useSharedValue(0);
  const opNight = useSharedValue(1); // Default

  useEffect(() => {
    const duration = 2000;
    opDawn.value = withTiming(phase === 'DAWN' ? 1 : 0, { duration });
    opDay.value = withTiming(phase === 'DAY' ? 1 : 0, { duration });
    opEvening.value = withTiming(phase === 'EVENING' ? 1 : 0, { duration });
    opTwilight.value = withTiming(phase === 'TWILIGHT' ? 1 : 0, { duration });
    opNight.value = withTiming(phase === 'NIGHT' ? 1 : 0, { duration });
  }, [phase]);

  const styleDawn = useAnimatedStyle(() => ({ opacity: opDawn.value }));
  const styleDay = useAnimatedStyle(() => ({ opacity: opDay.value }));
  const styleEvening = useAnimatedStyle(() => ({ opacity: opEvening.value }));
  const styleTwilight = useAnimatedStyle(() => ({ opacity: opTwilight.value }));
  const styleNight = useAnimatedStyle(() => ({ opacity: opNight.value }));

  // Particles visibility
  const styleStars = useAnimatedStyle(() => ({ 
    opacity: withTiming(phase === 'NIGHT' || phase === 'DAWN' || phase === 'TWILIGHT' ? 1 : 0, { duration: 2000 }) 
  }));
  
  const styleClouds = useAnimatedStyle(() => ({ 
    opacity: withTiming(phase === 'DAY' || phase === 'EVENING' ? 1 : 0, { duration: 2000 }) 
  }));

  const stars = useMemo(() => Array.from({ length: STAR_COUNT }).map((_, i) => <Star key={i} index={i} />), []);
  const clouds = useMemo(() => Array.from({ length: CLOUD_COUNT }).map((_, i) => <Cloud key={i} index={i} />), []);

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Gradients */}
      <Animated.View style={[StyleSheet.absoluteFill, styleNight]}>
        <LinearGradient colors={GRADIENTS.NIGHT} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styleTwilight]}>
        <LinearGradient colors={GRADIENTS.TWILIGHT} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styleEvening]}>
        <LinearGradient colors={GRADIENTS.EVENING} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styleDawn]}>
        <LinearGradient colors={GRADIENTS.DAWN} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, styleDay]}>
        <LinearGradient colors={GRADIENTS.DAY} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Particles */}
      <Animated.View style={[StyleSheet.absoluteFill, styleStars]}>
        {stars}
      </Animated.View>
      
      <Animated.View style={[StyleSheet.absoluteFill, styleClouds]}>
        {clouds}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cloudWrapper: {
    position: 'absolute',
    width: 150,
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cloudPart1: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    marginLeft: 20,
    marginBottom: -10,
  },
  cloudPart2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    marginLeft: -30,
  },
  cloudPart3: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    marginLeft: -25,
    marginBottom: -5,
  },
});
