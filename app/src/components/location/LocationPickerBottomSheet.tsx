import { AppIcon } from '@/components';
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GlassBottomSheet } from '@/components/glass';
import { useLocation, LocationData } from '@/context/LocationContext';
import { spacing, shadows } from '@/theme';
import type { SalahMateTheme } from '@/theme';

interface LocationPickerBottomSheetProps {
  visible: boolean;
  onDismiss: () => void;
}

// Placeholder data until an API is integrated
const PREDEFINED_CITIES: LocationData[] = [
  { city: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262 },
  { city: 'Madinah', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6112 },
  { city: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
  { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { city: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
  { city: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784 },
  { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869 },
  { city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
];

export const LocationPickerBottomSheet: React.FC<LocationPickerBottomSheetProps> = ({ visible, onDismiss }) => {
  const theme = useTheme<SalahMateTheme>();
  const { setManualLocation, setAutoLocation, isAuto } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = PREDEFINED_CITIES.filter((loc) => 
    loc.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loc.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (loc: LocationData) => {
    setManualLocation(loc);
    onDismiss();
  };

  const handleSelectAuto = () => {
    setAutoLocation(true);
    onDismiss();
  };

  return (
    <GlassBottomSheet
      visible={visible}
      onDismiss={onDismiss}
      title="Search City"
      style={styles.bottomSheet}
    >
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <AppIcon name="magnify" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.onSurface }]}
          placeholder="Search by city or country..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <Pressable 
          style={[styles.listItem, { borderBottomColor: theme.colors.border }]} 
          onPress={handleSelectAuto}
        >
          <View style={[styles.iconContainer, { backgroundColor: isAuto ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}>
            <AppIcon 
              name="crosshairs-gps" 
              size={20} 
              color={isAuto ? theme.colors.primary : theme.colors.onSurfaceVariant} 
            />
          </View>
          <View style={styles.listItemText}>
            <Text variant="titleMedium" style={{ color: isAuto ? theme.colors.primary : theme.colors.onSurface, fontWeight: '600' }}>
              Current Location (GPS)
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Automatically detect using device GPS
            </Text>
          </View>
          {isAuto && (
            <AppIcon name="check" size={20} color={theme.colors.primary} />
          )}
        </Pressable>

        {filteredCities.map((loc, index) => (
          <Pressable 
            key={`${loc.city}-${index}`}
            style={[styles.listItem, { borderBottomColor: theme.colors.border }]} 
            onPress={() => handleSelectCity(loc)}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
              <AppIcon name="map-marker" size={20} color={theme.colors.onSurfaceVariant} />
            </View>
            <View style={styles.listItemText}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                {loc.city}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {loc.country}
              </Text>
            </View>
          </Pressable>
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </GlassBottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    maxHeight: '85%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  listItemText: {
    flex: 1,
  },
});
