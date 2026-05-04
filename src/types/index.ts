export type Gender = "MALE" | "FEMALE" | "RATHER_NOT_SAY";
export type ActivityLevel = "SEDENTARY" | "LIGHT" | "MODERATE" | "INTENSE";
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS";
export type PeriodType = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  age: number | null;
  heightInCm: number | null;
  currentWeight: number | null;
  weightGoal: number | null;
  dailyCalorieIntakeGoal: number | null;
  dailyWaterGoalMl: number | null;
  gender: Gender | null;
  activityLevel: ActivityLevel | null;
}

export interface ProfileUpdateRequest {
  age?: number | null;
  heightInCm?: number | null;
  currentWeight?: number | null;
  weightGoal?: number | null;
  dailyCalorieIntakeGoal?: number | null;
  dailyWaterGoalMl?: number | null;
  gender?: Gender | null;
  activityLevel?: ActivityLevel | null;
}

export interface FoodSearchResult {
  foodId: string;
  foodName: string;
  brandName: string | null;
  description: string;
}

export interface MealFoodResponse {
  id: number;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface MealResponse {
  id: number;
  userId: number;
  dateTime: string;
  mealType: MealType;
  createdAt: string;
}

export interface MealWithFoodsResponse {
  mealId: number;
  dateTime: string;
  mealType: MealType;
  foods: MealFoodResponse[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealSummaryResponse {
  mealId: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  foodCount: number;
}

export interface MealsByDateResponse {
  userId: number;
  date: string;
  meals: Record<MealType, MealWithFoodsResponse | null>;
}

export interface SummaryResponse {
  userId: number;
  startDate: string;
  endDate: string;
  periodType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
  foodCount: number;
  daysInPeriod: number;
  averageCaloriesPerDay: number;
}

export interface WaterLogResponse {
  id: number;
  amountMl: number;
  loggedAt: string;
}

export interface DailyWaterResponse {
  userId: number;
  date: string;
  dailyGoalMl: number | null;
  totalConsumedMl: number;
  logs: WaterLogResponse[];
}

export interface ApiErrorBody {
  status: number;
  message?: string;
  errors?: string[];
  path?: string;
  timestamp?: string;
}
