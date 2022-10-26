import React, { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import Billboard from "../components/Billboards";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [DisplayName, setDisplayName] = useState("");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <Billboard />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
