import { Sidebar, Header } from "@/components/common";
import { ReactNode } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-[var(--sidebar-width,72px)] transition-all duration-300 ease-in-out bg-slate-50/50 min-h-screen">
        <Header />
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
