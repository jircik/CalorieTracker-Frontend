"use client";

import { num } from "@/lib/format";

interface Props {
  consumed: number;
  goal: number | null;
}

export function CalorieRing({ consumed, goal }: Props) {
  const size = 160;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = goal && goal > 0 ? Math.min(consumed / goal, 1) : 0;
  const dash = c * pct;
  const remaining = goal != null ? Math.max(goal - consumed, 0) : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="none"
          />
          {goal != null && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="#059669"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${c - dash}`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: "stroke-dasharray 300ms ease" }}
            />
          )}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums text-slate-900">
            {num(consumed)}
          </span>
          <span className="text-xs text-slate-500">
            {goal != null ? `/ ${num(goal)} kcal` : "kcal"}
          </span>
        </div>
      </div>
      {goal == null ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          Set a calorie goal in your profile to track progress.
        </p>
      ) : (
        <p className="mt-3 text-xs text-slate-500">
          {remaining! > 0 ? `${num(remaining)} kcal remaining` : "Goal reached"}
        </p>
      )}
    </div>
  );
}
