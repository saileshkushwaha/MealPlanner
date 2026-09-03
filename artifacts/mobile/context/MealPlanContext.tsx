import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type MealKind = 'Breakfast' | 'Lunch' | 'Dinner';
export type MealImage = 'chicken' | 'pasta' | 'toast';

export interface Meal {
  id: string;
  kind: MealKind;
  title: string;
  detail: string;
  duration: number;
  calories: number;
  image: MealImage;
}

export interface DayPlan {
  id: string;
  shortLabel: string;
  dateLabel: string;
  meals: Meal[];
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  category: 'Produce' | 'Pantry' | 'Dairy & chilled';
  checked: boolean;
}

interface StoredState {
  weekLabel: string;
  days: DayPlan[];
  groceries: GroceryItem[];
}

interface MealPlanContextValue extends StoredState {
  hydrated: boolean;
  checkedCount: number;
  totalCount: number;
  progress: number;
  generateFreshPlan: () => void;
  swapMeal: (dayId: string, mealId: string) => void;
  toggleGrocery: (itemId: string) => void;
  addGrocery: (name: string) => void;
}

const STORAGE_KEY = '@campus-meal-planner/state';

const starterMeals: DayPlan[] = [
  {
    id: 'mon',
    shortLabel: 'MON',
    dateLabel: 'Sep 7',
    meals: [
      { id: 'mon-breakfast', kind: 'Breakfast', title: 'Avocado egg toast', detail: 'Sourdough · egg · greens', duration: 10, calories: 420, image: 'toast' },
      { id: 'mon-lunch', kind: 'Lunch', title: 'Lemony chicken bowl', detail: 'Rice · roasted veg · tahini', duration: 25, calories: 590, image: 'chicken' },
      { id: 'mon-dinner', kind: 'Dinner', title: 'Creamy pesto pasta', detail: 'Spinach · tomato · parmesan', duration: 20, calories: 640, image: 'pasta' },
    ],
  },
  {
    id: 'tue',
    shortLabel: 'TUE',
    dateLabel: 'Sep 8',
    meals: [
      { id: 'tue-breakfast', kind: 'Breakfast', title: 'Overnight berry oats', detail: 'Oats · yogurt · berries', duration: 5, calories: 360, image: 'toast' },
      { id: 'tue-lunch', kind: 'Lunch', title: 'Chicken crunch wrap', detail: 'Tortilla · slaw · avocado', duration: 15, calories: 510, image: 'chicken' },
      { id: 'tue-dinner', kind: 'Dinner', title: 'Tomato pesto pasta', detail: 'Penne · spinach · parmesan', duration: 20, calories: 620, image: 'pasta' },
    ],
  },
  {
    id: 'wed',
    shortLabel: 'WED',
    dateLabel: 'Sep 9',
    meals: [
      { id: 'wed-breakfast', kind: 'Breakfast', title: 'Avocado egg toast', detail: 'Sourdough · egg · greens', duration: 10, calories: 420, image: 'toast' },
      { id: 'wed-lunch', kind: 'Lunch', title: 'Lemony chicken bowl', detail: 'Rice · roasted veg · tahini', duration: 25, calories: 590, image: 'chicken' },
      { id: 'wed-dinner', kind: 'Dinner', title: 'Creamy pesto pasta', detail: 'Spinach · tomato · parmesan', duration: 20, calories: 640, image: 'pasta' },
    ],
  },
  {
    id: 'thu',
    shortLabel: 'THU',
    dateLabel: 'Sep 10',
    meals: [
      { id: 'thu-breakfast', kind: 'Breakfast', title: 'Overnight berry oats', detail: 'Oats · yogurt · berries', duration: 5, calories: 360, image: 'toast' },
      { id: 'thu-lunch', kind: 'Lunch', title: 'Chicken crunch wrap', detail: 'Tortilla · slaw · avocado', duration: 15, calories: 510, image: 'chicken' },
      { id: 'thu-dinner', kind: 'Dinner', title: 'Tomato pesto pasta', detail: 'Penne · spinach · parmesan', duration: 20, calories: 620, image: 'pasta' },
    ],
  },
  {
    id: 'fri',
    shortLabel: 'FRI',
    dateLabel: 'Sep 11',
    meals: [
      { id: 'fri-breakfast', kind: 'Breakfast', title: 'Avocado egg toast', detail: 'Sourdough · egg · greens', duration: 10, calories: 420, image: 'toast' },
      { id: 'fri-lunch', kind: 'Lunch', title: 'Lemony chicken bowl', detail: 'Rice · roasted veg · tahini', duration: 25, calories: 590, image: 'chicken' },
      { id: 'fri-dinner', kind: 'Dinner', title: 'Creamy pesto pasta', detail: 'Spinach · tomato · parmesan', duration: 20, calories: 640, image: 'pasta' },
    ],
  },
  {
    id: 'sat',
    shortLabel: 'SAT',
    dateLabel: 'Sep 12',
    meals: [
      { id: 'sat-breakfast', kind: 'Breakfast', title: 'Overnight berry oats', detail: 'Oats · yogurt · berries', duration: 5, calories: 360, image: 'toast' },
      { id: 'sat-lunch', kind: 'Lunch', title: 'Chicken crunch wrap', detail: 'Tortilla · slaw · avocado', duration: 15, calories: 510, image: 'chicken' },
      { id: 'sat-dinner', kind: 'Dinner', title: 'Tomato pesto pasta', detail: 'Penne · spinach · parmesan', duration: 20, calories: 620, image: 'pasta' },
    ],
  },
  {
    id: 'sun',
    shortLabel: 'SUN',
    dateLabel: 'Sep 13',
    meals: [
      { id: 'sun-breakfast', kind: 'Breakfast', title: 'Avocado egg toast', detail: 'Sourdough · egg · greens', duration: 10, calories: 420, image: 'toast' },
      { id: 'sun-lunch', kind: 'Lunch', title: 'Lemony chicken bowl', detail: 'Rice · roasted veg · tahini', duration: 25, calories: 590, image: 'chicken' },
      { id: 'sun-dinner', kind: 'Dinner', title: 'Creamy pesto pasta', detail: 'Spinach · tomato · parmesan', duration: 20, calories: 640, image: 'pasta' },
    ],
  },
];

const starterGroceries: GroceryItem[] = [
  { id: 'rice', name: 'Brown rice', amount: '1 bag', category: 'Pantry', checked: false },
  { id: 'pasta', name: 'Penne pasta', amount: '1 box', category: 'Pantry', checked: false },
  { id: 'oats', name: 'Rolled oats', amount: '1 tub', category: 'Pantry', checked: false },
  { id: 'chicken', name: 'Chicken breast', amount: '1.5 lb', category: 'Dairy & chilled', checked: false },
  { id: 'eggs', name: 'Eggs', amount: '1 dozen', category: 'Dairy & chilled', checked: false },
  { id: 'parmesan', name: 'Parmesan', amount: '1 wedge', category: 'Dairy & chilled', checked: false },
  { id: 'avocados', name: 'Avocados', amount: '3', category: 'Produce', checked: false },
  { id: 'spinach', name: 'Baby spinach', amount: '1 bag', category: 'Produce', checked: false },
  { id: 'tomatoes', name: 'Cherry tomatoes', amount: '1 pint', category: 'Produce', checked: false },
  { id: 'lemons', name: 'Lemons', amount: '3', category: 'Produce', checked: false },
];

const initialState: StoredState = {
  weekLabel: 'Sep 7 – Sep 13',
  days: starterMeals,
  groceries: starterGroceries,
};

function cloneInitialState(): StoredState {
  return JSON.parse(JSON.stringify(initialState)) as StoredState;
}

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(cloneInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          try {
            setState(JSON.parse(stored) as StoredState);
          } catch {
            setState(cloneInitialState());
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }
  }, [hydrated, state]);

  const generateFreshPlan = useCallback(() => {
    setState((current) => ({
      ...current,
      weekLabel: current.weekLabel === 'Sep 7 – Sep 13' ? 'Sep 14 – Sep 20' : 'Sep 7 – Sep 13',
      groceries: current.groceries.map((item) => ({ ...item, checked: false })),
    }));
  }, []);

  const swapMeal = useCallback((dayId: string, mealId: string) => {
    setState((current) => ({
      ...current,
      days: current.days.map((day) => ({
        ...day,
        meals: day.meals.map((meal) => {
          if (day.id !== dayId || meal.id !== mealId) return meal;
          if (meal.title.includes('pasta')) {
            return { ...meal, title: 'Lemon herb chicken', detail: 'Chicken · greens · couscous', duration: 25, calories: 560, image: 'chicken' as MealImage };
          }
          if (meal.title.includes('chicken') || meal.title.includes('wrap')) {
            return { ...meal, title: 'Creamy pesto pasta', detail: 'Spinach · tomato · parmesan', duration: 20, calories: 640, image: 'pasta' as MealImage };
          }
          return { ...meal, title: 'Avocado egg toast', detail: 'Sourdough · egg · greens', duration: 10, calories: 420, image: 'toast' as MealImage };
        }),
      })),
    }));
  }, []);

  const toggleGrocery = useCallback((itemId: string) => {
    setState((current) => ({
      ...current,
      groceries: current.groceries.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item),
    }));
  }, []);

  const addGrocery = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((current) => ({
      ...current,
      groceries: [...current.groceries, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmed,
        amount: '1',
        category: 'Pantry',
        checked: false,
      }],
    }));
  }, []);

  const checkedCount = state.groceries.filter((item) => item.checked).length;
  const totalCount = state.groceries.length;
  const value = useMemo<MealPlanContextValue>(() => ({
    ...state,
    hydrated,
    checkedCount,
    totalCount,
    progress: totalCount ? checkedCount / totalCount : 0,
    generateFreshPlan,
    swapMeal,
    toggleGrocery,
    addGrocery,
  }), [state, hydrated, checkedCount, totalCount, generateFreshPlan, swapMeal, toggleGrocery, addGrocery]);

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
}

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) throw new Error('useMealPlan must be used within MealPlanProvider');
  return context;
}