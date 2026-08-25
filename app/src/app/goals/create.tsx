import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenContainer, GlassButton, AppIcon } from '@/components';
import { BlurView } from 'expo-blur';
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
    prayerTarget: 'FAJR',
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

  const handleSave = async () => {
    if (!title || !totalUnits || !durationDays || !selectedTemplate) return;

    const startDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + parseInt(durationDays, 10));

    await addGoal({
      title,
      category: selectedTemplate.category,
      prayerTarget: selectedTemplate.prayerTarget || null,
      startDate: startDate.toISOString(),
      targetDate: targetDate.toISOString(),
      totalUnits: parseInt(totalUnits, 10),
      unitLabel,
      reminderConfig: { type: 'daily', time: '09:00' }, // Placeholder for now
    });

    router.back();
  };

  return (
    <ScreenContainer 
      backgroundImage={require('../../../assets/backgrounds/asma-mosque.png')} 
      withGlassGradient={false}
      style={{ backgroundColor: 'transparent' }}
    >
      <View style={styles.overlay} />
      
      <View style={styles.header}>
        <Pressable 
          onPress={() => {
            if (step === 2) setStep(1);
            else router.back();
          }} 
          style={styles.iconBtn}
        >
          <AppIcon name="chevron-left" size={28} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>{step === 1 ? "Choose a Template" : "Configure Goal"}</Text>
        </View>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <>
            <Text variant="bodyLarge" style={[styles.introText, { color: '#CBD5E1' }]}>
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
            <BlurView intensity={25} tint="light" style={styles.formCard}>
              <Text variant="labelLarge" style={[styles.inputLabel, { color: '#FFFFFF' }]}>Goal Title</Text>
              <TextInput
                style={[styles.input, { color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }]}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Complete Quran"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />

              <Text variant="labelLarge" style={[styles.inputLabel, { color: '#FFFFFF' }]}>Total Units Needed</Text>
              <TextInput
                style={[styles.input, { color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }]}
                value={totalUnits}
                onChangeText={setTotalUnits}
                keyboardType="numeric"
                placeholder="e.g. 604"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />

              <Text variant="labelLarge" style={[styles.inputLabel, { color: '#FFFFFF' }]}>Unit Label (e.g. pages, days)</Text>
              <TextInput
                style={[styles.input, { color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }]}
                value={unitLabel}
                onChangeText={setUnitLabel}
                placeholder="e.g. pages"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />

              <Text variant="labelLarge" style={[styles.inputLabel, { color: '#FFFFFF' }]}>Duration (Days)</Text>
              <TextInput
                style={[styles.input, { color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }]}
                value={durationDays}
                onChangeText={setDurationDays}
                keyboardType="numeric"
                placeholder="e.g. 30"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </BlurView>

            <BlurView intensity={25} tint="light" style={styles.formCard}>
              <View style={styles.reminderHeader}>
                <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#FFFFFF" />
                <Text variant="titleMedium" style={{ color: '#FFFFFF', marginLeft: spacing.sm, fontWeight: '700' }}>
                  Reminders
                </Text>
              </View>
              <Text variant="bodySmall" style={{ color: '#CBD5E1', marginTop: spacing.sm }}>
                Placeholder: AI-driven notifications and daily reminders will be integrated here in future phases. Currently defaults to 09:00 AM daily.
              </Text>
            </BlurView>

            <GlassButton 
              label="Start Journey" 
              variant="white"
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 20, 15, 0.40)', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitles: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 20,
  },
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
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
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
