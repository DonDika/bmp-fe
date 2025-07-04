// src/components/atoms/SidebarItem.jsx
import { Link } from "react-router";

const SidebarItem = ({ icon: Icon, label, active, to, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
      active ? "bg-red-100 text-red-600" : "hover:bg-gray-100 text-gray-700"
    } ${collapsed ? "justify-center" : ""}`}
  >
    <Icon className="w-5 h-5" />
    {!collapsed && <span className="ml-3 whitespace-nowrap">{label}</span>}
  </Link>
);

export default SidebarItem;
