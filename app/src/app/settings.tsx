import React, { useState } from 'react';
import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Text, useTheme } from 'react-native-paper';
import { AppIcon, ScreenContainer, LocationPickerBottomSheet, OptionsPickerBottomSheet, PickerOption } from '@/components';
import { useLocation, useSettings, useNotifications } from '@/context';
import { spacing } from '@/theme';
import { BlurView } from 'expo-blur';
import { Switch as RNSwitch } from 'react-native';
import { useAuth } from '@/hooks/auth/useAuth';
import { usersApi } from '@/api/users.api';

// Custom toggle matching the green apple-style design
const GlassToggle = ({ value, onValueChange, disabled = false }: any) => {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: 'rgba(255,255,255,0.2)', true: '#4ADE80' }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="rgba(255,255,255,0.2)"
    />
  );
};

// Reusable setting row component for uniform look
const GlassSettingRow = ({ 
  label, 
  description, 
  icon, 
  rightElement, 
  onPress,
  isLast = false,
  customLabelStyle,
  customDescStyle
}: any) => {
  const inner = (
    <>
      <View style={styles.rowLeft}>
        {icon && <AppIcon name={icon} size={24} color="#FFFFFF" style={styles.rowIcon} />}
        <View style={styles.rowTextContainer}>
          <Text style={[styles.rowLabel, customLabelStyle]}>{label}</Text>
          {description && (
            <Text style={[styles.rowDesc, customDescStyle]} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.rowRight}>
        {rightElement}
      </View>
    </>
  );

  return (
    <View style={styles.rowWrapper}>
      {onPress ? (
        <Pressable 
          style={({ pressed }) => [styles.rowContent, pressed && { opacity: 0.6 }]} 
          onPress={onPress}
        >
          {inner}
        </Pressable>
      ) : (
        <View style={styles.rowContent}>
          {inner}
        </View>
      )}
      {!isLast && <View style={styles.divider} />}
    </View>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { location, isAuto, isDetecting, setAutoLocation, refreshLocation } = useLocation();
  const { settings, updateSetting } = useSettings();
  const { notificationsEnabled, sendTestNotification } = useNotifications();
  const { user, refreshUser } = useAuth();
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
    { label: 'Standard', value: 0, description: "Shafi'i, Maliki, Hanbali" },
    { label: 'Hanafi', value: 1, description: 'Later Asr time' },
  ];

  const timeFormats: PickerOption<'12h' | '24h'>[] = [
    { label: '12-Hour', value: '12h' },
    { label: '24-Hour', value: '24h' },
  ];

  const hijriAdjustments: PickerOption<number>[] = [
    { label: '+2 Days', value: 2 },
    { label: '+1 Day', value: 1 },
    { label: '0 Days', value: 0 },
    { label: '-1 Day', value: -1 },
    { label: '-2 Days', value: -2 },
  ];

  // Interactive toggle states (preserving existing local states)
  const [notifications, setNotifications] = useState(true);
  const [adhanSound, setAdhanSound] = useState(true);
  const [haptics, setHaptics] = useState(true);
  
  // Theme state
  const [themeValue, setThemeValue] = useState(user?.theme || 'light');
  const handleThemeChange = async (val: string) => {
    setThemeValue(val);
    try {
      if (user) {
        await usersApi.updateProfile({ theme: val } as any);
        await refreshUser();
      }
    } catch (e) {
      console.warn("Theme update failed", e);
    }
  };

  const activeLocationStr = location?.city && location?.country 
    ? `${location.city}, ${location.country}` 
    : 'Unknown';

  const themeOptions = ['Light', 'Dark', 'Auto'];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenContainer 
        scrollable={false} 
        backgroundImage={require('../../assets/backgrounds/settings-mosque.png')}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppIcon name="arrow-left" size={24} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* PRAYER LOCATION SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PRAYER LOCATION</Text>
            <View style={styles.glassCardWrapper}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.glassCardInner}>
                <GlassSettingRow
                  icon="crosshairs-gps"
                  label="Use Current Location"
                  description={isAuto ? 'Automatically update via GPS' : 'GPS disabled'}
                  rightElement={<GlassToggle value={isAuto} onValueChange={setAutoLocation} />}
                />
                <GlassSettingRow
                  icon="map-marker"
                  label="Active Location"
                  description={activeLocationStr}
                />
                {isAuto ? (
                  <Pressable 
                    style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
                    onPress={refreshLocation}
                    disabled={isDetecting}
                  >
                    <AppIcon name={isDetecting ? "sync" : "refresh"} size={20} color="#FFFFFF" />
                    <Text style={styles.actionRowText}>{isDetecting ? 'Detecting...' : 'Refresh Current Location'}</Text>
                  </Pressable>
                ) : (
                  <Pressable 
                    style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
                    onPress={() => setIsPickerVisible(true)}
                  >
                    <AppIcon name="magnify" size={20} color="#FFFFFF" />
                    <Text style={styles.actionRowText}>Search City</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          {/* APPEARANCE SECTION REMOVED */}

          {/* NOTIFICATIONS & ALERTS SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>NOTIFICATIONS & ALERTS</Text>
            <View style={styles.glassCardWrapper}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.glassCardInner}>
                <GlassSettingRow
                  label="Prayer Notifications"
                  rightElement={
                    <View style={styles.toggleWithIcon}>
                      <GlassToggle value={notifications} onValueChange={setNotifications} />
                      <AppIcon name="bell-outline" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </View>
                  }
                />
                <GlassSettingRow
                  label="Full Adhan Audio"
                  isLast
                  rightElement={
                    <View style={styles.toggleWithIcon}>
                      <GlassToggle value={adhanSound} onValueChange={setAdhanSound} disabled={!notifications} />
                      <AppIcon name="volume-high" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </View>
                  }
                />
              </View>
            </View>
          </View>

          {/* CALCULATION METHODS SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>CALCULATION METHODS</Text>
            <View style={styles.glassCardWrapper}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.glassCardInner}>
                <GlassSettingRow
                  icon="compass-outline"
                  label="Convention"
                  description={calcMethods.find(m => m.value === settings.prayerMethod)?.label || 'Muslim World League'}
                  onPress={() => setActivePicker('calc')}
                  rightElement={
                    <View style={styles.rowRightClickable}>
                      <AppIcon name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
                    </View>
                  }
                />
                <GlassSettingRow
                  icon="human-handsdown"
                  label="Asr Juristic Method"
                  description={juristicMethods.find(m => m.value === settings.juristicMethod)?.label || 'Standard'}
                  onPress={() => setActivePicker('juristic')}
                  rightElement={
                    <View style={styles.rowRightClickable}>
                      <AppIcon name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
                    </View>
                  }
                />
                <GlassSettingRow
                  icon="clock-outline"
                  label="Time Format"
                  description={settings.timeFormat === '12h' ? '12-Hour' : '24-Hour'}
                  onPress={() => setActivePicker('time')}
                  rightElement={
                    <View style={styles.rowRightClickable}>
                      <AppIcon name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
                    </View>
                  }
                />
                <GlassSettingRow
                  icon="calendar-text-outline"
                  label="Hijri Adjustment"
                  description={`${settings.hijriAdjustment > 0 ? '+' : ''}${settings.hijriAdjustment} Days`}
                  isLast
                  onPress={() => setActivePicker('hijri')}
                  rightElement={
                    <View style={styles.rowRightClickable}>
                      <AppIcon name="chevron-right" size={24} color="rgba(255,255,255,0.5)" />
                    </View>
                  }
                />
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              SalahMate v1.0.0 (Build 2026.07) · Crafted with Barakah
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>

      {/* Pickers (kept identical) */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    paddingVertical: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  glassCardWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)', // Emerald green border
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.35)', // Dark frosted background
  },
  glassCardInner: {
    // padding applied in row or specific sections
  },
  
  // Row Styles
  rowWrapper: {
    width: '100%',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 60,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  rowDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  rowRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rowRightClickable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightValueText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 52,
  },
  
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  actionRowText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  // Custom specific elements
  toggleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshBtn: {
    alignItems: 'center',
  },
  refreshBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
  },

  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  segmentBtnBorder: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.15)',
  },
  segmentText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    fontSize: 15,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  themeHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },

  footer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
});
