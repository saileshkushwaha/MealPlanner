import { Feather, Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Meal, MealImage } from '@/context/MealPlanContext';

export const mealImages: Record<MealImage, ImageSourcePropType> = {
  chicken: require('@/assets/images/chicken-bowl.jpg'),
  pasta: require('@/assets/images/pesto-pasta.jpg'),
  toast: require('@/assets/images/avocado-toast.jpg'),
};

export function ScreenTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  const colors = useColors();
  return (
    <View style={styles.titleRow}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function MealCard({ meal, compact = false, onSwap }: { meal: Meal; compact?: boolean; onSwap?: () => void }) {
  const colors = useColors();
  return (
    <View style={[styles.mealCard, { backgroundColor: colors.card, borderColor: colors.border }, compact && styles.compactMealCard]}>
      <Image source={mealImages[meal.image]} style={[styles.mealImage, compact && styles.compactMealImage]} />
      <View style={styles.mealInfo}>
        <View style={styles.mealMetaRow}>
          <Text style={[styles.mealKind, { color: colors.primary }]}>{meal.kind.toUpperCase()}</Text>
          <Text style={[styles.mealTime, { color: colors.mutedForeground }]}>{meal.duration} min</Text>
        </View>
        <Text style={[styles.mealTitle, { color: colors.foreground }]} numberOfLines={1}>{meal.title}</Text>
        <Text style={[styles.mealDetail, { color: colors.mutedForeground }]} numberOfLines={1}>{meal.detail}</Text>
        {!compact && onSwap ? (
          <Pressable onPress={onSwap} testID={`swap-${meal.id}`} style={({ pressed }) => [styles.swapButton, pressed && styles.pressed]}>
            <Feather name="shuffle" size={14} color={colors.primary} />
            <Text style={[styles.swapText, { color: colors.primary }]}>Swap meal</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function IconCircleButton({ icon, onPress, accessibilityLabel }: { icon: keyof typeof Feather.glyphMap; onPress?: () => void; accessibilityLabel: string }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={accessibilityLabel}
      style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}
    >
      <Feather name={icon} size={18} color={colors.foreground} />
    </Pressable>
  );
}

export function EmptyIcon({ name = 'checkmark-circle' }: { name?: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  return (
    <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
      <Ionicons name={name} size={22} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.4, marginBottom: 7 },
  screenTitle: { fontFamily: 'Inter_700Bold', fontSize: 30, letterSpacing: -0.7 },
  mealCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', flexDirection: 'row', minHeight: 112 },
  compactMealCard: { minHeight: 92 },
  mealImage: { width: 112, height: 112 },
  compactMealImage: { width: 92, height: 92 },
  mealInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  mealMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  mealKind: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  mealTime: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  mealTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 4, letterSpacing: -0.2 },
  mealDetail: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  swapButton: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, alignSelf: 'flex-start' },
  swapText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  iconButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65 },
});