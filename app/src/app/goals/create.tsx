import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenContainer, GlassHeader, GlassButton, GlassCard } from '@/components';
import { GoalTemplateCard, GoalTemplate } from '@/components/goals/GoalTemplateCard';
import { useGoals } from '@/context/GoalsContext';
import { spacing } from '@/theme';
import type { SalahMateTheme } from '@/theme';

const TEMPLATES: GoalTemplate[] = [
  {
    id: 'quran_30',
    title: 'Complete Quran',
    description: 'Read the entire Quran in 30 days',
    category: 'Quran',
    icon: 'book-open-page-variant',
    defaultTotalUnits: 604,
    defaultUnitLabel: 'pages',
    defaultDurationDays: 30,
  },
  {
    id: 'fajr_40',
    title: 'Never Miss Fajr',
    description: 'Pray Fajr on time for 40 days',
    category: 'Prayer',
    icon: 'weather-sunset-up',
    defaultTotalUnits: 40,
    defaultUnitLabel: 'days',
    defaultDurationDays: 40,
  },
  {
    id: 'asma_ul_husna',
    title: 'Learn Asma-ul-Husna',
    description: 'Memorize all 99 names of Allah',
    category: 'Learning',
    icon: 'brain',
    defaultTotalUnits: 99,
    defaultUnitLabel: 'names',
    defaultDurationDays: 33,
  },
  {
    id: 'custom',
    title: 'Custom Goal',
    description: 'Create your own personalized Islamic goal',
    category: 'Custom',
    icon: 'pencil-outline',
  }
];

export default function CreateGoalScreen() {
  const router = useRouter();
  const theme = useTheme<SalahMateTheme>();
  const { addGoal } = useGoals();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [unitLabel, setUnitLabel] = useState('units');
  const [durationDays, setDurationDays] = useState('');

  const handleSelectTemplate = (template: GoalTemplate) => {
    setSelectedTemplate(template);
    if (template.id !== 'custom') {
      setTitle(template.title);
      setTotalUnits(template.defaultTotalUnits?.toString() || '');
      setUnitLabel(template.defaultUnitLabel || 'units');
      setDurationDays(template.defaultDurationDays?.toString() || '');
    } else {
      setTitle('');
      setTotalUnits('');
      setUnitLabel('units');
      setDurationDays('');
    }
    setStep(2);
  };

  const handleSave = () => {
    if (!title || !totalUnits || !durationDays || !selectedTemplate) return;

    const startDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(durationDays, 10));

    addGoal({
      title,
      category: selectedTemplate.category,
      startDate: startDate.toISOString(),
      targetDate: targetDate.toISOString(),
      totalUnits: parseInt(totalUnits, 10),
      unitLabel,
      reminderConfig: { type: 'daily', time: '09:00' }, // Placeholder for now
    });

    router.back();
  };

  return (
    <ScreenContainer withGlassGradient>
      <GlassHeader 
        title={step === 1 ? "Choose a Template" : "Configure Goal"} 
        showBack
        onBackPress={() => {
          if (step === 2) setStep(1);
          else router.back();
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <>
            <Text variant="bodyLarge" style={[styles.introText, { color: theme.colors.onSurfaceVariant }]}>
              Select a predefined template or create a custom goal to start your spiritual journey.
            </Text>
            {TEMPLATES.map(template => (
              <GoalTemplateCard 
                key={template.id} 
                template={template} 
                onPress={handleSelectTemplate} 
              />
            ))}
          </>
        ) : (
          <View style={styles.formContainer}>
            <GlassCard borderRadius={16} style={styles.formCard}>
              <Text variant="labelLarge" style={[styles.inputLabel, { color: theme.colors.onSurface }]}>Goal Title</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.border }]}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Complete Quran"
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />

              <Text variant="labelLarge" style={[styles.inputLabel, { color: theme.colors.onSurface }]}>Total Units Needed</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.border }]}
                value={totalUnits}
                onChangeText={setTotalUnits}
                keyboardType="numeric"
                placeholder="e.g. 604"
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />

              <Text variant="labelLarge" style={[styles.inputLabel, { color: theme.colors.onSurface }]}>Unit Label (e.g. pages, days)</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.border }]}
                value={unitLabel}
                onChangeText={setUnitLabel}
                placeholder="e.g. pages"
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />

              <Text variant="labelLarge" style={[styles.inputLabel, { color: theme.colors.onSurface }]}>Duration (Days)</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.border }]}
                value={durationDays}
                onChangeText={setDurationDays}
                keyboardType="numeric"
                placeholder="e.g. 30"
                placeholderTextColor={theme.colors.onSurfaceVariant}
              />
            </GlassCard>

            <GlassCard borderRadius={16} style={styles.formCard}>
              <View style={styles.reminderHeader}>
                <MaterialCommunityIcons name="bell-ring-outline" size={24} color={theme.colors.primary} />
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: spacing.sm, fontWeight: '700' }}>
                  Reminders
                </Text>
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.sm }}>
                Placeholder: AI-driven notifications and daily reminders will be integrated here in future phases. Currently defaults to 09:00 AM daily.
              </Text>
            </GlassCard>

            <GlassButton 
              label="Start Journey" 
              onPress={handleSave} 
              disabled={!title || !totalUnits || !durationDays}
              style={{ marginTop: spacing.xl }}
            />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  introText: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  formContainer: {
    paddingTop: spacing.sm,
  },
  formCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
