import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMealPlan } from '@/context/MealPlanContext';
import { IconCircleButton, MealCard, mealImages } from '@/components/MealPlanUi';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { days, weekLabel, checkedCount, totalCount, hydrated, generateFreshPlan } = useMealPlan();
  const firstMeal = days[0]?.meals[1];
  const mealCount = days.reduce((sum, day) => sum + day.meals.length, 0);

  const handleGenerate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    generateFreshPlan();
  };

  if (!hydrated) {
    return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 96 : 112) }]}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.kicker, { color: colors.primary }]}>CAMPUS MEAL PLANNER</Text>
            <Text style={[styles.greeting, { color: colors.foreground }]}>Good morning</Text>
          </View>
          <IconCircleButton icon="bell" accessibilityLabel="Notifications" />
        </View>

        <LinearGradient colors={[colors.primary, colors.primaryAlt]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroCopy}>
            <View style={[styles.heroBadge, { backgroundColor: colors.accent }]}><Ionicons name="sparkles-outline" size={13} color={colors.accentForeground} /><Text style={[styles.heroBadgeText, { color: colors.accentForeground }]}>THIS WEEK</Text></View>
            <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>Eat well.{'\n'}Spend less time planning.</Text>
            <Text style={[styles.heroSub, { color: colors.primaryForegroundMuted }]}>A fresh menu built around your schedule, budget, and campus life.</Text>
            <Pressable onPress={handleGenerate} testID="generate-plan" style={({ pressed }) => [styles.heroButton, { backgroundColor: colors.accent }, pressed && styles.pressed]}>
              <Text style={[styles.heroButtonText, { color: colors.accentForeground }]}>Generate new week</Text>
              <Feather name="arrow-up-right" size={16} color={colors.accentForeground} />
            </Pressable>
          </View>
          <Image source={mealImages.chicken} style={styles.heroImage} />
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionEyebrow, { color: colors.mutedForeground }]}>YOUR WEEK</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{weekLabel}</Text>
          </View>
          <Pressable onPress={() => router.push('/plan')} testID="see-plan" style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
            <Text style={[styles.linkText, { color: colors.primary }]}>See plan</Text>
            <Feather name="arrow-right" size={15} color={colors.primary} />
          </Pressable>
        </View>

        {firstMeal ? <MealCard meal={firstMeal} compact onSwap={() => router.push('/plan')} /> : null}

        <View style={styles.statGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{mealCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>meals planned</Text>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary }]}><Feather name="calendar" size={16} color={colors.primary} /></View>
          </View>
          <Pressable onPress={() => router.push('/grocery')} testID="grocery-summary" style={({ pressed }) => [styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{checkedCount}/{totalCount}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>groceries checked</Text>
            <View style={[styles.statIcon, { backgroundColor: colors.accentSoft }]}><Feather name="shopping-bag" size={16} color={colors.accentForeground} /></View>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionEyebrow, { color: colors.mutedForeground }]}>UP NEXT</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tonight’s dinner</Text>
          </View>
          <View style={[styles.timePill, { backgroundColor: colors.secondary }]}><Feather name="clock" size={13} color={colors.primary} /><Text style={[styles.timeText, { color: colors.primary }]}>20 min</Text></View>
        </View>
        {days[0]?.meals[2] ? <MealCard meal={days[0].meals[2]} /> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  kicker: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, marginBottom: 7 },
  greeting: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: -0.8 },
  hero: { minHeight: 268, borderRadius: 26, padding: 20, overflow: 'hidden', marginBottom: 28 },
  heroCopy: { zIndex: 2, width: '73%' },
  heroBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 12, marginBottom: 18 },
  heroBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 27, lineHeight: 31, letterSpacing: -0.8, marginBottom: 10 },
  heroSub: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, maxWidth: 205 },
  heroButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 13, marginTop: 18 },
  heroButtonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  heroImage: { position: 'absolute', width: 190, height: 190, borderRadius: 95, right: -58, bottom: -36, opacity: 0.92 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 13 },
  sectionEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.3, marginBottom: 5 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: -0.4 },
  linkButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingBottom: 3 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  statGrid: { flexDirection: 'row', gap: 12, marginVertical: 26 },
  statCard: { flex: 1, minHeight: 105, borderRadius: 18, borderWidth: 1, padding: 15, position: 'relative' },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.5, marginBottom: 3 },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, maxWidth: 88, lineHeight: 15 },
  statIcon: { position: 'absolute', top: 13, right: 13, width: 31, height: 31, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  timePill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 6 },
  timeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  pressed: { opacity: 0.7 },
});
