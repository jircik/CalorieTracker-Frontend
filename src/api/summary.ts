import api from "@/lib/api";
import type { PeriodType, SummaryResponse } from "@/types";

export async function getSummary(
  userId: number,
  params: { startDate: string; endDate?: string; periodType?: PeriodType }
) {
  const { data } = await api.get<SummaryResponse>(`/users/${userId}/summary`, { params });
  return data;
}
