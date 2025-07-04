import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";

const EditMPRMod = ({ purchase, onClose, onPurchaseUpdated }) => {
  const [purchaseInfo, setPurchaseInfo] = useState({
    remarks: "",
    items: [],
    location: null,
    user: null,
  });

  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsRes = await axios.get("http://localhost:5001/api/item/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (itemsRes.data.success) setItemsData(itemsRes.data.data);
      } catch (err) {
        console.error("Fetch items error:", err);
        setError("Terjadi kesalahan saat mengambil data item.");
      }
    };
    fetchItems();
  }, [token]);

  useEffect(() => {
    const fetchMaterialRequestDetail = async () => {
      if (!purchase?.id) return;
      try {
        const res = await axios.get(
          `http://localhost:5001/api/material-request/${purchase.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          console.log("data mr", data);
          
          setPurchaseInfo({
            remarks: data.remarks || "",
            items: data.items?.map((item) => ({
              item_id: item.item.id,
              quantity: item.quantity,
              duration: item.duration,
            })) || [],
            location: data.location || null,
            user: data.user || null,
          });
        } else {
          setError("Gagal mengambil detail permintaan material.");
        }
      } catch (err) {
        console.error("Error fetching material request detail:", err);
        setError("Terjadi kesalahan saat mengambil data permintaan material.");
      }
    };

    fetchMaterialRequestDetail();
  }, [purchase?.id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...purchaseInfo.items];
    updatedItems[index][field] =
      field === "quantity" || field === "duration" ? Number(value) : value;
    setPurchaseInfo((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index) => {
    const updatedItems = [...purchaseInfo.items];
    updatedItems.splice(index, 1);
    setPurchaseInfo((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!purchaseInfo.remarks || purchaseInfo.items.length === 0) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    const payload = {
      remarks: purchaseInfo.remarks,
      items: purchaseInfo.items,
      location_id: purchaseInfo.location?.id,
      created_by: purchaseInfo.user?.id,
    };

    try {
      const response = await axios.put(
        `http://localhost:5001/api/material-request/${purchase.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        onPurchaseUpdated?.();
        onClose();
      } else {
        setError("Gagal mengupdate permintaan material.");
      }
    } catch (err) {
      console.error("Error updating material request:", err);
      setError("Terjadi kesalahan saat memperbarui data.");
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
      zIndex: 50,
    }),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Material Request</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              value={purchaseInfo.location?.name || ""}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Created By</label>
            <input
              type="text"
              value={purchaseInfo.user?.email || ""}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Remarks</label>
            <input
              type="text"
              name="remarks"
              value={purchaseInfo.remarks}
              onChange={handleChange}
              placeholder="Masukkan Catatan"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Daftar Item</label>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {purchaseInfo.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 p-4 rounded-md bg-gray-50 space-y-2 relative"
                >
                  <button
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>

                  <div>
                    <label className="block text-sm font-medium mb-1">Item</label>
                    <Select
                      options={itemsData.map((i) => ({
                        value: i.id,
                        label: i.name,
                      }))}
                      value={
                        item.item_id
                          ? {
                              value: item.item_id,
                              label:
                                itemsData.find((i) => i.id === item.item_id)
                                  ?.name,
                            }
                          : null
                      }
                      onChange={(selected) =>
                        handleItemChange(index, "item_id", selected?.value || "")
                      }
                      placeholder="-- Pilih Item --"
                      styles={selectStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Masukkan jumlah"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={item.duration}
                      onChange={(e) =>
                        handleItemChange(index, "duration", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Durasi (hari)"
                    />
                  </div>
                </div>
              ))}
            </div>
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
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMPRMod;