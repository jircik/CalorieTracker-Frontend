"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "@/components/features/ProfileForm";
import { updateProfile } from "@/api/users";
import { extractApiError } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function ProfileSetupPage() {
  const router = useRouter();
  const userId = useAuth((s) => s.userId);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Set up your profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tell us a bit about yourself so we can personalize your goals. You can skip and
          update later.
        </p>
      </header>

      <Card className="p-5">
        <ProfileForm
          submitting={submitting}
          submitLabel="Save and continue"
          secondaryLabel="Skip for now"
          onSecondary={() => router.replace("/dashboard")}
          onSubmit={async (body) => {
            if (!userId) return;
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
          }}
        />
      </Card>
    </div>
  );
}
