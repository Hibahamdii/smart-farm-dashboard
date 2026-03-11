import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="max-w-7xl mx-auto px-4 py-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
