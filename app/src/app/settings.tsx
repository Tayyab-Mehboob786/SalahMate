/**
 * SalahMate Global Settings Screen (`/settings`)
 *
 * Apple Health inspired settings modal for customizing calculation methods,
 * prayer notification alerts, Asr juristic preferences, and theme appearance.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, GlassCard, ScreenContainer, Switch, LocationPickerBottomSheet, OptionsPickerBottomSheet, PickerOption } from '@/components';
import { useAppTheme, useLocation, useSettings, useNotifications } from '@/context';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { themeMode, setThemeMode } = useAppTheme();
  const { location, isAuto, isDetecting, setAutoLocation, refreshLocation } = useLocation();
  const { settings, updateSetting } = useSettings();
  const { notificationsEnabled, sendTestNotification } = useNotifications();
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const [activePicker, setActivePicker] = useState<'calc' | 'juristic' | 'time' | 'hijri' | null>(null);

  // Settings Definitions
  const calcMethods: PickerOption<number>[] = [
    { label: 'Muslim World League', value: 1, description: 'Standard method' },
    { label: 'ISNA', value: 2, description: 'Islamic Society of North America' },
    { label: 'Egyptian', value: 5, description: 'Egyptian General Authority of Survey' },
    { label: 'Umm Al-Qura', value: 4, description: 'Mecca, Saudi Arabia' },
    { label: 'Karachi', value: 0, description: 'University of Islamic Sciences' },
    { label: 'Tehran', value: 7, description: 'Institute of Geophysics' },
    { label: 'Dubai', value: 16 },
    { label: 'Qatar', value: 11 },
  ];

  const juristicMethods: PickerOption<number>[] = [
    { label: 'Standard', value: 0, description: "Shafi'i, Maliki, Hanbali (Shadow 1x)" },
    { label: 'Hanafi', value: 1, description: 'Later Asr time (Shadow 2x)' },
  ];

  const timeFormats: PickerOption<'12h' | '24h'>[] = [
    { label: '12-Hour (AM/PM)', value: '12h' },
    { label: '24-Hour', value: '24h' },
  ];

  const hijriAdjustments: PickerOption<number>[] = [
    { label: '+2 Days', value: 2 },
    { label: '+1 Day', value: 1 },
    { label: '0 Days (Default)', value: 0 },
    { label: '-1 Day', value: -1 },
    { label: '-2 Days', value: -2 },
  ];

  // Interactive toggle states
  const [notifications, setNotifications] = useState(true);
  const [adhanSound, setAdhanSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [highLatitude, setHighLatitude] = useState(true);

  return (
    <>
      <ScreenContainer scrollable withPadding withGlassGradient>
      <View style={styles.content}>
        {/* Location Card */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          PRAYER LOCATION
        </Text>
        <GlassCard borderRadius={20} style={{ marginBottom: spacing.xl }}>
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.labelBox}>
              <AppIcon name="crosshairs-gps" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Use Current Location
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  {isAuto ? 'Automatically update via GPS' : 'GPS disabled'}
                </Text>
              </View>
            </View>
            <Switch value={isAuto} onValueChange={setAutoLocation} />
          </View>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.labelBox}>
              <AppIcon name="map-marker" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Active Location
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  {location?.city || 'Unknown'}, {location?.country || ''}
                </Text>
              </View>
            </View>
          </View>

          {isAuto ? (
            <Pressable 
              style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
              onPress={refreshLocation}
              disabled={isDetecting}
            >
              <AppIcon name={isDetecting ? "sync" : "refresh"} size={20} variant="primary" />
              <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '600', marginLeft: spacing.sm }}>
                {isDetecting ? 'Detecting Location...' : 'Refresh Current Location'}
              </Text>
            </Pressable>
          ) : (
            <Pressable 
              style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
              onPress={() => setIsPickerVisible(true)}
            >
              <AppIcon name="magnify" size={20} variant="primary" />
              <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '600', marginLeft: spacing.sm }}>
                Search City
              </Text>
            </Pressable>
          )}
        </GlassCard>

        {/* Appearance Mode Selector */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          APPEARANCE
        </Text>
        <GlassCard borderRadius={20} style={styles.appearanceCard}>
          <View style={styles.themeOptionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.themeOptionChip,
                {
                  backgroundColor:
                    themeMode === 'light'
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                  borderColor:
                    themeMode === 'light'
                      ? theme.colors.primary
                      : theme.colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setThemeMode('light')}
              accessibilityRole="radio"
              accessibilityState={{ checked: themeMode === 'light' }}
              accessibilityLabel="Light Theme Mode"
            >
              <AppIcon
                name="weather-sunny"
                size={22}
                color={themeMode === 'light' ? theme.colors.textOnPrimary : theme.colors.onSurface}
              />
              <Text
                variant="labelLarge"
                style={[
                  styles.themeOptionText,
                  { color: themeMode === 'light' ? theme.colors.textOnPrimary : theme.colors.onSurface },
                ]}
              >
                Light
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.themeOptionChip,
                {
                  backgroundColor:
                    themeMode === 'dark'
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                  borderColor:
                    themeMode === 'dark'
                      ? theme.colors.primary
                      : theme.colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setThemeMode('dark')}
              accessibilityRole="radio"
              accessibilityState={{ checked: themeMode === 'dark' }}
              accessibilityLabel="Dark Theme Mode"
            >
              <AppIcon
                name="weather-night"
                size={22}
                color={themeMode === 'dark' ? theme.colors.textOnPrimary : theme.colors.onSurface}
              />
              <Text
                variant="labelLarge"
                style={[
                  styles.themeOptionText,
                  { color: themeMode === 'dark' ? theme.colors.textOnPrimary : theme.colors.onSurface },
                ]}
              >
                Dark
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.themeOptionChip,
                {
                  backgroundColor:
                    themeMode === 'auto'
                      ? theme.colors.primary
                      : theme.colors.surfaceVariant,
                  borderColor:
                    themeMode === 'auto'
                      ? theme.colors.primary
                      : theme.colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setThemeMode('auto')}
              accessibilityRole="radio"
              accessibilityState={{ checked: themeMode === 'auto' }}
              accessibilityLabel="Auto System Theme Mode"
            >
              <AppIcon
                name="theme-light-dark"
                size="md"
                color={themeMode === 'auto' ? theme.colors.textOnPrimary : theme.colors.onSurface}
              />
              <Text
                variant="labelLarge"
                style={[
                  styles.themeOptionText,
                  { color: themeMode === 'auto' ? theme.colors.textOnPrimary : theme.colors.onSurface },
                ]}
              >
                Auto
              </Text>
            </Pressable>
          </View>
          <View style={styles.themeDescContainer}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              {themeMode === 'light'
                ? 'Soft white & emerald light theme always active.'
                : themeMode === 'dark'
                ? 'Charcoal & emerald dark theme always active.'
                : 'Automatically follows your operating system theme preference.'}
            </Text>
          </View>
        </GlassCard>


        {/* Notifications Card */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          NOTIFICATIONS & ALERTS
        </Text>
        <GlassCard borderRadius={20}>
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.labelBox}>
              <AppIcon name="bell-ring-outline" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Prayer Notifications
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  Receive reminders when Adhan begins
                </Text>
              </View>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.labelBox}>
              <AppIcon name="volume-high" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Full Adhan Audio
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  Play soothing Adhan instead of standard chime
                </Text>
              </View>
            </View>
            <Switch value={adhanSound} onValueChange={setAdhanSound} disabled={!notifications} />
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.labelBox}>
              <AppIcon name="vibrate" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Tactile Haptics
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  Vibrate gently upon logging prayers
                </Text>
              </View>
            </View>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>

          <Pressable 
            style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
            onPress={() => sendTestNotification(2)}
            disabled={!notificationsEnabled}
          >
            <AppIcon name="bell-plus" size={20} color={notificationsEnabled ? theme.colors.primary : theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={{ color: notificationsEnabled ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: '600', marginLeft: spacing.sm }}>
              {notificationsEnabled ? 'Send Test Notification (2s)' : 'Permissions Denied/Disabled'}
            </Text>
          </Pressable>
        </GlassCard>

        {/* Calculation Methods Card */}
        <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          CALCULATION METHODS
        </Text>
        <GlassCard borderRadius={20}>
          <Pressable 
            style={({ pressed }) => [styles.settingRow, { borderBottomColor: theme.colors.border }, pressed && { opacity: 0.7 }]}
            onPress={() => setActivePicker('calc')}
          >
            <View style={styles.labelBox}>
              <AppIcon name="compass-outline" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Convention
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  {calcMethods.find(m => m.value === settings.prayerMethod)?.label || 'Muslim World League'}
                </Text>
              </View>
            </View>
            <AppIcon name="chevron-right" size="lg" variant="secondary" />
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.settingRow, { borderBottomColor: theme.colors.border }, pressed && { opacity: 0.7 }]}
            onPress={() => setActivePicker('juristic')}
          >
            <View style={styles.labelBox}>
              <AppIcon name="weather-partly-cloudy" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Asr Juristic Method
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  {juristicMethods.find(m => m.value === settings.juristicMethod)?.label || 'Standard'}
                </Text>
              </View>
            </View>
            <AppIcon name="chevron-right" size="lg" variant="secondary" />
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.settingRow, { borderBottomColor: theme.colors.border }, pressed && { opacity: 0.7 }]}
            onPress={() => setActivePicker('time')}
          >
            <View style={styles.labelBox}>
              <AppIcon name="clock-outline" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Time Format
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  {settings.timeFormat === '12h' ? '12-Hour (AM/PM)' : '24-Hour'}
                </Text>
              </View>
            </View>
            <AppIcon name="chevron-right" size="lg" variant="secondary" />
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.settingRowLast, pressed && { opacity: 0.7 }]}
            onPress={() => setActivePicker('hijri')}
          >
            <View style={styles.labelBox}>
              <AppIcon name="calendar-sync" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  Hijri Adjustment
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  {settings.hijriAdjustment > 0 ? `+${settings.hijriAdjustment}` : settings.hijriAdjustment} Days
                </Text>
              </View>
            </View>
            <AppIcon name="chevron-right" size="lg" variant="secondary" />
          </Pressable>

          <View style={styles.settingRowLast}>
            <View style={styles.labelBox}>
              <AppIcon name="earth" size={22} variant="primary" />
              <View style={styles.textContainer}>
                <Text variant="bodyLarge" style={[styles.labelText, { color: theme.colors.onSurface }]}>
                  High Latitude Adjustment
                </Text>
                <Text variant="bodySmall" style={[styles.textDesc, { color: theme.colors.onSurfaceVariant }]}>
                  Middle of the Night rule for extreme regions
                </Text>
              </View>
            </View>
            <Switch value={highLatitude} onValueChange={setHighLatitude} />
          </View>
        </GlassCard>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
            SalahMate v2.4.0 (Build 2026.07) · Crafted with Barakah
          </Text>
        </View>
      </View>
    </ScreenContainer>
    <LocationPickerBottomSheet visible={isPickerVisible} onDismiss={() => setIsPickerVisible(false)} />
    
    <OptionsPickerBottomSheet
      visible={activePicker === 'calc'}
      onDismiss={() => setActivePicker(null)}
      title="Calculation Method"
      options={calcMethods}
      selectedValue={settings.prayerMethod}
      onSelect={(val) => updateSetting('prayerMethod', val)}
    />
    
    <OptionsPickerBottomSheet
      visible={activePicker === 'juristic'}
      onDismiss={() => setActivePicker(null)}
      title="Asr Juristic Method"
      options={juristicMethods}
      selectedValue={settings.juristicMethod}
      onSelect={(val) => updateSetting('juristicMethod', val)}
    />
    
    <OptionsPickerBottomSheet
      visible={activePicker === 'time'}
      onDismiss={() => setActivePicker(null)}
      title="Time Format"
      options={timeFormats}
      selectedValue={settings.timeFormat}
      onSelect={(val) => updateSetting('timeFormat', val)}
    />
    
    <OptionsPickerBottomSheet
      visible={activePicker === 'hijri'}
      onDismiss={() => setActivePicker(null)}
      title="Hijri Adjustment"
      options={hijriAdjustments}
      selectedValue={settings.hijriAdjustment}
      onSelect={(val) => updateSetting('hijriAdjustment', val)}
    />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    flexShrink: 1,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  labelText: {
    fontWeight: '600',
    marginBottom: 2,
  },
  textDesc: {
    color: '#636e72',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  appearanceCard: {
    marginBottom: spacing.md,
  },
  themeOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  themeOptionChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.xs,
  },
  themeOptionText: {
    fontWeight: '700',
  },
  themeDescContainer: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  footer: {
    marginTop: spacing.md,
    marginBottom: spacing['2xl'],
  },
});
