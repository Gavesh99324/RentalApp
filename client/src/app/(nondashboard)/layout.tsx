import { NAVBAR_HEIGHT } from "@/lib/constants";
import React from "react";
import Navbar from "@/components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`h-full flex w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
