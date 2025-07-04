import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const EditPOMod = ({ purchaseData, onClose, onPurchaseUpdated }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    if (!purchaseData?.id) return;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/purchase-order/${purchaseData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success && res.data.data) {
          setStatus(res.data.data.status || "");
        } else {
          setError("Gagal mengambil data status purchase order.");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil status PO.");
      }
    };

    fetchStatus();
  }, [purchaseData?.id, token]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/purchase-order/${purchaseData.id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 && res.data.success) {
        onPurchaseUpdated?.();
        onClose();
      } else {
        setError("Gagal memperbarui status PO.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan perubahan status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Ubah Status PO</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block font-medium mb-1">Status</label>
          <input 
            type="text"
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md" 
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPOMod;