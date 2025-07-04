import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";

const EditItemMod = ({ onClose, item, onItemUpdated }) => {
  const [itemInfo, setitemInfo] = useState({
    name: "",
    code: "",
    part_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (item) {
      setitemInfo({
        name: item.name,
        code: item.code,
        part_number: item.part_number,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setitemInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!itemInfo.name || !itemInfo.code || !itemInfo.part_number) {
      setError("Semua data harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/item/${item.id}`,
        {
          name: itemInfo.name,
          code: itemInfo.code,
          part_number: itemInfo.part_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (onItemUpdated) {
          onItemUpdated();
        }
        onClose();
      } else {
        setError("Gagal mengupdate item.");
      }
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Item</h2>
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
                value={itemInfo.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Masukkan nama"
              />
            </div>
  
            {/* Code */}
            <div className="relative">
              <label className="block font-medium mb-1">Code</label>
              <input
                type="text"
                name="code"
                value={itemInfo.code}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md pr-10"
                placeholder="Masukkan kode"
              />
            </div>
  
            {/* Part Number */}
            <div>
              <label className="block font-medium mb-1">Part Number</label>
              <input
                type="text"
                name="part_number"
                value={itemInfo.part_number}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md pr-10"
                placeholder="Masukkan Nomor Part"
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

export default EditItemMod;