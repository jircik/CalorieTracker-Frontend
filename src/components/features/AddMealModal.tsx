"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createMeal } from "@/api/meals";
import { extractApiError } from "@/lib/api";
import { nowLocalDateTime } from "@/lib/format";
import type { MealType } from "@/types";

interface Props {
  open: boolean;
  type: MealType | null;
  date?: string;
  onClose: () => void;
  userId: number;
}

const LABEL: Record<MealType, string> = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACKS: "Snacks",
};

export function AddMealModal({ open, type, date, onClose, userId }: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const [dt, setDt] = useState<string>(() => initialDateTime(date));

  function initialDateTime(d?: string): string {
    if (d) {
      // place at noon on selected date if not today
      const today = new Date().toISOString().slice(0, 10);
      if (d === today) return nowLocalDateTime().slice(0, 16);
      return `${d}T12:00`;
    }
    return nowLocalDateTime().slice(0, 16);
  }

  const mut = useMutation({
    mutationFn: () => {
      if (!type) throw new Error("Missing meal type");
      return createMeal({ dateTime: `${dt}:00`, mealType: type });
    },
    onSuccess: (meal) => {
      qc.invalidateQueries({ queryKey: ["meals", userId] });
      toast.success("Meal created");
      onClose();
      router.push(`/meal?id=${meal.id}`);
    },
    onError: (err) => toast.error(extractApiError(err)),
  });

  // reset dt when opened
  if (open && !dt) setDt(initialDateTime(date));

  return (
    <Modal open={open} onClose={onClose} title={type ? `Add ${LABEL[type]}` : "Add meal"}>
      <div className="flex flex-col gap-4">
        <Input
          label="Date & time"
          type="datetime-local"
          value={dt}
          onChange={(e) => setDt(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={mut.isPending}>
            Cancel
          </Button>
          <Button onClick={() => mut.mutate()} loading={mut.isPending}>
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
}
