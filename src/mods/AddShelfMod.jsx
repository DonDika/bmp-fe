import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";

const AddShelfMod = ({ onClose, onShelfAdded }) => {
  const token = Cookies.get("token");

  const [shelfInfo, setShelfInfo] = useState({
    position: "",
    location: "",
    stock_qty: 0,
    item_id: "",
    warehouse_id: "",
  });

  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [warehouseRes, itemRes] = await Promise.all([
          axios.get("http://localhost:5001/api/warehouse/all", { headers }),
          axios.get("http://localhost:5001/api/item/all", { headers }),
        ]);

        if (warehouseRes.data.success) {
          setWarehouses(warehouseRes.data.data);
        } else {
          setError("Gagal mengambil data warehouse.");
        }

        if (itemRes.data.success) {
          setItems(itemRes.data.data);
        } else {
          setError("Gagal mengambil data item.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Terjadi kesalahan saat mengambil data.");
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShelfInfo((prev) => ({
      ...prev,
      [name]: name === "stock_qty" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (
      !shelfInfo.position ||
      !shelfInfo.location ||
      !shelfInfo.stock_qty ||
      !shelfInfo.item_id ||
      !shelfInfo.warehouse_id
    ) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/shelf",
        shelfInfo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onShelfAdded?.();
        onClose();
      } else {
        setError("Gagal menambahkan shelf.");
      }
    } catch (err) {
      console.error("Error creating shelf:", err);
      setError("Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "white",
      borderColor: state.isFocused ? "#ef4444" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(239, 68, 68, 0.3)" : "none",
      padding: "2px 4px",
      borderRadius: "0.5rem",
      transition: "all 0.2s ease-in-out",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#ef4444"
        : state.isFocused
        ? "#fca5a5"
        : "white",
      color: state.isSelected || state.isFocused ? "white" : "black",
      padding: "10px",
      fontSize: "0.875rem",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      zIndex: 50,
    }),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Shelf</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Warehouse</label>
            <Select
              options={warehouses.map((wh) => ({
                value: wh.id,
                label: wh.name,
              }))}
              value={
                shelfInfo.warehouse_id
                  ? {
                      value: shelfInfo.warehouse_id,
                      label: warehouses.find((w) => w.id === shelfInfo.warehouse_id)?.name,
                    }
                  : null
              }
              onChange={(selected) =>
                setShelfInfo((prev) => ({
                  ...prev,
                  warehouse_id: selected?.value || "",
                }))
              }
              placeholder="-- Pilih Warehouse --"
              styles={selectStyles}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Item</label>
            <Select
              options={items.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={
                shelfInfo.item_id
                  ? {
                      value: shelfInfo.item_id,
                      label: items.find((i) => i.id === shelfInfo.item_id)?.name,
                    }
                  : null
              }
              onChange={(selected) =>
                setShelfInfo((prev) => ({
                  ...prev,
                  item_id: selected?.value || "",
                }))
              }
              placeholder="-- Pilih Item --"
              styles={selectStyles}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={shelfInfo.position}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Masukkan Posisi"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Lokasi</label>
            <input
              type="text"
              name="location"
              value={shelfInfo.location}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Masukkan Lokasi"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stock_qty"
              value={shelfInfo.stock_qty}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Masukkan jumlah stok"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Tambahkan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShelfMod;