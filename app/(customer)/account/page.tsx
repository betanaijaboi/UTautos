import Link from "next/link";
import { EyeOff, ShieldCheck, User } from "lucide-react";
import { getCurrentProfile } from "@/lib/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { FaceBlurToggle } from "./face-blur-toggle";

export const metadata = { title: "Account — UT Autos" };

export default async function AccountPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold">
        Your Account
      </p>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
        Account
      </h1>

      <div className="mt-10 space-y-4">
        <Card>
          <CardContent className="flex gap-3 p-5">
            <User className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Profile</p>
              <p className="mt-1 text-sm text-foreground">{profile?.full_name}</p>
              <p className="text-sm text-muted">{profile?.email}</p>
              <p className="text-sm text-muted">{profile?.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start justify-between gap-4 p-5">
            <div className="flex gap-3">
              <EyeOff className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Blur my face by default
                </p>
                <p className="mt-1 text-sm text-muted">
                  When enabled, your detailer's smart-glasses recordings
                  automatically blur your face. You can override this per
                  booking at checkout.
                </p>
              </div>
            </div>
            <FaceBlurToggle initialValue={profile?.default_face_blur_opt_in ?? true} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Recording &amp; Privacy Disclaimer
              </p>
              <p className="mt-1 text-sm text-muted">
                Review the full policy on smart-glasses documentation and how
                your data is handled.
              </p>
              <Link
                href="/disclaimer"
                className="mt-2 inline-block text-sm text-gold-bright hover:underline"
              >
                Read the disclaimer →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
