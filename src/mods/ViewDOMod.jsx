import React, { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import dayjs from "dayjs";

const ViewDOMod = ({ onClose, id, token }) => {
  const [purchaseData, setPurchaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPDF = async () => {
  try {
    console.log("getPDF dipanggil");

    const res = await axios.get(`http://localhost:5001/api/download-pdf/material-request/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // wajib untuk file!
    });

    // Buat file blob dari response
    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Buat <a> tag untuk download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Material_Request_${no_mr}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Bersihkan DOM
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Gagal mendownload PDF:", err);
  }
};

  useEffect(() => {
    const fetchMaterialRequest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/material-request/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setPurchaseData(res.data.data);
        } else {
          setError("Gagal memuat data.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchMaterialRequest();
    }
  }, [id, token]);

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!purchaseData) return null;

  const {
    no_mr,
    remarks,
    status,
    created_at,
    location,
    user,
    items = [],
  } = purchaseData;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detail Material Purchase Request</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "No Material Request", value: no_mr },
            { label: "Created By", value: user?.email },
            { label: "Status", value: status },
            { label: "Created At", value: dayjs(created_at).format("DD-MM-YYYY") },
            { label: "Location", value: location?.name },
            { label: "Remarks", value: remarks },
          ].map(({ label, value }, idx) => (
            <div key={idx}>
              <label className="block font-medium mb-1">{label}</label>
              <input
                type="text"
                value={value ?? "-"}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Item Details</h3>
        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-4 mb-4 border p-3 rounded-md bg-gray-50"
              >
                {[
                  { label: "Item Name", value: item.item?.name },
                  { label: "Quantity", value: item.quantity },
                  { label: "Duration", value: item.duration },
                  { label: "Status", value: item.status },
                ].map(({ label, value }, idx) => (
                  <div key={idx}>
                    <label className="block font-medium mb-1">{label}</label>
                    <input
                      type="text"
                      value={value ?? "-"}
                      readOnly
                      className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
                    />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada item.</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={getPDF}
            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDOMod;