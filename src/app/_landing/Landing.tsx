"use client";

import Link from "next/link";
import { Lora } from "next/font/google";
import {
  Apple,
  Droplet,
  Target,
  Search,
  CalendarRange,
  ArrowRight,
} from "lucide-react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const features = [
  {
    icon: Search,
    title: "Search a real food database",
    body: "Powered by FatSecret — millions of foods with verified nutrition, brand items included.",
    tone: "teal" as const,
  },
  {
    icon: Target,
    title: "Macros, not just calories",
    body: "Track protein, carbs, and fat against goals tailored to you. See your day at a glance.",
    tone: "amber" as const,
  },
  {
    icon: Droplet,
    title: "One tap to log water",
    body: "Hit your hydration target without thinking about it. Quick adds for every cup.",
    tone: "teal" as const,
  },
  {
    icon: CalendarRange,
    title: "See trends, not just today",
    body: "Daily, weekly, and monthly summaries reveal habits a single day can't show you.",
    tone: "amber" as const,
  },
];

const steps = [
  {
    n: "01",
    title: "Set your goal",
    body: "Tell us your target calories and macros — or let us suggest them.",
  },
  {
    n: "02",
    title: "Log a meal in seconds",
    body: "Search, pick a serving, done. We remember what you eat often.",
  },
  {
    n: "03",
    title: "Watch the week",
    body: "Daily rings turn into weekly trends. Adjust without guesswork.",
  },
];

export default function Landing() {
  return (
    <div className={`${lora.variable} min-h-screen bg-white text-slate-900`}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="" className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight text-[#085041]">
              CalorieTracker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center rounded-lg bg-[#085041] px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0a6b58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#085041] focus-visible:ring-offset-2"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute -top-20 right-0 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:grid-cols-12 lg:gap-16 lg:pt-28 lg:pb-28">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-[#085041]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#085041]" />
              Nutrition tracking, without the friction
            </span>
            <h1
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
              className="mt-5 text-balance text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
            >
              Eat with{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-[#085041]">intention</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded bg-amber-200/80 sm:bottom-2 sm:h-4"
                />
              </span>
              .<br className="hidden sm:block" /> See the week clearly.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
              CalorieTracker is a fast, focused nutrition tracker. Log meals from
              a real food database, hit your macros and water targets, and watch
              the trends that actually matter.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-6 text-base font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:bg-[#FBBF24] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-base font-semibold text-slate-900 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                I already have an account
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Free to use. No credit card. Your data stays yours.
            </p>
          </div>

          {/* Visual block */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
              <div className="absolute inset-0 -rotate-3 rounded-3xl bg-[#085041]" />
              <div className="absolute inset-0 rotate-2 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Today
                    </p>
                    <p
                      style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                      className="text-2xl font-semibold text-slate-900"
                    >
                      1,840 kcal
                    </p>
                  </div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-[#085041]">
                    <Apple className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: "Protein", value: 78, target: 120, color: "bg-[#085041]" },
                    { label: "Carbs", value: 210, target: 260, color: "bg-amber-400" },
                    { label: "Fat", value: 52, target: 70, color: "bg-emerald-400" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-700">{m.label}</span>
                        <span className="tabular-nums text-slate-500">
                          {m.value} / {m.target} g
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`${m.color} h-full rounded-full`}
                          style={{ width: `${(m.value / m.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-sky-500" />
                      <span className="text-sm font-medium text-slate-700">
                        Water
                      </span>
                    </div>
                    <span className="text-sm tabular-nums text-slate-500">
                      6 / 8 cups
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-6 flex-1 rounded ${
                          i < 6 ? "bg-sky-400" : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / promise band */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#085041]">
              Why CalorieTracker
            </p>
            <h2
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
              className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
            >
              Most trackers feel like spreadsheets. This one feels like a habit.
            </h2>
            <p className="mt-4 text-balance text-base leading-relaxed text-slate-600 sm:text-lg">
              Logging takes seconds, not minutes. The numbers are accurate. The
              weekly view tells you something you didn't already know.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body, tone }) => {
            const isAmber = tone === "amber";
            return (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:p-8"
              >
                <div
                  className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${
                    isAmber
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-50 text-[#085041]"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                  className="text-2xl font-semibold tracking-tight text-slate-900"
                >
                  {title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600">
                  {body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#085041] text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-300">
              How it works
            </p>
            <h2
              style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
              className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Three steps. No spreadsheets.
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <span
                  style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
                  className="text-3xl font-semibold text-amber-300"
                >
                  {s.n}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-emerald-50/80">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2
          style={{ fontFamily: "var(--font-lora), Georgia, serif" }}
          className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
        >
          Ready to see your week clearly?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-slate-600">
          Create an account in under a minute. Log your first meal today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#085041] px-7 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0a6b58] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#085041] focus-visible:ring-offset-2"
          >
            Create free account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.svg" alt="" className="h-5 w-5" />
            <span>© CalorieTracker</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:text-[#085041]">
              Log in
            </Link>
            <Link href="/register" className="hover:text-[#085041]">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
