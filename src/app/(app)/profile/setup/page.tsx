"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateProfile } from "@/api/users";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/store/auth";
import type { ActivityLevel, Gender, ProfileUpdateRequest } from "@/types";

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

const ACTIVITY: { value: ActivityLevel; label: string; hint: string }[] = [
  { value: "SEDENTARY", label: "Sedentary", hint: "Little or no exercise" },
  { value: "LIGHT", label: "Light", hint: "1–3 days/week" },
  { value: "MODERATE", label: "Moderate", hint: "3–5 days/week" },
  { value: "INTENSE", label: "Intense", hint: "6+ days/week" },
];

const STEPS: {
  title: string;
  blurb: string;
  fields: Path<FormValues>[];
}[] = [
  {
    title: "About you",
    blurb: "We use this to personalize your daily targets.",
    fields: ["age", "gender"],
  },
  {
    title: "Body",
    blurb: "A couple measurements help us estimate calorie needs.",
    fields: ["heightInCm", "currentWeight"],
  },
  {
    title: "Activity",
    blurb: "How active are you on a typical week?",
    fields: ["activityLevel"],
  },
  {
    title: "Your goals",
    blurb: "Set targets — you can change these anytime.",
    fields: ["weightGoal", "dailyCalorieIntakeGoal", "dailyWaterGoalMl"],
  },
];

const TOTAL = STEPS.length;

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

export default function ProfileSetupPage() {
  const router = useRouter();
  const userId = useAuth((s) => s.userId);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      age: "",
      heightInCm: "",
      currentWeight: "",
      weightGoal: "",
      dailyCalorieIntakeGoal: "",
      dailyWaterGoalMl: "",
      gender: "",
      activityLevel: "",
    },
  });

  const goNext = async () => {
    const ok = await trigger(STEPS[step].fields);
    if (ok) setStep((s) => Math.min(s + 1, TOTAL - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const skip = () => router.replace("/dashboard");

  const finish = handleSubmit(async (raw) => {
    if (!userId) return;
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
    setSubmitting(true);
    try {
      await updateProfile(userId, body);
      toast.success("Profile saved");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setSubmitting(false);
    }
  });

  const isLast = step === TOTAL - 1;
  const current = STEPS[step];

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Step {step + 1} of {TOTAL}
        </span>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i <= step ? "bg-emerald-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      <Card className="p-6">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold text-slate-900">{current.title}</h1>
          <p className="mt-1 text-sm text-slate-600">{current.blurb}</p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isLast) finish();
            else goNext();
          }}
          className="flex flex-col gap-4"
          noValidate
        >
          {step === 0 && (
            <>
              <Input
                label="Age"
                type="number"
                inputMode="numeric"
                min={1}
                error={errors.age?.message}
                {...register("age")}
              />
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
            </>
          )}

          {step === 1 && (
            <>
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
            </>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Activity level</label>
              <select
                {...register("activityLevel")}
                className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select…</option>
                {ACTIVITY.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label} — {a.hint}
                  </option>
                ))}
              </select>
            </div>
          )}

          {step === 3 && (
            <>
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
            </>
          )}

          <div className="mt-3 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button type="button" variant="secondary" onClick={goBack} disabled={submitting}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button type="submit" loading={submitting && isLast}>
              {isLast ? "Finish" : "Next"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={skip}
          disabled={submitting}
          className="text-sm text-slate-500 hover:text-slate-700 hover:underline disabled:opacity-50"
        >
          skip for now
        </button>
      </div>
    </div>
  );
}
