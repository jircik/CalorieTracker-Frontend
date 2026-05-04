import api from "@/lib/api";
import type { FoodSearchResult } from "@/types";

export async function searchFoods(q: string) {
  const { data } = await api.get<FoodSearchResult[]>("/foods/search", { params: { q } });
  return data;
}
