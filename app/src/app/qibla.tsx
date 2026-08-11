/**
 * SalahMate — Qibla Compass Module (`/qibla`)
 *
 * Precision spiritual alignment screen featuring a fixed circular Qibla compass dial,
 * a dynamic rotating needle, geographic location metrics,
 * distance calculation to the Holy Kaaba, and device calibration guidance.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor
} from 'react-native-reanimated';
import { AppIcon, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { DynamicSky } from '@/components/qibla/DynamicSky';
import { useQibla } from '@/hooks/qibla/useQibla';
import { useLocation } from '@/context/LocationContext';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function QiblaScreen() {
  const theme = useTheme<SalahMateTheme>();
  const { location } = useLocation();
  const { 
    heading, 
    qiblaBearing, 
    distanceKm, 
    accuracy, 
    error, 
    turnDirection, 
    turnDegrees, 
    isFacingQibla,
    isCalibrating,
    setIsCalibrating 
  } = useQibla();

  // Shared Values for Animations
  const animatedHeading = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  
  // Haptic Lock State
  const hasTriggeredLock = useRef(false);

  // Smooth rotation for the needle
  useEffect(() => {
    if (heading !== null) {
      let currentVal = animatedHeading.value % 360;
      if (currentVal < 0) currentVal += 360;
      
      let diff = heading - currentVal;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      animatedHeading.value = withSpring(animatedHeading.value + diff, { damping: 20, stiffness: 90 });
    }
  }, [heading, animatedHeading]);

  // Lock State Animations (Kaaba Pulse, Needle Highlight, Haptics)
  useEffect(() => {
    if (isFacingQibla) {
      if (!hasTriggeredLock.current) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        hasTriggeredLock.current = true;
      }
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      hasTriggeredLock.current = false;
      pulseScale.value = withTiming(1);
      pulseOpacity.value = withTiming(0);
    }
  }, [isFacingQibla, pulseScale, pulseOpacity]);

  // Animated Stage for Smart Ring Color: 0 (Green), 1 (Amber), 2 (Red)
  const alignmentStage = turnDegrees === null ? 2 : turnDegrees <= 5 ? 0 : turnDegrees <= 15 ? 1 : 2;
  const animatedStage = useSharedValue(alignmentStage);
  
  useEffect(() => {
    animatedStage.value = withTiming(alignmentStage, { duration: 300 });
  }, [alignmentStage, animatedStage]);

  // --- Animated Styles ---

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animatedHeading.value}deg` }]
  }));

  const needleNorthStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(isFacingQibla ? '#2ECC71' : '#E74C3C', { duration: 300 })
  }));

  const smartRingStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      animatedStage.value,
      [0, 1, 2],
      ['#2ECC71', '#F39C12', theme.colors.error]
    );
    return {
      borderColor: color,
      shadowColor: color,
    };
  });

  const centerHubGlowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFacingQibla ? 1 : 0, { duration: 400 }),
    transform: [{ scale: withTiming(isFacingQibla ? 1.5 : 0.8, { duration: 400 }) }]
  }));

  const kaabaGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // --- Render Helpers ---

  const accuracyText = accuracy >= 4 ? 'High' : accuracy === 3 ? 'Medium' : 'Low';
  const accuracyColor = accuracy >= 4 ? theme.colors.primary : accuracy === 3 ? '#F39C12' : theme.colors.error;
  const locationText = location ? `${location.city}, ${location.country}` : 'Detecting...';
  
  const renderGuidance = () => {
    if (isFacingQibla) {
      return (
        <View style={styles.guidanceBox}>
          <AppIcon name="check-circle" size="md" color="#2ECC71" style={{ marginRight: 6 }} />
          <Text variant="headlineSmall" style={{ color: '#2ECC71', fontWeight: '800' }}>
            Facing Qibla ✓
          </Text>
        </View>
      );
    }
    if (turnDegrees !== null) {
      return (
        <View style={styles.guidanceBox}>
          <AppIcon name={turnDirection === 'LEFT' ? 'arrow-left' : 'arrow-right'} size="sm" color={theme.colors.onSurfaceVariant} style={{ marginRight: 6 }} />
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            {turnDegrees}° to Qibla
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.guidanceBox}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>Aligning...</Text>
      </View>
    );
  };

  const renderTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i < 360; i += 10) {
      const isMajor = i % 30 === 0;
      ticks.push(
        <View key={i} style={[StyleSheet.absoluteFill, styles.tickWrapper, { transform: [{ rotate: `${i}deg` }] }]}>
          <View style={[
            styles.tick, 
            { 
              height: isMajor ? 12 : 6, 
              backgroundColor: isMajor ? (theme.dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)') : (theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
            }
          ]} />
        </View>
      );
    }
    return ticks;
  }, [theme.dark]);

  const isLoading = heading === null || qiblaBearing === null;

  return (
    <View style={{ flex: 1 }}>
      <DynamicSky />
      <ScreenContainer scrollable withPadding style={{ backgroundColor: 'transparent' }} withGlassGradient={false}>
        <GlassHeader title="Qibla Compass" subtitle="Kaaba Direction & Alignment" showBack />

      <View style={styles.content}>
        {error ? (
          <GlassCard borderRadius={16} contentStyle={{ padding: spacing.xl, alignItems: 'center' }}>
            <AppIcon name="alert-circle-outline" size="xl" variant="error" />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginTop: spacing.md, textAlign: 'center' }}>
              {error}
            </Text>
          </GlassCard>
        ) : (
          <>
            {/* Guidance Banner */}
            <View style={styles.guidanceContainer}>
              {renderGuidance()}
            </View>

            {/* Circular Qibla Compass */}
            <View style={styles.compassContainer}>
              {isLoading ? (
                <View style={[styles.compassOuter, { justifyContent: 'center', alignItems: 'center' }]}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={{ marginTop: spacing.md, color: theme.colors.onSurfaceVariant }}>Initializing Sensors...</Text>
                </View>
              ) : (
                <View style={styles.compassWrapper}>
                  {/* Smart Accuracy Ring */}
                  <Animated.View style={[StyleSheet.absoluteFill, styles.smartRing, smartRingStyle]} />
                  
                  <GlassCard borderRadius={180} contentStyle={styles.compassOuter}>
                    {/* Fixed Ticks */}
                    {renderTicks}

                    {/* Fixed Cardinal Markers */}
                    <Text variant="titleLarge" style={[styles.markerN, { color: theme.colors.error }]}>N</Text>
                    <Text variant="titleMedium" style={[styles.markerE, { color: theme.colors.onSurfaceVariant }]}>E</Text>
                    <Text variant="titleMedium" style={[styles.markerS, { color: theme.colors.onSurfaceVariant }]}>S</Text>
                    <Text variant="titleMedium" style={[styles.markerW, { color: theme.colors.onSurfaceVariant }]}>W</Text>
                    
                    {/* Fixed Kaaba Indicator */}
                    <View style={[StyleSheet.absoluteFill, styles.kaabaWrapper, { transform: [{ rotate: `${qiblaBearing}deg` }] }]}>
                      <Animated.View style={[styles.kaabaGlow, kaabaGlowStyle, { backgroundColor: '#FFD700' }]} />
                      <View style={styles.kaabaIconBox}>
                        <AppIcon name="mosque" size={24} color="#FFF" />
                      </View>
                    </View>

                    {/* Rotating Needle */}
                    <Animated.View style={[StyleSheet.absoluteFill, styles.needleWrapper, needleStyle]}>
                      <View style={styles.needleShadow}>
                        <Animated.View style={[styles.needleNorth, needleNorthStyle]} />
                        <View style={styles.needleSouth} />
                      </View>
                    </Animated.View>

                    {/* Glowing Center Hub */}
                    <Animated.View style={[styles.centerHubGlow, centerHubGlowStyle]} />
                    <View style={styles.centerHubOuter}>
                      <View style={styles.centerHubInner} />
                    </View>

                  </GlassCard>
                </View>
              )}
            </View>

            {/* Status Information Card */}
            <GlassCard borderRadius={20} contentStyle={styles.infoCard}>
              <View style={styles.infoRow}>
                <AppIcon name="map-marker" size={20} color={theme.colors.primary} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Current Location</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>{locationText}</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRowGrid}>
                <View style={styles.infoGridItem}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Qibla Bearing</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>{Math.round(qiblaBearing || 0)}°</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Current Heading</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>{Math.round(heading || 0)}°</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' }}>Remaining</Text>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>{turnDegrees !== null ? `${turnDegrees}°` : '--'}</Text>
                </View>
              </View>
              
              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <AppIcon name="crosshairs-gps" size={20} color={accuracyColor} style={styles.infoIcon} />
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>Compass Accuracy</Text>
                  <View style={[styles.accuracyBadge, { backgroundColor: accuracyColor + '20' }]}>
                    <Text variant="labelSmall" style={{ color: accuracyColor, fontWeight: '700' }}>{accuracyText}</Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          </>
        )}
      </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  guidanceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  guidanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  compassWrapper: {
    width: 322, // slightly larger than compass to fit ring
    height: 322,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smartRing: {
    borderRadius: 161,
    borderWidth: 2,
    borderStyle: 'solid',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  compassOuter: {
    width: 310,
    height: 310,
    borderRadius: 155,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  // Ticks
  tickWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tick: {
    width: 2,
    borderRadius: 1,
    marginTop: 6,
  },
  // Markers
  markerN: {
    position: 'absolute',
    top: 24,
    left: 155 - 10,
    width: 20,
    textAlign: 'center',
    fontWeight: '800',
  },
  markerE: {
    position: 'absolute',
    top: 155 - 12,
    right: 24,
    fontWeight: '700',
  },
  markerS: {
    position: 'absolute',
    bottom: 24,
    left: 155 - 10,
    width: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  markerW: {
    position: 'absolute',
    top: 155 - 12,
    left: 24,
    fontWeight: '700',
  },
  // Kaaba Indicator
  kaabaWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  kaabaIconBox: {
    marginTop: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D4AF37', // Gold
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  kaabaGlow: {
    position: 'absolute',
    top: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  // Needle
  needleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  needleShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  needleNorth: {
    width: 8,
    height: 120,
    backgroundColor: '#E74C3C',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  needleSouth: {
    width: 8,
    height: 120,
    backgroundColor: '#ECF0F1',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  // Hub
  centerHubGlow: {
    position: 'absolute',
    top: 155 - 20,
    left: 155 - 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(25, 105, 140, 0.4)',
    shadowColor: '#FFD700', // Gold highlight
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  centerHubOuter: {
    position: 'absolute',
    top: 155 - 12,
    left: 155 - 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#BDC3C7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  centerHubInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7F8C8D',
  },
  // Info Card
  infoCard: {
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: spacing.md,
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: spacing.md,
  },
  infoRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  infoGridItem: {
    alignItems: 'center',
  },
  accuracyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

