import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const EditLocationMod = ({ onClose, location, onLocationUpdated }) => {
  const [locationInfo, setlocationInfo] = useState({
    name: "",
    // code: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location) {
      setlocationInfo({
        name: location.name,
        // code: location.code,
      });
    }
  }, [location]);

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

    if (!locationInfo.name) {
      setError("Nama lokasi harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/location/${location.id}`,
        {
          name: locationInfo.name,
          // code: locationInfo.code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (onLocationUpdated) {
          onLocationUpdated();
        }
        onClose();
      } else {
        setError("Gagal mengupdate location.");
      }
    } catch (err) {
      console.error("Error updating location:", err);
      setError("Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit location</h2>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Nama Lokasi</label>
            <input
              type="text"
              name="name"
              value={locationInfo.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Masukkan Nama Lokasi"
            />
          </div>

          {/* <div className="relative">
            <label className="block font-medium mb-1">Code</label>
            <input
              type="text"
              name="code"
              value={locationInfo.code}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md pr-10"
              placeholder="Kosongkan jika tidak ingin mengubah code"
            />
          </div> */}
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLocationMod;