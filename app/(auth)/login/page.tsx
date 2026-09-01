import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign In — UT Autos",
  description: "Sign in to your UT Autos account to manage your garage and bookings.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your garage and bookings.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-muted">
          New to UT Autos?{" "}
          <Link href="/signup" className="text-gold-bright hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
