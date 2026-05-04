"use client";

import { num } from "@/lib/format";

interface Props {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroBar({ protein, carbs, fat }: Props) {
  const total = protein + carbs + fat;
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="bg-emerald-500" style={{ width: `${pct(protein)}%` }} />
        <div className="bg-amber-500" style={{ width: `${pct(carbs)}%` }} />
        <div className="bg-rose-500" style={{ width: `${pct(fat)}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="flex flex-col">
          <span className="flex items-center justify-center gap-1 font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Protein
          </span>
          <span className="tabular-nums text-slate-900">{num(protein, 1)} g</span>
        </div>
        <div className="flex flex-col">
          <span className="flex items-center justify-center gap-1 font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Carbs
          </span>
          <span className="tabular-nums text-slate-900">{num(carbs, 1)} g</span>
        </div>
        <div className="flex flex-col">
          <span className="flex items-center justify-center gap-1 font-medium text-slate-700">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Fat
          </span>
          <span className="tabular-nums text-slate-900">{num(fat, 1)} g</span>
        </div>
      </div>
    </div>
  );
}
