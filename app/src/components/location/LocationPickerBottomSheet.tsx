import { AppIcon } from '@/components/common/AppIcon';
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

import { useCitySearch } from '@/hooks/useCitySearch';

export const LocationPickerBottomSheet: React.FC<LocationPickerBottomSheetProps> = ({ visible, onDismiss }) => {
  const theme = useTheme<SalahMateTheme>();
  const { setManualLocation, setAutoLocation, isAuto } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { results: filteredCities, isLoading } = useCitySearch(searchQuery);

  const handleSelectCity = (loc: LocationData) => {
    setManualLocation(loc);
    onDismiss();
  };

  const handleSelectAuto = () => {
    setAutoLocation(true);
    onDismiss();
  };

  const handleSubmitEditing = () => {
    if (filteredCities.length === 1) {
      handleSelectCity(filteredCities[0]);
    }
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
          onSubmitEditing={handleSubmitEditing}
          returnKeyType="search"
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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Loading cities...</Text>
          </View>
        ) : (
          filteredCities.map((loc, index) => (
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
          ))
        )}
        {searchQuery.length > 1 && !isLoading && filteredCities.length === 0 && (
          <View style={styles.loadingContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>No cities found for "{searchQuery}"</Text>
          </View>
        )}
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
    flexShrink: 1,
    width: '100%',
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
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
