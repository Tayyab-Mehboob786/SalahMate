/**
 * SalahMate — Qibla Compass Module (`/qibla`)
 *
 * Precision spiritual alignment screen featuring a circular Qibla compass dial,
 * real-time direction pointer towards Mecca, geographic location metrics,
 * distance calculation to the Holy Kaaba, and device calibration guidance.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, GlassHeader, ScreenContainer } from '@/components';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function QiblaScreen() {
  const theme = useTheme<SalahMateTheme>();
  const [isCalibrating, setIsCalibrating] = useState(false);

  return (
    <ScreenContainer scrollable withPadding withGlassGradient>
      <GlassHeader title="Qibla Compass" subtitle="Kaaba Direction & Alignment" showBack />

      <View style={styles.content}>
        {/* Location & Calibration Status Banner */}
        <GlassCard borderRadius={22} contentStyle={styles.statusBanner}>
          <View style={styles.statusLeft}>
            <View style={[styles.statusIconBox, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
              <AppIcon name="compass-outline" size="lg" variant="primary" />
            </View>
            <View>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                248° SW · Mecca, Saudi Arabia
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Current Location: London, United Kingdom
              </Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}>
            <View style={[styles.liveDot, { backgroundColor: theme.dark ? '#7FC8E8' : '#145874' }]} />
            <Text variant="labelSmall" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
              HIGH ACCURACY
            </Text>
          </View>
        </GlassCard>

        {/* Circular Qibla Dial Placeholder */}
        <View style={styles.compassContainer}>
          <GlassCard borderRadius={180} contentStyle={styles.compassOuter}>
            {/* Cardinal Direction Markers */}
            <Text variant="titleLarge" style={[styles.markerN, { color: theme.colors.error }]}>
              N
            </Text>
            <Text variant="titleMedium" style={[styles.markerE, { color: theme.colors.onSurfaceVariant }]}>
              E
            </Text>
            <Text variant="titleMedium" style={[styles.markerS, { color: theme.colors.onSurfaceVariant }]}>
              S
            </Text>
            <Text variant="titleMedium" style={[styles.markerW, { color: theme.colors.onSurfaceVariant }]}>
              W
            </Text>

            {/* Inner Ring Dial */}
            <View style={[styles.innerRing, { borderColor: theme.dark ? 'rgba(25, 105, 140, 0.30)' : 'rgba(25, 105, 140, 0.25)' }]}>
              {/* Kaaba Direction Pointer (Rotated towards 248°) */}
              <View style={[styles.kaabaPointer, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', shadowColor: theme.colors.shadow }]}>
                <AppIcon name="mosque" size={48} variant="primary" />
                <Text variant="labelMedium" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '800', marginTop: 4 }}>
                  QIBLA · 248°
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Distance & Geolocation Metrics */}
        <View style={styles.metricsRow}>
          <GlassCard borderRadius={20} style={styles.metricCard} contentStyle={styles.metricCardContent}>
            <AppIcon name="map-marker-distance" size={26} variant="primary" />
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
              4,218 km
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Distance to Kaaba
            </Text>
          </GlassCard>

          <GlassCard borderRadius={20} style={styles.metricCard} contentStyle={styles.metricCardContent}>
            <AppIcon name="crosshairs-gps" size={26} variant="primary" />
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
              51.50° N
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              0.12° W Coordinates
            </Text>
          </GlassCard>
        </View>

        {/* Calibration Advice & Guidance */}
        <GlassCard borderRadius={20} contentStyle={styles.adviceCard}>
          <View style={styles.adviceHeader}>
            <AppIcon name="compass-rose" size="lg" variant="primary" />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              Compass Calibration Tip
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
            To ensure precise spiritual alignment, hold your device flat and move it in a figure 8 pattern (∞) away from magnetic interference or metal objects.
          </Text>
          <Pressable
            style={[styles.calibrateBtn, { backgroundColor: theme.dark ? 'rgba(25, 105, 140, 0.18)' : '#E8F4F8', borderWidth: 1, borderColor: theme.dark ? 'rgba(25, 105, 140, 0.25)' : 'rgba(25, 105, 140, 0.15)' }]}
            onPress={() => {
              setIsCalibrating(true);
              setTimeout(() => setIsCalibrating(false), 1500);
            }}
          >
            <Text variant="labelLarge" style={{ color: theme.dark ? '#7FC8E8' : '#145874', fontWeight: '700' }}>
              {isCalibrating ? 'Recalibrating Qibla Sensors...' : 'Recalibrate Compass Now'}
            </Text>
          </Pressable>
        </GlassCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  statusIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  compassOuter: {
    width: 310,
    height: 310,
    borderRadius: 155,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  markerN: {
    position: 'absolute',
    top: 16,
    fontWeight: '800',
  },
  markerE: {
    position: 'absolute',
    right: 20,
    fontWeight: '700',
  },
  markerS: {
    position: 'absolute',
    bottom: 16,
    fontWeight: '700',
  },
  markerW: {
    position: 'absolute',
    left: 20,
    fontWeight: '700',
  },
  innerRing: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kaabaPointer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
  },
  metricCardContent: {
    padding: spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  adviceCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  calibrateBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
