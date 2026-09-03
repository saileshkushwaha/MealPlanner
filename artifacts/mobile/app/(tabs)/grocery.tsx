import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { GroceryItem, useMealPlan } from '@/context/MealPlanContext';
import { EmptyIcon, IconCircleButton, ScreenTitle } from '@/components/MealPlanUi';

const categories: GroceryItem['category'][] = ['Produce', 'Dairy & chilled', 'Pantry'];

export default function GroceryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { groceries, checkedCount, totalCount, progress, toggleGrocery, addGrocery } = useMealPlan();
  const [newItem, setNewItem] = useState('');
  const grouped = useMemo(() => categories.map((category) => ({ category, items: groceries.filter((item) => item.category === category) })).filter((group) => group.items.length), [groceries]);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    addGrocery(newItem);
    setNewItem('');
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + (Platform.OS === 'web' ? 96 : 112) }]}>
        <ScreenTitle eyebrow="SHOPPING LIST" title="Groceries" action={<IconCircleButton icon="share-2" accessibilityLabel="Share grocery list" />} />
        <View style={[styles.progressCard, { backgroundColor: colors.primary }]}>
          <View style={styles.progressTop}><View><Text style={[styles.progressEyebrow, { color: colors.primaryForegroundMuted }]}>THIS WEEK</Text><Text style={[styles.progressTitle, { color: colors.primaryForeground }]}> {checkedCount} of {totalCount} items</Text></View><Text style={[styles.progressPercent, { color: colors.primaryForeground }]}>{Math.round(progress * 100)}%</Text></View>
          <View style={[styles.progressTrack, { backgroundColor: colors.primaryForegroundMuted }]}><View style={[styles.progressFill, { width: `${Math.max(progress * 100, 2)}%`, backgroundColor: colors.accent }]} /></View>
          <Text style={[styles.progressHint, { color: colors.primaryForegroundMuted }]}>{checkedCount === totalCount ? 'Everything is ready to go.' : 'Tap an item when it hits your basket.'}</Text>
        </View>

        <View style={[styles.addRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="plus" size={17} color={colors.mutedForeground} />
          <TextInput value={newItem} onChangeText={setNewItem} onSubmitEditing={handleAdd} returnKeyType="done" placeholder="Add an extra item" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} testID="new-grocery-item" />
          <Pressable onPress={handleAdd} testID="add-grocery-item" style={({ pressed }) => [styles.addButton, { backgroundColor: newItem.trim() ? colors.secondary : colors.muted }, pressed && styles.pressed]}><Feather name="arrow-up" size={17} color={newItem.trim() ? colors.primary : colors.mutedForeground} /></Pressable>
        </View>

        {groceries.length === 0 ? (
          <View style={styles.empty}><EmptyIcon /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your list is clear</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Generate a menu to fill your grocery list.</Text></View>
        ) : grouped.map((group) => (
          <View key={group.category} style={styles.group}>
            <View style={styles.groupHeader}><Text style={[styles.groupTitle, { color: colors.mutedForeground }]}>{group.category.toUpperCase()}</Text><Text style={[styles.groupCount, { color: colors.mutedForeground }]}>{group.items.length} items</Text></View>
            <View style={[styles.itemList, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {group.items.map((item, index) => (
                <Pressable key={item.id} onPress={() => { toggleGrocery(item.id); Haptics.selectionAsync(); }} testID={`grocery-${item.id}`} style={({ pressed }) => [styles.itemRow, index < group.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }, pressed && styles.pressed]}>
                  <View style={[styles.checkbox, { borderColor: item.checked ? colors.primary : colors.input, backgroundColor: item.checked ? colors.primary : 'transparent' }]}>{item.checked ? <Feather name="check" size={13} color={colors.primaryForeground} /> : null}</View>
                  <Text style={[styles.itemName, { color: item.checked ? colors.mutedForeground : colors.foreground }, item.checked && styles.itemChecked]}>{item.name}</Text>
                  <Text style={[styles.itemAmount, { color: colors.mutedForeground }]}>{item.amount}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20 },
  progressCard: { borderRadius: 22, padding: 18, marginBottom: 14 },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  progressEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2, marginBottom: 6 },
  progressTitle: { fontFamily: 'Inter_700Bold', fontSize: 21, letterSpacing: -0.4 },
  progressPercent: { fontFamily: 'Inter_700Bold', fontSize: 26 },
  progressTrack: { height: 8, borderRadius: 5, overflow: 'hidden', marginBottom: 11 },
  progressFill: { height: '100%', borderRadius: 5 },
  progressHint: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  addRow: { minHeight: 52, borderRadius: 17, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 15, paddingRight: 6, marginBottom: 26 },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, paddingHorizontal: 10, paddingVertical: 13 },
  addButton: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  group: { marginBottom: 22 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9, paddingHorizontal: 2 },
  groupTitle: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 },
  groupCount: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  itemList: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
  itemRow: { minHeight: 57, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 11 },
  checkbox: { width: 21, height: 21, borderRadius: 7, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  itemName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  itemAmount: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  itemChecked: { textDecorationLine: 'line-through' },
  empty: { alignItems: 'center', paddingVertical: 55 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 13, marginBottom: 5 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  pressed: { opacity: 0.65 },
});