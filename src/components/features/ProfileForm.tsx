"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ActivityLevel, Gender, ProfileUpdateRequest, UserResponse } from "@/types";

const numberOrEmpty = z
  .string()
  .refine((v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0), {
    message: "Must be a non-negative number",
  });

const schema = z.object({
  age: numberOrEmpty,
  heightInCm: numberOrEmpty,
  currentWeight: numberOrEmpty,
  weightGoal: numberOrEmpty,
  dailyCalorieIntakeGoal: numberOrEmpty,
  dailyWaterGoalMl: numberOrEmpty,
  gender: z.enum(["MALE", "FEMALE", "RATHER_NOT_SAY", ""]),
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "INTENSE", ""]),
});

type FormValues = z.infer<typeof schema>;

const GENDERS: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "RATHER_NOT_SAY", label: "Prefer not to say" },
];

const ACTIVITY: { value: ActivityLevel; label: string }[] = [
  { value: "SEDENTARY", label: "Sedentary — little or no exercise" },
  { value: "LIGHT", label: "Light — 1–3 days/week" },
  { value: "MODERATE", label: "Moderate — 3–5 days/week" },
  { value: "INTENSE", label: "Intense — 6+ days/week" },
];

interface Props {
  defaults?: UserResponse | null;
  submitting?: boolean;
  submitLabel?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onSubmit: (body: ProfileUpdateRequest) => void | Promise<void>;
}

const toStr = (n: number | null | undefined): string => (n == null ? "" : String(n));
const toNum = (s: string): number | null => {
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const toInt = (s: string): number | null => {
  if (s === "") return null;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
};

export function ProfileForm({
  defaults,
  submitting,
  submitLabel = "Save",
  secondaryLabel,
  onSecondary,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: toStr(defaults?.age),
      heightInCm: toStr(defaults?.heightInCm),
      currentWeight: toStr(defaults?.currentWeight),
      weightGoal: toStr(defaults?.weightGoal),
      dailyCalorieIntakeGoal: toStr(defaults?.dailyCalorieIntakeGoal),
      dailyWaterGoalMl: toStr(defaults?.dailyWaterGoalMl),
      gender: defaults?.gender ?? "",
      activityLevel: defaults?.activityLevel ?? "",
    },
  });

  const submit = handleSubmit(async (raw) => {
    const body: ProfileUpdateRequest = {
      age: toInt(raw.age),
      heightInCm: toInt(raw.heightInCm),
      currentWeight: toNum(raw.currentWeight),
      weightGoal: toNum(raw.weightGoal),
      dailyCalorieIntakeGoal: toNum(raw.dailyCalorieIntakeGoal),
      dailyWaterGoalMl: toInt(raw.dailyWaterGoalMl),
      gender: raw.gender ? (raw.gender as Gender) : null,
      activityLevel: raw.activityLevel ? (raw.activityLevel as ActivityLevel) : null,
    };
    await onSubmit(body);
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Age"
          type="number"
          inputMode="numeric"
          min={1}
          error={errors.age?.message}
          {...register("age")}
        />
        <Input
          label="Height (cm)"
          type="number"
          step="1"
          inputMode="numeric"
          error={errors.heightInCm?.message}
          {...register("heightInCm")}
        />
        <Input
          label="Current weight (kg)"
          type="number"
          step="0.1"
          inputMode="decimal"
          error={errors.currentWeight?.message}
          {...register("currentWeight")}
        />
        <Input
          label="Weight goal (kg)"
          type="number"
          step="0.1"
          inputMode="decimal"
          error={errors.weightGoal?.message}
          {...register("weightGoal")}
        />
        <Input
          label="Daily calorie goal (kcal)"
          type="number"
          step="1"
          inputMode="numeric"
          error={errors.dailyCalorieIntakeGoal?.message}
          {...register("dailyCalorieIntakeGoal")}
        />
        <Input
          label="Daily water goal (ml)"
          type="number"
          step="1"
          inputMode="numeric"
          error={errors.dailyWaterGoalMl?.message}
          {...register("dailyWaterGoalMl")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Gender</label>
        <select
          {...register("gender")}
          className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select…</option>
          {GENDERS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Activity level</label>
        <select
          {...register("activityLevel")}
          className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select…</option>
          {ACTIVITY.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {secondaryLabel && onSecondary && (
          <Button type="button" variant="secondary" onClick={onSecondary} disabled={submitting}>
            {secondaryLabel}
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
