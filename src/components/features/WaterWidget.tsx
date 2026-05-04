"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Droplet, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteWater, logWater } from "@/api/water";
import { extractApiError } from "@/lib/api";
import { fmtTime, num } from "@/lib/format";
import type { DailyWaterResponse } from "@/types";

interface Props {
  userId: number;
  data: DailyWaterResponse;
  date: string;
}

export function WaterWidget({ userId, data, date }: Props) {
  const qc = useQueryClient();

  const addMut = useMutation({
    mutationFn: (amountMl: number) => logWater(userId, amountMl),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["water", userId, date] }),
    onError: (err) => toast.error(extractApiError(err)),
  });

  const delMut = useMutation({
    mutationFn: (logId: number) => deleteWater(userId, logId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["water", userId, date] }),
    onError: (err) => toast.error(extractApiError(err)),
  });

  const pct =
    data.dailyGoalMl && data.dailyGoalMl > 0
      ? Math.min(data.totalConsumedMl / data.dailyGoalMl, 1) * 100
      : 0;

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <Droplet size={18} className="text-sky-600" />
        <h2 className="font-semibold text-slate-900">Water</h2>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-slate-900">
          {num(data.totalConsumedMl)}
        </span>
        <span className="text-sm text-slate-500">
          {data.dailyGoalMl != null ? `/ ${num(data.dailyGoalMl)} ml` : "ml"}
        </span>
      </div>

      {data.dailyGoalMl != null ? (
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-sky-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : (
        <p className="mt-1 text-xs text-slate-500">Set a water goal in your profile.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {[250, 500, 750].map((ml) => (
          <Button
            key={ml}
            size="sm"
            variant="secondary"
            onClick={() => addMut.mutate(ml)}
            disabled={addMut.isPending}
          >
            <Plus size={14} /> {ml} ml
          </Button>
        ))}
      </div>

      {data.logs.length > 0 && (
        <ul className="mt-4 flex flex-col divide-y divide-slate-100 border-t border-slate-100">
          {data.logs.map((log) => (
            <li key={log.id} className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="tabular-nums font-medium text-slate-900">
                  {num(log.amountMl)} ml
                </span>
                <span className="text-slate-500">{fmtTime(log.loggedAt)}</span>
              </div>
              <button
                aria-label="Delete water log"
                onClick={() => delMut.mutate(log.id)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
