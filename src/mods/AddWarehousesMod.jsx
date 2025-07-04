import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";

const AddWarehouseMod = ({ onClose, onWarehouseAdded }) => {
  const [warehouseInfo, setWarehouseInfo] = useState({
    name: "",
    location: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouseInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Validasi input sederhana
    if (!warehouseInfo.name || !warehouseInfo.location || !warehouseInfo.contact) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        "http://localhost:5001/api/warehouse",
        {
          name: warehouseInfo.name,
          location: warehouseInfo.location,
          contact: warehouseInfo.contact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (onWarehouseAdded) {
          onWarehouseAdded(); // Refresh data di halaman WarehousesPage
        }
        onClose(); // Tutup modal
      } else {
        setError("Gagal menambahkan warehouse.");
      }
    } catch (err) {
      console.error("Error creating warehouse:", err);
      setError("Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex Warehouses-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between Warehouses-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Warehouse</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={warehouseInfo.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Masukkan nama"
            />
          </div>

          {/* location */}
          <div className="relative">
            <label className="block font-medium mb-1">location</label>
            <input
              type="text"
              name="location"
              value={warehouseInfo.location}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md pr-10"
              placeholder="Masukkan Lokasi"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-medium mb-1">Contact</label>
            <input
              type="text"
              name="contact"
              value={warehouseInfo.contact}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md pr-10"
              placeholder="Masukkan Contact"
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

export default AddWarehouseMod;
