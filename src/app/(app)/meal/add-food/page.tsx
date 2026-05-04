"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { searchFoods } from "@/api/foods";
import { addFoodToMeal } from "@/api/meals";
import { extractApiError } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { FoodSearchResult } from "@/types";

function AddFoodInner() {
  const sp = useSearchParams();
  const mealIdStr = sp.get("mealId");
  const mealId = Number(mealIdStr);
  const router = useRouter();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 400);
  const [picked, setPicked] = useState<FoodSearchResult | null>(null);
  const [quantity, setQuantity] = useState<string>("100");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["food-search", debounced],
    queryFn: () => searchFoods(debounced),
    enabled: debounced.length > 0,
  });

  const addMut = useMutation({
    mutationFn: () => {
      if (!picked) throw new Error("No food selected");
      const q = Number(quantity);
      if (!Number.isFinite(q) || q <= 0) throw new Error("Quantity must be greater than 0");
      return addFoodToMeal(mealId, {
        foodId: picked.foodId,
        foodName: picked.foodName,
        quantity: q,
        unit: "g",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["meal", mealId] });
      qc.invalidateQueries({ queryKey: ["meals"] });
      qc.invalidateQueries({ queryKey: ["summary"] });
      toast.success("Food added");
      router.replace(`/meal?id=${mealId}`);
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  if (!mealIdStr || !Number.isFinite(mealId)) {
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

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Add food</h1>
        <p className="text-sm text-slate-600">Search and pick a food to log into this meal.</p>
      </header>

      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. chicken breast"
          className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {!debounced && (
        <Card className="p-6 text-center text-sm text-slate-500">
          Start typing to search foods.
        </Card>
      )}

      {debounced && isLoading && (
        <Card className="p-6 text-center text-sm text-slate-500">Searching…</Card>
      )}

      {debounced && isError && (
        <Card className="p-6 text-center text-sm text-red-600">
          {extractApiError(error)}
        </Card>
      )}

      {debounced && data && data.length === 0 && !isLoading && (
        <Card className="p-6 text-center text-sm text-slate-500">
          No foods found for &ldquo;{debounced}&rdquo;.
        </Card>
      )}

      {data && data.length > 0 && (
        <ul className="flex flex-col gap-2">
          {data.map((f) => (
            <li key={f.foodId}>
              <button
                onClick={() => {
                  setPicked(f);
                  setQuantity("100");
                }}
                className="flex w-full flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{f.foodName}</span>
                  {f.brandName && (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      {f.brandName}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">{f.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={!!picked}
        onClose={() => setPicked(null)}
        title={picked ? picked.foodName : "Add food"}
      >
        {picked && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-500">{picked.description}</p>
            <Input
              label="Quantity (g)"
              type="number"
              inputMode="decimal"
              step="1"
              min="0.1"
              value={quantity}
              autoFocus
              onChange={(e) => setQuantity(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setPicked(null)}
                disabled={addMut.isPending}
              >
                Cancel
              </Button>
              <Button onClick={() => addMut.mutate()} loading={addMut.isPending}>
                Add to meal
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AddFoodPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <AddFoodInner />
    </Suspense>
  );
}
