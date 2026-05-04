"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { MacroBar } from "@/components/features/MacroBar";
import { getSummary } from "@/api/summary";
import { extractApiError } from "@/lib/api";
import { fmtDateRange, num, todayIso } from "@/lib/format";
import { useAuth } from "@/store/auth";
import type { PeriodType } from "@/types";

const PERIODS: { value: PeriodType; label: string }[] = [
  { value: "DAILY", label: "Today" },
  { value: "WEEKLY", label: "This week" },
  { value: "MONTHLY", label: "This month" },
  { value: "CUSTOM", label: "Custom" },
];

export default function HistoryPage() {
  const userId = useAuth((s) => s.userId);
  const [period, setPeriod] = useState<PeriodType>("WEEKLY");
  const [start, setStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [end, setEnd] = useState<string>(todayIso());

  const params = useMemo(() => {
    if (period === "CUSTOM") {
      return { startDate: start, endDate: end, periodType: "CUSTOM" as const };
    }
    return { startDate: todayIso(), periodType: period };
  }, [period, start, end]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["summary", userId, params],
    queryFn: () => getSummary(userId!, params),
    enabled: !!userId,
  });

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Nutrition history</h1>
        <p className="text-sm text-slate-600">Aggregated totals for any time period.</p>
      </header>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                period === p.value
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {period === "CUSTOM" && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">From</span>
              <input
                type="date"
                value={start}
                max={end}
                onChange={(e) => setStart(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">To</span>
              <input
                type="date"
                value={end}
                min={start}
                max={todayIso()}
                onChange={(e) => setEnd(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>
        )}
      </Card>

      {isLoading && (
        <Card className="p-6 text-center text-sm text-slate-500">Loading…</Card>
      )}
      {isError && (
        <Card className="p-6 text-center text-sm text-red-600">
          {extractApiError(error)}
        </Card>
      )}

      {data && (
        <>
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wide text-emerald-700">
              {data.periodType}
            </div>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {fmtDateRange(data.startDate, data.endDate)}
            </h2>
            <p className="text-sm text-slate-500">
              {data.daysInPeriod} day{data.daysInPeriod === 1 ? "" : "s"}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Calories" value={num(data.totalCalories)} />
              <Stat
                label="Avg / day"
                value={num(data.averageCaloriesPerDay, 0)}
                suffix="kcal"
              />
              <Stat label="Meals" value={num(data.mealCount)} />
              <Stat label="Foods" value={num(data.foodCount)} />
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 font-semibold text-slate-900">Macro totals</h3>
            <MacroBar
              protein={data.totalProtein}
              carbs={data.totalCarbs}
              fat={data.totalFat}
            />
          </Card>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold tabular-nums text-slate-900">
        {value}
        {suffix && <span className="ml-1 text-xs font-normal text-slate-500">{suffix}</span>}
      </div>
    </div>
  );
}
