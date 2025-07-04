import React, { useState } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import MPRTab from "./tab_purchases/MPRTab";
import POTab from "./tab_purchases/POTab";
import IGRTab from "./tab_purchases/IGRTab";
import DOTab from "./tab_purchases/DOTab";

const PurchasesPage = () => {
  const tab = [
    { id: 1, name: "Material Purchase Requisition" },
    { id: 2, name: "Purchase Order" },
    { id: 3, name: "Incoming Goods Receipt" },
    { id: 4, name: "Delivery Order" },
  ];

  const [activeTab, setActiveTab] = useState(1);

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <MPRTab />;
      case 2:
        return <POTab />;
      case 3:
        return <IGRTab />;
      case 4:
        return <DOTab />;
      default:
        return null;
    }
  };

  return (
    <DashboardTemplate>
      <div className="w-full h-full flex flex-col gap-5">
        <p className="text-3xl font-semibold">Management Purchases</p>

        <div className="w-full h-full rounded-md flex flex-col gap-4">
          <div className="flex flex-wrap gap-3 w-full">
            {tab.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  activeTab === item.id
                    ? "bg-red-500 text-white"
                    : "border text-red-500 hover:bg-red-100"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="bg-white p-4 rounded-md border w-full h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default PurchasesPage;
