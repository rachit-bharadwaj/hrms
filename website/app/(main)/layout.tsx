import { Sidebar } from "@/components/common";
import { ReactNode } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-[72px]">
        {children}
      </main>
    </div>
  );
}
