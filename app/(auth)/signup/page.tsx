import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignUpForm } from "./signup-form";

export const metadata = {
  title: "Create Account — UT Autos",
  description: "Create a UT Autos account to build your garage and book mobile detailing for your cars and private jets.",
  alternates: { canonical: "/signup" },
};

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Sign in once, and every car or jet you add lives in your garage.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-bright hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
