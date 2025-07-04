import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const ViewIGRMod = ({ onClose, id, token }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/incoming-good-receipt/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setData(res.data.data);
          console.log("data view igr", res.data.data);
          
        } else {
          setError("Gagal memuat data.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchData();
  }, [id, token]);

  const handleStatusChange = async (itemId) => {
    try {
      setUpdatingStatus(true);
      await axios.patch(
        `http://localhost:5001/api/incoming-good-receipt/${itemId}/status`,
        { status: "received" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh data setelah update
      const res = await axios.get(`http://localhost:5001/api/incoming-good-receipt/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal update status item.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data || !data.purchase_order) return <div className="p-4">Data tidak ditemukan.</div>;

  const { no_po } = data.purchase_order;
  const { no_igr } = data;
  const items = data.items || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detail Incoming Good Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">No Incoming Goods Receipt</label>
          <input
            type="text"
            value={no_igr}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">No Purchase Order</label>
          <input
            type="text"
            value={no_po}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
          />
        </div>

        <h3 className="text-lg font-semibold mb-3">Item</h3>
        {items.map((item, index) => (
          <div key={index} className="space-y-3 mb-6 border p-4 rounded-md bg-gray-50">
            <div>
              <label className="block font-medium mb-1">Item Name</label>
              <input
                type="text"
                value={item.item?.name || "-"}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Quantity</label>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Status</label>
              <input
                type="text"
                value={item.status}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Created At</label>
              <input
                type="text"
                value={dayjs(item.created_at).format("DD-MM-YYYY")}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                disabled={item.status === "received" || updatingStatus}
                checked={item.status === "received"}
                onChange={() => handleStatusChange(item.id)}
              />
              <label className="text-sm">Tandai sebagai Received</label>
            </div>
          </div>
        ))}

        <h3 className="text-lg font-semibold mb-3">Shelf</h3>
        {items.map((shelf, index) => (
          <div key={index} className="space-y-3 mb-6 border p-4 rounded-md bg-gray-50">
            <div>
              <label className="block font-medium mb-1">Location</label>
              <input
                type="text"
                value={shelf.shelf?.location}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Position</label>
              <input
                type="text"
                value={shelf.shelf?.position}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
          </div>
          ))}
        </div>
    </div>
  );
};

export default ViewIGRMod;