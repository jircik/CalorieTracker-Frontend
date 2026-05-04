"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProfileForm } from "@/components/features/ProfileForm";
import { getUser, updateProfile } from "@/api/users";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function ProfilePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { userId, clear } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-600">Update your goals and body stats.</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            clear();
            router.replace("/login");
          }}
        >
          <LogOut size={16} /> Log out
        </Button>
      </header>

      <Card className="mb-4 p-5">
        <div className="flex flex-col gap-1 text-sm">
          <div className="text-slate-500">Name</div>
          <div className="font-medium">{data?.name ?? "—"}</div>
        </div>
        <div className="mt-3 flex flex-col gap-1 text-sm">
          <div className="text-slate-500">Email</div>
          <div className="font-medium">{data?.email ?? "—"}</div>
        </div>
      </Card>

      <Card className="p-5">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <ProfileForm
            defaults={data}
            submitting={submitting}
            submitLabel="Save changes"
            onSubmit={async (body) => {
              if (!userId) return;
              setSubmitting(true);
              try {
                const updated = await updateProfile(userId, body);
                qc.setQueryData(["user", userId], updated);
                toast.success("Profile updated");
              } catch (err) {
                toast.error(extractApiError(err));
              } finally {
                setSubmitting(false);
              }
            }}
          />
        )}
      </Card>
    </div>
  );
}
