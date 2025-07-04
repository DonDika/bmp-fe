import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const AddItemSlepMod = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    description: "",
    size: "",
    part_no: "",
    unit: "",
    qty_std: 0,
    bsd_qty: 0,
    bsd_pos: "",
    sbw_qty: 0,
    sbw_pos: "",
    mnd_qty: 0,
    mnd_pos: "",
    total_stock: 0,
    condition: "",
    mpr: 0,
    po: 0,
    unit_price: 0,
    total_price: 0,
    qty_total_send: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value),
    }));
  };

  const handleSubmit = () => {
    onCreated(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-bold">Tambah Item SLEP</p>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block font-medium capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type={typeof value === "number" ? "number" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemSlepMod;
