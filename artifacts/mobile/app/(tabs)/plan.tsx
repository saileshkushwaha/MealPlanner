import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
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
import { IconCircleButton, MealCard, ScreenTitle } from '@/components/MealPlanUi';

export default function PlanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { days, weekLabel, swapMeal } = useMealPlan();
  const [selectedDay, setSelectedDay] = useState('mon');
  const day = days.find((item) => item.id === selectedDay) ?? days[0];

  const handleSwap = (mealId: string) => {
    if (!day) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    swapMeal(day.id, mealId);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 96 : 112) }]}>
        <ScreenTitle
          eyebrow="WEEKLY MENU"
          title="Your plan"
          action={<IconCircleButton icon="more-horizontal" accessibilityLabel="Plan options" />}
        />
        <View style={[styles.weekHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.weekLabel, { color: colors.mutedForeground }]}>CURRENT WEEK</Text>
            <Text style={[styles.weekTitle, { color: colors.foreground }]}>{weekLabel}</Text>
          </View>
          <View style={[styles.weekCount, { backgroundColor: colors.secondary }]}><Text style={[styles.weekCountNumber, { color: colors.primary }]}>{days.length}</Text><Text style={[styles.weekCountLabel, { color: colors.primary }]}>days</Text></View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroller}>
          {days.map((item) => {
            const active = item.id === selectedDay;
            return (
              <Pressable key={item.id} onPress={() => setSelectedDay(item.id)} testID={`day-${item.id}`} style={({ pressed }) => [styles.dayChip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }, pressed && styles.pressed]}>
                <Text style={[styles.dayName, { color: active ? colors.primaryForeground : colors.mutedForeground }]}>{item.shortLabel}</Text>
                <Text style={[styles.dayDate, { color: active ? colors.primaryForeground : colors.foreground }]}>{item.dateLabel.split(' ')[1]}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {day ? (
          <View>
            <View style={styles.dayHeading}>
              <View><Text style={[styles.dayHeadingTitle, { color: colors.foreground }]}>{day.shortLabel[0] + day.shortLabel.slice(1).toLowerCase()} meals</Text><Text style={[styles.dayHeadingSub, { color: colors.mutedForeground }]}>Balanced, budget-friendly, no fuss.</Text></View>
              <View style={[styles.caloriePill, { backgroundColor: colors.secondary }]}><Feather name="activity" size={13} color={colors.primary} /><Text style={[styles.calorieText, { color: colors.primary }]}>{day.meals.reduce((sum, meal) => sum + meal.calories, 0)} cal</Text></View>
            </View>
            <View style={styles.mealList}>{day.meals.map((meal) => <MealCard key={meal.id} meal={meal} onSwap={() => handleSwap(meal.id)} />)}</View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20 },
  weekHeader: { borderWidth: 1, borderRadius: 20, padding: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  weekLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2, marginBottom: 6 },
  weekTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.5 },
  weekCount: { width: 49, height: 49, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  weekCountNumber: { fontFamily: 'Inter_700Bold', fontSize: 18, lineHeight: 20 },
  weekCountLabel: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  dayScroller: { gap: 8, paddingBottom: 26 },
  dayChip: { width: 52, height: 63, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dayName: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 0.6, marginBottom: 7 },
  dayDate: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  dayHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 },
  dayHeadingTitle: { fontFamily: 'Inter_700Bold', fontSize: 21, letterSpacing: -0.4, marginBottom: 4 },
  dayHeadingSub: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  caloriePill: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 11 },
  calorieText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  mealList: { gap: 12 },
  pressed: { opacity: 0.7 },
});