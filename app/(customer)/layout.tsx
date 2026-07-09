import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CustomerSubnav } from "@/components/layout/customer-subnav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CustomerSubnav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
