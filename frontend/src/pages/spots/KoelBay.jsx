import React, { useState, useEffect } from "react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Chart from "../../components/Chart";

import KoelBayTable from "../../components/tables/KoelBayTable";

function Journal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div>
              <Chart />
            </div>

            <KoelBayTable />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Journal;
