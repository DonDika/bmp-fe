import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";

const AddMPRMod = ({ onClose, onPurchaseAdded }) => {
  const [purchaseInfo, setPurchaseInfo] = useState({
    location_id: "",
    created_by: "",
    remarks: "",
    items: [
      {
        item_id: "",
        quantity: 0,
        duration: 0,
      },
    ],
  });

  const [itemsData, setItemsData] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, locationsRes] = await Promise.all([
          axios.get("http://localhost:5001/api/item/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5001/api/location/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (itemsRes.data.success) {
          setItemsData(itemsRes.data.data);
        }

        if (locationsRes.data.success) {
          setLocationOptions(
            locationsRes.data.data.map((loc) => ({
              value: loc.id,
              label: loc.name,  // Hanya menampilkan nama lokasi
            }))
          );
        }
      } catch (err) {
        console.error("Fetch data error:", err);
        setError("Terjadi kesalahan saat mengambil data.");
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
      const rawData = localStorage.getItem("claim");
  
      if (rawData) {
        try {
          const parsedData = JSON.parse(rawData.replace("claim ", ""));
          const id = parsedData.id;
          const email = parsedData.email;
  
          setPurchaseInfo((prev) => ({
            ...prev,
            created_by: id,
          }));
          setUserEmail(email);
        } catch (error) {
          console.error("Gagal parsing data user:", error);
        }
      }
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...purchaseInfo.items];
    newItems[index][field] =
      field === "quantity" || field === "duration" ? Number(value) : value;
    setPurchaseInfo((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setPurchaseInfo((prev) => ({
      ...prev,
      items: [...prev.items, { item_id: "", quantity: 0, duration: 0 }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = [...purchaseInfo.items];
    updatedItems.splice(index, 1);
    setPurchaseInfo((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const { location_id, created_by, remarks, items } = purchaseInfo;
    if (!location_id || !created_by || !remarks || items.length === 0) {
      setError("Semua data harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/material-request",
        purchaseInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        onPurchaseAdded?.();
        onClose();
      } else {
        setError("Gagal menambahkan material request.");
      }
    } catch (err) {
      console.error("Error creating purchase:", err);
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
      zIndex: 50,
    }),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Material Request</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-1">Location</label>
            <Select
              options={locationOptions}
              value={locationOptions.find(
                (opt) => opt.value === purchaseInfo.location_id
              )}
              onChange={(selected) =>
                setPurchaseInfo((prev) => ({
                  ...prev,
                  location_id: selected?.value || "",
                }))
              }
              styles={selectStyles}
              placeholder="-- Pilih Lokasi --"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Created By</label>
            <input 
              type="text" 
              value={userEmail} 
              disabled 
              className="w-full p-2 border border-gray-300 rounded-md" 
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

          {/* Item List */}
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
                        label: i.name,  // Hanya menampilkan nama item
                      }))}
                      value={
                        item.item_id
                          ? {
                              value: item.item_id,
                              label: itemsData.find((i) => i.id === item.item_id)?.name || "",
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
                    <label className="block text-sm font-medium mb-1">
                      Quantity
                    </label>
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

            <button
              onClick={addItem}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              + Tambah Item
            </button>
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

export default AddMPRMod;