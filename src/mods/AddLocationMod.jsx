import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";

const AddLocationMod = ({ onClose, onLocationAdded }) => {
  const [locationInfo, setlocationInfo] = useState({
    name: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setlocationInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Validasi input sederhana
    if (!locationInfo.name) {
      setError("lokasi field harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/location`,
        {
          name: locationInfo.name,
          code: locationInfo.code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (onLocationAdded) {
          onLocationAdded(); // Refresh data di halaman locationsPage
        }
        onClose(); // Tutup modal
      } else {
        setError("Gagal menambahkan location.");
      }
    } catch (err) {
      console.error("Error creating location:", err);
      setError("Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah lokasi</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* name */}
          <div>
            <label className="block font-medium mb-1">Nama Lokasi</label>
            <input
              type="name"
              name="name"
              value={locationInfo.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Masukkan nama lokasi"
            />
          </div>

          {/* code */}
          <div className="relative">
            <label className="block font-medium mb-1">code</label>
            <input
              type="text"
              name="code"
              value={locationInfo.code}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md pr-10"
              placeholder="Masukkan code"
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

export default AddLocationMod;
