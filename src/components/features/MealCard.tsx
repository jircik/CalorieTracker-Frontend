"use client";

import Link from "next/link";
import { ChevronRight, Plus, Coffee, UtensilsCrossed, Soup, Cookie } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { num } from "@/lib/format";
import type { MealType, MealWithFoodsResponse } from "@/types";

const META: Record<MealType, { label: string; Icon: typeof Coffee; color: string }> = {
  BREAKFAST: { label: "Breakfast", Icon: Coffee, color: "bg-amber-50 text-amber-700" },
  LUNCH: { label: "Lunch", Icon: UtensilsCrossed, color: "bg-emerald-50 text-emerald-700" },
  DINNER: { label: "Dinner", Icon: Soup, color: "bg-indigo-50 text-indigo-700" },
  SNACKS: { label: "Snacks", Icon: Cookie, color: "bg-rose-50 text-rose-700" },
};

interface Props {
  type: MealType;
  meal: MealWithFoodsResponse | null;
  onAdd: (type: MealType) => void;
}

export function MealCard({ type, meal, onAdd }: Props) {
  const { label, Icon, color } = META[type];

  if (!meal) {
    return (
      <Card className="overflow-hidden">
        <button
          onClick={() => onAdd(type)}
          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
        >
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon size={20} />
            </span>
            <div>
              <div className="font-medium text-slate-900">{label}</div>
              <div className="text-xs text-slate-500">No meal logged</div>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-700">
            <Plus size={16} /> Add
          </span>
        </button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Link
        href={`/meal?id=${meal.mealId}`}
        className="flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-50 active:bg-slate-100"
      >
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
            <Icon size={20} />
          </span>
          <div>
            <div className="font-medium text-slate-900">{label}</div>
            <div className="text-xs text-slate-500">
              {meal.foods.length} food{meal.foods.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div>
            <div className="font-semibold tabular-nums text-slate-900">
              {num(meal.totalCalories)}
            </div>
            <div className="text-xs text-slate-500">kcal</div>
          </div>
          <ChevronRight size={18} className="text-slate-400" />
        </div>
      </Link>
    </Card>
  );
}
