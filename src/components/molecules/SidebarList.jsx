import {
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaMapMarkerAlt,
  FaBox,
  FaBuilding,
} from "react-icons/fa";
import SidebarItem from "../atoms/SidebarItem";

const items = [
  // { icon: FaHome, label: "Dashboard", key: "dashboard" },
  { icon: FaUser, label: "Users", key: "dashboard/users" },
  { icon: FaBox, label: "Items", key: "dashboard/items" },
  { icon: FaBuilding, label: "Warehouses", key: "dashboard/warehouses" },
  { icon: FaMapMarkerAlt, label: "Locations", key: "dashboard/locations" },
  { icon: FaBox, label: "Purchases", key: "dashboard/purchases" },
  { icon: FaBox, label: "SLEP", key: "dashboard/slep" },
  { icon: FaCog, label: "Settings", key: "settings" },
  { icon: FaSignOutAlt, label: "Logout", key: "logout" },
];

const SidebarList = ({ activeKey, collapsed }) => (
  <div className="space-y-2">
    {items.map((item) => (
      <SidebarItem
        key={item.key}
        icon={item.icon}
        label={item.label}
        active={
          activeKey === item.key ||
          (item.label !== "Dashboard" && activeKey.startsWith(item.key + "/"))
        }
        to={`/${item.key}`}
        collapsed={collapsed}
      />
    ))}
  </div>
);

export default SidebarList;
