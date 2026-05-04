import api from "@/lib/api";
import type { DailyWaterResponse, WaterLogResponse } from "@/types";

export async function logWater(userId: number, amountMl: number) {
  const { data } = await api.post<WaterLogResponse>(`/users/${userId}/water`, { amountMl });
  return data;
}

export async function getDailyWater(userId: number, date: string) {
  const { data } = await api.get<DailyWaterResponse>(`/users/${userId}/water`, {
    params: { date },
  });
  return data;
}

export async function deleteWater(userId: number, logId: number) {
  await api.delete(`/users/${userId}/water/${logId}`);
}
