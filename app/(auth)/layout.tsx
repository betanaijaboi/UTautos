import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-10">
        <Logo className="text-2xl" />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
