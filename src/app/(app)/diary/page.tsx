"use client";

import { DayView } from "@/components/features/DayView";
import { useAuth } from "@/store/auth";

export default function DiaryPage() {
  const userId = useAuth((s) => s.userId);
  if (!userId) return null;
  return <DayView userId={userId} showDatePicker />;
}
