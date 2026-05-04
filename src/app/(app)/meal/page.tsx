"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MacroBar } from "@/components/features/MacroBar";
import {
  deleteMeal,
  deleteMealFood,
  getMeal,
  updateMeal,
  updateMealFoodQuantity,
} from "@/api/meals";
import { extractApiError, getDuplicateMealId } from "@/lib/api";
import { fmtDate, fmtTime, num } from "@/lib/format";
import type { MealFoodResponse, MealType } from "@/types";

const TYPE_LABEL: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACKS: "Snacks",
};

function MealDetailInner() {
  const sp = useSearchParams();
  const idStr = sp.get("id");
  const mealId = Number(idStr);
  const router = useRouter();
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dtValue, setDtValue] = useState<string>("");
  const [editingTime, setEditingTime] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => getMeal(mealId),
    enabled: Number.isFinite(mealId) && mealId > 0,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, qty }: { id: number; qty: number }) =>
      updateMealFoodQuantity(mealId, id, qty),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meal", mealId] });
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      setEditingId(null);
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  const deleteFoodMut = useMutation({
    mutationFn: (id: number) => deleteMealFood(mealId, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meal", mealId] });
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      toast.success("Food removed");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  const updateTimeMut = useMutation({
    mutationFn: (dateTime: string) => updateMeal(mealId, { dateTime }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meal", mealId] });
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      toast.success("Meal time updated");
      setEditingTime(false);
    },
    onError: (err) => {
      const existingId = getDuplicateMealId(err);
      if (existingId) {
        toast.warning("That day already has a meal of this type", {
          description: "Opening the existing meal.",
        });
        router.replace(`/meal?id=${existingId}`);
      } else {
        toast.error(extractApiError(err));
      }
    },
  });

  const deleteMealMut = useMutation({
    mutationFn: () => deleteMeal(mealId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      toast.success("Meal deleted");
      router.replace("/diary");
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  if (!idStr || !Number.isFinite(mealId)) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-slate-600">Missing meal ID.</p>
        <Link
          href="/diary"
          className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
        >
          <ArrowLeft size={16} /> Back to diary
        </Link>
      </Card>
    );
  }

  if (isLoading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (isError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-red-600">{extractApiError(error)}</p>
        <Link
          href="/diary"
          className="mt-3 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"
        >
          <ArrowLeft size={16} /> Back to diary
        </Link>
      </Card>
    );
  }
  if (!data) return null;

  const startEdit = (food: MealFoodResponse) => {
    setEditingId(food.id);
    setEditValue(String(food.quantity));
  };

  const saveEdit = (id: number) => {
    const q = Number(editValue);
    if (!Number.isFinite(q) || q <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    updateMut.mutate({ id, qty: q });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-emerald-700">
              {TYPE_LABEL[data.mealType]}
            </div>
            {editingTime ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="datetime-local"
                  value={dtValue}
                  onChange={(e) => setDtValue(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  size="sm"
                  loading={updateTimeMut.isPending}
                  onClick={() => {
                    if (!dtValue) return;
                    const isoLocal =
                      dtValue.length === 16 ? `${dtValue}:00` : dtValue;
                    if (isoLocal === data.dateTime) {
                      setEditingTime(false);
                      return;
                    }
                    updateTimeMut.mutate(isoLocal);
                  }}
                >
                  <Check size={14} /> Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setDtValue(data.dateTime.slice(0, 16));
                    setEditingTime(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setDtValue(data.dateTime.slice(0, 16));
                  setEditingTime(true);
                }}
                className="mt-1 flex flex-col items-start text-left"
                aria-label="Edit meal time"
              >
                <span className="flex items-center gap-2 text-2xl font-semibold text-slate-900 hover:text-emerald-700">
                  {fmtDate(data.dateTime)}
                  <Pencil size={16} className="text-slate-400" />
                </span>
                <span className="text-sm text-slate-500">{fmtTime(data.dateTime)}</span>
              </button>
            )}
          </div>
          <div className="rounded-xl bg-emerald-50 px-4 py-2 text-right">
            <div className="text-xs text-emerald-700">Total</div>
            <div className="text-2xl font-semibold tabular-nums text-emerald-800">
              {num(data.totalCalories)}
            </div>
            <div className="text-xs text-emerald-700">kcal</div>
          </div>
        </div>

        <div className="mt-5">
          <MacroBar
            protein={data.totalProtein}
            carbs={data.totalCarbs}
            fat={data.totalFat}
          />
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Foods</h2>
        <Link href={`/meal/add-food?mealId=${mealId}`}>
          <Button size="sm">
            <Plus size={16} /> Add food
          </Button>
        </Link>
      </div>

      {data.foods.length === 0 ? (
        <Card className="p-6 text-center text-sm text-slate-500">
          No foods yet. Tap &ldquo;Add food&rdquo; to search and log one.
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {data.foods.map((food) => {
            const editing = editingId === food.id;
            return (
              <Card key={food.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{food.foodName}</div>
                    {editing ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          inputMode="decimal"
                          step="1"
                          min="0.1"
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-9 w-24 rounded-lg border border-slate-200 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-500">{food.unit}</span>
                        <button
                          onClick={() => saveEdit(food.id)}
                          aria-label="Save"
                          className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-700"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          aria-label="Cancel"
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-1 text-sm text-slate-500">
                        {num(food.quantity, 1)} {food.unit}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>
                        <span className="tabular-nums font-medium text-slate-900">
                          {num(food.calories)}
                        </span>{" "}
                        kcal
                      </span>
                      <span>
                        P{" "}
                        <span className="tabular-nums font-medium text-slate-900">
                          {num(food.protein, 1)}g
                        </span>
                      </span>
                      <span>
                        C{" "}
                        <span className="tabular-nums font-medium text-slate-900">
                          {num(food.carbs, 1)}g
                        </span>
                      </span>
                      <span>
                        F{" "}
                        <span className="tabular-nums font-medium text-slate-900">
                          {num(food.fat, 1)}g
                        </span>
                      </span>
                    </div>
                  </div>
                  {!editing && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(food)}
                        aria-label={`Edit ${food.foodName}`}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteFoodMut.mutate(food.id)}
                        disabled={deleteFoodMut.isPending}
                        aria-label={`Delete ${food.foodName}`}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-4 border-t border-slate-200 pt-4">
        <Button variant="danger" onClick={() => setConfirmDelete(true)}>
          <Trash2 size={16} /> Delete meal
        </Button>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this meal?"
      >
        <p className="text-sm text-slate-600">
          This will remove the meal and all its food entries. This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteMealMut.isPending}
            onClick={() => deleteMealMut.mutate()}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function MealDetailPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <MealDetailInner />
    </Suspense>
  );
}
