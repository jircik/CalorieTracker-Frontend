import { format, parseISO } from "date-fns";
import type { MealType } from "@/types";

export function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function nowLocalDateTime(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
}

export function fmtDate(d: string | Date): string {
  const date = typeof d === "string" ? parseISO(d) : d;
  return format(date, "EEE, MMM d, yyyy");
}

export function fmtTime(d: string | Date): string {
  const date = typeof d === "string" ? parseISO(d) : d;
  return format(date, "h:mm a");
}

export function fmtDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  if (start === end) return format(s, "MMM d, yyyy");
  return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`;
}

export function num(n: number | null | undefined, digits = 0): string {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function shiftDate(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return format(d, "yyyy-MM-dd");
}

const DEFAULT_TIME_BY_TYPE: Record<MealType, string> = {
  BREAKFAST: "08:00:00",
  LUNCH: "12:00:00",
  DINNER: "19:00:00",
  SNACKS: "15:00:00",
};

/**
 * Build an ISO local datetime for a new meal:
 *   today → now (seconds-precision)
 *   other date → that date at the per-type default time
 */
export function defaultMealDateTime(date: string, type: MealType): string {
  if (date === todayIso()) return nowLocalDateTime();
  return `${date}T${DEFAULT_TIME_BY_TYPE[type]}`;
}
