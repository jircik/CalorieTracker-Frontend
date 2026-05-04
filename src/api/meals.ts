import api from "@/lib/api";
import type {
  MealFoodResponse,
  MealResponse,
  MealSummaryResponse,
  MealType,
  MealWithFoodsResponse,
  MealsByDateResponse,
} from "@/types";

export async function createMeal(body: { dateTime: string; mealType: MealType }) {
  const { data } = await api.post<MealResponse>("/meals", body);
  return data;
}

export async function getMeal(mealId: number) {
  const { data } = await api.get<MealWithFoodsResponse>(`/meals/${mealId}`);
  return data;
}

export async function updateMeal(mealId: number, body: { dateTime: string }) {
  const { data } = await api.patch<MealResponse>(`/meals/${mealId}`, body);
  return data;
}

export async function getMealSummary(mealId: number) {
  const { data } = await api.get<MealSummaryResponse>(`/meals/${mealId}/summary`);
  return data;
}

export async function deleteMeal(mealId: number) {
  await api.delete(`/meals/${mealId}`);
}

export async function getMealsByDate(userId: number, date: string) {
  const { data } = await api.get<MealsByDateResponse>(`/users/${userId}/meals`, {
    params: { date },
  });
  return data;
}

export async function addFoodToMeal(
  mealId: number,
  body: { foodId: string; foodName: string; quantity: number; unit: string }
) {
  const { data } = await api.post<MealFoodResponse>(`/meals/${mealId}/foods`, body);
  return data;
}

export async function updateMealFoodQuantity(
  mealId: number,
  mealFoodId: number,
  quantity: number
) {
  const { data } = await api.patch<MealFoodResponse>(
    `/meals/${mealId}/foods/${mealFoodId}`,
    { quantity }
  );
  return data;
}

export async function deleteMealFood(mealId: number, mealFoodId: number) {
  await api.delete(`/meals/${mealId}/foods/${mealFoodId}`);
}
