import React from "react";
import { RiCloseLine } from "react-icons/ri";
import dayjs from "dayjs";

const ViewShelfMod = ({ onClose, shelfData }) => {
  if (!shelfData) return null;

  const { location, created_at, position, stock_qty, item = {}, warehouse = {} } = shelfData;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detail Shelf</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <label className="block font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={item.item_name || "-"}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Item Code</label>
            <input
              type="text"
              value={item.item_code || "-"}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Position</label>
            <input
              type="text"
              value={position || "-"}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              value={location || "-"}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              value={stock_qty || "-"}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Created At</label>
            <input
              type="text"
              value={dayjs(created_at).format("DD-MM-YYYY") || "-"}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewShelfMod;