import React, { useState } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import Button from "../components/atoms/Button";
import SlepTable from "../components/organisms/SlepTable";
import useMod from "../hooks/useMod";
import AddSlepMod from "../mods/AddSlepMod";
import AddItemSlepMod from "../mods/AddItemSlepMod";


const SlepPage = () => {
  const modController = useMod();
  const [slepTabs, setSlepTabs] = useState([
    {
      id: 1,
      name: "Project 1",
      location: "Jakarta",
      type: "H - NQ Core Drilling (H:200 , N:300)",
      rig_no: "BMP250 New",
      updated_at: "2023-01-01",
      job_no: "123456",
      table: [
        {
          id: 1,
          part_book_id: "PB-001",
          slep_detail: [
            {
              description: "Bolt Screw",
              size: "M8",
              part_no: "123-ABC",
              unit: "Pcs",
              qty_std: 10,
              bsd_qty: 3,
              bsd_pos: "A1",
              sbw_qty: 4,
              sbw_pos: "B2",
              mnd_qty: 3,
              mnd_pos: "C3",
              total_stock: 10,
              condition: "Good",
              mpr: 5,
              po: 2,
              unit_price: 500,
              total_price: 5000,
              qty_total_send: 7,
            },
            {
              description: "Hex Nut",
              size: "M10",
              part_no: "456-XYZ",
              unit: "Pcs",
              qty_std: 5,
              bsd_qty: 1,
              bsd_pos: "A2",
              sbw_qty: 2,
              sbw_pos: "B3",
              mnd_qty: 2,
              mnd_pos: "C4",
              total_stock: 5,
              condition: "Fair",
              mpr: 3,
              po: 1,
              unit_price: 200,
              total_price: 1000,
              qty_total_send: 4,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Project 2",
      location: "Surabaya",
      type: "N - HQ Core Drilling (N:250 , H:150)",
      rig_no: "BMP300 New",
      updated_at: "2023-02-15",
      job_no: "789012",
      table: [
        {
          id: 1,
          part_book_id: "PB-001",
          slep_detail: [
            {
              description: "Hex Nut",
              size: "M10",
              part_no: "456-XYZ",
              unit: "Pcs",
              qty_std: 5,
              bsd_qty: 1,
              bsd_pos: "A2",
              sbw_qty: 2,
              sbw_pos: "B3",
              mnd_qty: 2,
              mnd_pos: "C4",
              total_stock: 5,
              condition: "Fair",
              mpr: 3,
              po: 1,
              unit_price: 200,
              total_price: 1000,
              qty_total_send: 4,
            },
          ],
        },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState(null);
  const activeData = slepTabs.find((item) => item.id === activeTab);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const handleAddSlep = (newProject) => {
    setSlepTabs((prev) => [...prev, newProject]);
    setActiveTab(newProject.id); // aktifkan langsung tab yang baru
    handleCloseModal("addSlep");
  };

  const handleAddItemSlep = (newItem) => {
    setSlepTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTab) {
          const updatedTable = [...tab.table];
          if (updatedTable.length > 0) {
            const slepDetail = [...updatedTable[0].slep_detail, newItem];
            updatedTable[0] = {
              ...updatedTable[0],
              slep_detail: slepDetail,
            };
          } else {
            updatedTable.push({
              id: Date.now(),
              part_book_id: "PB-AUTO",
              slep_detail: [newItem],
            });
          }

          return { ...tab, table: updatedTable };
        }
        return tab;
      })
    );

    handleCloseModal("addItemSlep");
  };

  return (
    <DashboardTemplate>
      <div className="w-full h-full flex flex-col gap-5 bg-gray-50">
        <p className="text-3xl font-semibold">Management SLEP</p>

        <div className="w-full flex justify-end">
          <div className="w-60">
            <Button type="button" onClick={() => handleOpenModal("addSlep")}>
              Tambah SLEP
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {slepTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab.id
                  ? "bg-red-500 text-white"
                  : "border text-red-500 hover:bg-red-100"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {activeData && (
          <div className="w-full h-full flex flex-col gap-5 p-4 border rounded-lg shadow-md animate-fade-in">
            <p className="text-xl font-semibold text-center uppercase">
              Standart List of Equipment Project
            </p>

            <div className="w-full flex items-center justify-end">
              <div className="w-60">
                <Button
                  type="button"
                  onClick={() => handleOpenModal("addItemSlep")}
                >
                  Tambah Item Slep
                </Button>
              </div>
            </div>

            <div className="w-full flex justify-between gap-4">
              <ul className="space-y-1 text-base font-medium">
                <li>
                  Project:{" "}
                  <span className="font-normal">{activeData.name}</span>
                </li>
                <li>
                  Location:{" "}
                  <span className="font-normal">{activeData.location}</span>
                </li>
                <li>
                  Type: <span className="font-normal">{activeData.type}</span>
                </li>
              </ul>
              <ul className="space-y-1 text-base font-medium">
                <li>
                  Rig No.:{" "}
                  <span className="font-normal">{activeData.rig_no}</span>
                </li>
                <li>
                  Updated:{" "}
                  <span className="font-normal">{activeData.updated_at}</span>
                </li>
                <li>
                  Job No.:{" "}
                  <span className="font-normal">{activeData.job_no}</span>
                </li>
              </ul>
            </div>

            <SlepTable items={activeData.table} />
          </div>
        )}

        {isOpen("addSlep") && (
          <AddSlepMod
            onClose={() => handleCloseModal("addSlep")}
            onCreated={handleAddSlep}
          />
        )}
        {isOpen("addItemSlep") && (
          <AddItemSlepMod
            onClose={() => handleCloseModal("addItemSlep")}
            onCreated={handleAddItemSlep}
          />
        )}
      </div>
    </DashboardTemplate>
  );
};

export default SlepPage;
