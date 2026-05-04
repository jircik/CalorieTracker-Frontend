"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { AlertTriangle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CalorieRing } from "./CalorieRing";
import { MacroBar } from "./MacroBar";
import { WaterWidget } from "./WaterWidget";
import { MealCard } from "./MealCard";
import { AddMealModal } from "./AddMealModal";
import { getUser } from "@/api/users";
import { getMealsByDate } from "@/api/meals";
import { getDailyWater } from "@/api/water";
import { getSummary } from "@/api/summary";
import { extractApiError } from "@/lib/api";
import { fmtDate, num, shiftDate, todayIso } from "@/lib/format";
import type { MealType } from "@/types";

const ORDER: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];

interface Props {
  userId: number;
  showDatePicker?: boolean;
}

export function DayView({ userId, showDatePicker }: Props) {
  const [date, setDate] = useState<string>(todayIso());
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<MealType | null>(null);

  const [userQ, mealsQ, waterQ, summaryQ] = useQueries({
    queries: [
      { queryKey: ["user", userId], queryFn: () => getUser(userId) },
      {
        queryKey: ["meals", userId, date],
        queryFn: () => getMealsByDate(userId, date),
      },
      {
        queryKey: ["water", userId, date],
        queryFn: () => getDailyWater(userId, date),
      },
      {
        queryKey: ["summary", userId, date, "DAILY"],
        queryFn: () =>
          getSummary(userId, { startDate: date, periodType: "DAILY" }),
      },
    ],
  });

  const loading = userQ.isLoading || mealsQ.isLoading || waterQ.isLoading || summaryQ.isLoading;

  const failed = [
    { name: "profile", q: userQ },
    { name: "meals", q: mealsQ },
    { name: "water", q: waterQ },
    { name: "summary", q: summaryQ },
  ].filter((x) => x.q.isError);

  const refetchAll = () => {
    if (userQ.isError) userQ.refetch();
    if (mealsQ.isError) mealsQ.refetch();
    if (waterQ.isError) waterQ.refetch();
    if (summaryQ.isError) summaryQ.refetch();
  };

  const onAdd = (type: MealType) => {
    setAddType(type);
    setAddOpen(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {showDatePicker ? "Diary" : "Today"}
          </h1>
          <p className="text-sm text-slate-600">{fmtDate(date)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDate(shiftDate(date, -1))}
            aria-label="Previous day"
          >
            <ChevronLeft size={16} />
          </Button>
          {showDatePicker ? (
            <input
              type="date"
              value={date}
              max={todayIso()}
              onChange={(e) => setDate(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDate(todayIso())}
              disabled={date === todayIso()}
            >
              Today
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDate(shiftDate(date, 1))}
            disabled={date >= todayIso()}
            aria-label="Next day"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </header>

      {failed.length > 0 && (
        <Card className="flex items-start gap-3 border-red-200 bg-red-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
          <div className="flex-1 text-sm">
            <div className="font-medium text-red-900">
              Couldn&apos;t load: {failed.map((f) => f.name).join(", ")}
            </div>
            <div className="mt-0.5 text-red-700">
              {extractApiError(failed[0].q.error)}
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={refetchAll}>
            <RefreshCw size={14} /> Retry
          </Button>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center text-sm text-slate-500">Loading…</Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center p-5 lg:col-span-1">
              <CalorieRing
                consumed={summaryQ.data?.totalCalories ?? 0}
                goal={userQ.data?.dailyCalorieIntakeGoal ?? null}
              />
            </Card>
            <Card className="flex flex-col p-5 lg:col-span-1">
              <h2 className="mb-3 font-semibold text-slate-900">Macros</h2>
              <MacroBar
                protein={summaryQ.data?.totalProtein ?? 0}
                carbs={summaryQ.data?.totalCarbs ?? 0}
                fat={summaryQ.data?.totalFat ?? 0}
              />
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-500">Meals</div>
                  <div className="text-lg font-semibold tabular-nums">
                    {num(summaryQ.data?.mealCount ?? 0)}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-500">Foods</div>
                  <div className="text-lg font-semibold tabular-nums">
                    {num(summaryQ.data?.foodCount ?? 0)}
                  </div>
                </div>
              </div>
            </Card>
            {waterQ.data && (
              <div className="lg:col-span-1">
                <WaterWidget userId={userId} data={waterQ.data} date={date} />
              </div>
            )}
          </div>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Meals</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ORDER.map((type) => (
                <MealCard
                  key={type}
                  type={type}
                  meal={mealsQ.data?.meals[type] ?? null}
                  onAdd={onAdd}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <AddMealModal
        open={addOpen}
        type={addType}
        date={date}
        userId={userId}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}
