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
import { useRouter, Stack } from 'expo-router';
import { AppIcon, ScreenContainer } from '@/components';
import { useQibla } from '@/hooks/qibla/useQibla';
import { useLocation } from '@/context/LocationContext';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';
import { BlurView } from 'expo-blur';

export default function QiblaScreen() {
  const router = useRouter();
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
  } = useQibla();

  // Shared Values for Animations
  const animatedHeading = useSharedValue(0);
  
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

  // Lock State Haptics
  useEffect(() => {
    if (isFacingQibla) {
      if (!hasTriggeredLock.current) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        hasTriggeredLock.current = true;
      }
    } else {
      hasTriggeredLock.current = false;
    }
  }, [isFacingQibla]);

  // --- Animated Styles ---
  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animatedHeading.value}deg` }]
  }));

  // --- Render Helpers ---
  const accuracyText = accuracy >= 4 ? 'High' : accuracy === 3 ? 'Medium' : 'Low';
  const accuracyColor = accuracy >= 4 ? '#2ECC71' : accuracy === 3 ? '#b08d4b' : theme.colors.error;
  const accuracyBg = accuracy >= 4 ? '#E8F5E9' : accuracy === 3 ? '#E6B967' : '#FFEBEE';
  
  const locationText = location?.city && location?.country 
    ? `${location.city}, ${location.country}` 
    : 'Detecting...';

  const renderTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i < 360; i += 30) {
      // Don't render dot if it overlaps with N,E,S,W
      if (i % 90 === 0) continue;
      
      ticks.push(
        <View key={i} style={[StyleSheet.absoluteFill, styles.tickWrapper, { transform: [{ rotate: `${i}deg` }] }]}>
          <View style={styles.tickDot} />
        </View>
      );
    }
    return ticks;
  }, []);

  const isLoading = heading === null || qiblaBearing === null;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenContainer 
        scrollable={true} 
        style={{ backgroundColor: 'transparent' }} 
        withGlassGradient={false}
        backgroundImage={require('../../assets/backgrounds/qibla-mosque.png')}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerBtn}>
            <AppIcon name="chevron-left" size={32} color="#1D5C6B" />
          </Pressable>
          <Text style={styles.headerTitle}>
            Qibla Compass
          </Text>
          <View style={styles.headerBtn} />
        </View>

        <View style={styles.content}>
          {error ? (
            <View style={styles.errorContainer}>
              <AppIcon name="alert-circle-outline" size={48} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              {/* Dynamic Qibla Degrees Text */}
              <View style={styles.guidanceContainer}>
                {turnDegrees !== null ? (
                  <Text style={styles.guidanceText}>{turnDegrees}° to Qibla</Text>
                ) : (
                  <Text style={styles.guidanceText}>Aligning...</Text>
                )}
              </View>

              {/* Circular Qibla Compass */}
              <View style={styles.compassContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#E6B967" />
                ) : (
                  <View style={styles.compassWrapper}>
                    {/* Outer frosted dial */}
                    <BlurView intensity={25} tint="light" style={styles.compassDialOuter}>
                      <View style={styles.compassDialInner}>
                        
                        {/* Dots */}
                        {renderTicks}

                        {/* Cardinal Markers */}
                        <Text style={[styles.marker, styles.markerN]}>N</Text>
                        <Text style={[styles.marker, styles.markerE]}>E</Text>
                        <Text style={[styles.marker, styles.markerS]}>S</Text>
                        <Text style={[styles.marker, styles.markerW]}>W</Text>
                        
                        {/* Qibla Indicator Pin */}
                        <View style={[StyleSheet.absoluteFill, styles.qiblaPinWrapper, { transform: [{ rotate: `${qiblaBearing}deg` }] }]}>
                          <View style={styles.qiblaPinBox}>
                            <AppIcon name="map-marker-outline" size={28} color="#E6B967" />
                          </View>
                        </View>

                        {/* Rotating Needle */}
                        <Animated.View style={[StyleSheet.absoluteFill, styles.needleWrapper, needleStyle]}>
                          <View style={styles.needleBody}>
                            {/* North half (Gold) */}
                            <View style={styles.needleNorth}>
                              <View style={styles.needleNorthLeft} />
                              <View style={styles.needleNorthRight} />
                            </View>
                            {/* South half (Teal) */}
                            <View style={styles.needleSouth}>
                              <View style={styles.needleSouthLeft} />
                              <View style={styles.needleSouthRight} />
                            </View>
                            
                            {/* Center Pin */}
                            <View style={styles.centerPinOuter}>
                              <View style={styles.centerPinInner} />
                            </View>
                          </View>
                        </Animated.View>
                      </View>
                    </BlurView>
                  </View>
                )}
              </View>

              {/* Status Information Card */}
              <View style={styles.bottomCardContainer}>
                <BlurView intensity={35} tint="light" style={styles.bottomCard}>
                  
                  {/* Current Location */}
                  <View style={[styles.infoBlock, { alignItems: 'center' }]}>
                    <Text style={[styles.infoLabel, { textAlign: 'center' }]}>CURRENT LOCATION</Text>
                    <Text style={[styles.infoValueLarge, { textAlign: 'center' }]}>{locationText}</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Qibla Bearing */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>QIBLA BEARING</Text>
                    <Text style={styles.infoValueSmall}>{Math.round(qiblaBearing || 0)}°</Text>
                  </View>

                  {/* Current Heading */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>CURRENT HEADING</Text>
                    <Text style={styles.infoValueSmall}>{Math.round(heading || 0)}°</Text>
                  </View>

                  {/* Compass Accuracy */}
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>COMPASS ACCURACY</Text>
                    <View style={[styles.accuracyPill, { backgroundColor: accuracyBg }]}>
                      <Text style={[styles.accuracyPillText, { color: accuracyColor }]}>{accuracyText}</Text>
                    </View>
                  </View>

                </BlurView>
              </View>
            </>
          )}
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48, // Accommodate safe area
    paddingBottom: 16,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D5C6B', // Deep teal
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  guidanceContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
    paddingVertical: 8,
  },
  guidanceText: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '600',
    color: '#E6B967', // Gold
  },
  
  // Compass
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  compassWrapper: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassDialOuter: {
    width: 320,
    height: 320,
    borderRadius: 160,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    padding: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  compassDialInner: {
    flex: 1,
    borderRadius: 160,
    borderWidth: 2,
    borderColor: 'rgba(29, 92, 107, 0.2)', // subtle teal inner ring
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Ticks
  tickWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tickDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E6B967',
    marginTop: 8,
    opacity: 0.8,
  },
  
  // Markers
  marker: {
    position: 'absolute',
    fontWeight: '700',
    fontSize: 22,
    color: '#1D5C6B', // Teal
  },
  markerN: { top: 12 },
  markerE: { right: 16 },
  markerS: { bottom: 12 },
  markerW: { left: 16 },
  
  // Qibla Pin
  qiblaPinWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 10, // above ticks, below needle
  },
  qiblaPinBox: {
    marginTop: -10, // pop out of the rim slightly
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E6B967',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },

  // Needle (3D effect)
  needleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  needleBody: {
    width: 60,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: -4, height: 4 },
    elevation: 10,
  },
  
  needleNorth: {
    width: 40,
    height: 110,
    flexDirection: 'row',
  },
  // North side is gold
  needleNorthLeft: {
    flex: 1,
    backgroundColor: '#C59A45', // darker gold
    borderTopLeftRadius: 100, // sharp point
  },
  needleNorthRight: {
    flex: 1,
    backgroundColor: '#E6B967', // bright gold
    borderTopRightRadius: 100,
  },
  
  needleSouth: {
    width: 40,
    height: 110,
    flexDirection: 'row',
  },
  // South side is teal
  needleSouthLeft: {
    flex: 1,
    backgroundColor: '#15414C', // darker teal
    borderBottomLeftRadius: 100,
  },
  needleSouthRight: {
    flex: 1,
    backgroundColor: '#1D5C6B', // bright teal
    borderBottomRightRadius: 100,
  },

  // Center Pin
  centerPinOuter: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E6B967',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  centerPinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C59A45',
  },

  // Bottom Info Card
  bottomCardContainer: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomCard: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  infoBlock: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#34495E', // greyish dark blue
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValueLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D5C6B', // teal
  },
  infoValueSmall: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(29, 92, 107, 0.15)', // subtle teal line
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  accuracyPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accuracyPillText: {
    fontWeight: '700',
    fontSize: 14,
  },
});
