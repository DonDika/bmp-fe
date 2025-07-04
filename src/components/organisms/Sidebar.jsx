import SidebarList from "../molecules/SidebarList";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getSidebarState, setSidebarState } from "../../utils/localStorage";

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeKeyFromLocation, setActiveKeyFromLocation] = useState("");

  useEffect(() => {
    const saved = getSidebarState();
    setCollapsed(saved);
    onToggle(saved);

    // Ambil path saat ini secara manual
    const path = window.location.pathname.slice(1);
    setActiveKeyFromLocation(path);
  }, [onToggle]);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const newState = !prev;
      setSidebarState(newState);
      onToggle(newState);
      return newState;
    });
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-white shadow-lg p-4 transition-all duration-300 fixed top-0 left-0 z-10`}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <div className="text-2xl font-bold text-red-500">BMP E-PROC</div>
        )}
        <button onClick={toggleSidebar}>
          <FaBars className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <SidebarList activeKey={activeKeyFromLocation} collapsed={collapsed} />
    </aside>
  );
};

export default Sidebar;
