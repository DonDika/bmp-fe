import { useState } from "react";
import Sidebar from "../organisms/Sidebar";

const DashboardTemplate = ({ children }) => {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeKey={activeKey}
        onItemClick={setActiveKey}
        onToggle={setSidebarCollapsed}
      />
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardTemplate;
