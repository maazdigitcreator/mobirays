import React from "react";
import DashboardSidebar from "./DashboardSidebar";

const DashboardPageLayout = ({ children }) => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12">
      <DashboardSidebar />

      <div className="w-full lg:col-span-9 px-0 sm:px-2 pb-15 border-b-2 border-[#0580A5]">
        {children}
      </div>
    </div>
  );
};

export default DashboardPageLayout;
