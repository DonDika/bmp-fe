import React, { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";
import Select from "react-select";

const AddDOMod = ({ onClose, onDeliveryAdded }) => {
    const [poInfo, setPoInfo] = useState({
        remarks: "",
        material_requests: [
            {
            material_request_id: "",
            items: [{ material_request_item_id: "", quantity: 0 }],
            }
        ],
    });

  const [materialRequestOptions, setMaterialRequestOptions] = useState([]);
  const [materialRequestItemsMap, setMaterialRequestItemsMap] = useState({});
  // const [userOptions, setUserOptions] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mrRes, userRes] = await Promise.all([
          axios.get("${import.meta.env.VITE_API_URL}/material-request/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // axios.get("${import.meta.env.VITE_API_URL}/user/all", {
          //   headers: { Authorization: `Bearer ${token}` },
          // }),
        ]);

        if (mrRes.data.success) {
          const options = mrRes.data.data.map((mr) => ({
            value: mr.id,
            label: mr.no_mr,
          }));
          setMaterialRequestOptions(options);
        }

        // if (userRes.data.success) {
        //   const options = userRes.data.data.map((user) => ({
        //     value: user.id,
        //     label: user.name,
        //   }));
        //   setUserOptions(options);
        // }
      } catch (err) {
        console.error("Fetch data error:", err);
        setError("Gagal mengambil data.");
      } finally {
        setLoading(false);
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

        setPoInfo((prev) => ({
          ...prev,
        }));
      } catch (error) {
        console.error("Gagal parsing data user:", error);
      }
    }
  }, []);

  const fetchMaterialRequestItems = async (materialRequestId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/material-request/${materialRequestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.data.success && response.data.data.items) {
        // Filter hanya item dengan status "pending"
        const pendingItems = response.data.data.items.filter(item => item.status === "pending" || item.status === "requested" || item.status === "proses");
        
        return pendingItems.map(item => ({
          value: item.id,
          label: item.item.name,
          originalItem: item
        }));
      }
      return [];
    } catch (err) {
      console.error("Error fetching material request items:", err);
      return [];
    }
  };

  const handleMaterialRequestChange = async (mrIndex, value) => {
    const updatedMaterialRequests = [...poInfo.material_requests];
    updatedMaterialRequests[mrIndex].material_request_id = value;
    
    // Fetch items for the selected material request
    if (value) {
      const items = await fetchMaterialRequestItems(value);
      console.log("Fetched items for MR:", value, items);

      
      // Update the items map for this material request
      setMaterialRequestItemsMap(prev => ({
        ...prev,
        [value]: items
      }));
      
      // Reset items to match the available items from the material request
      // Only show items that are available, don't allow adding new ones
      if (items.length > 0) {
        updatedMaterialRequests[mrIndex].items = [
          { material_request_item_id: "", quantity: 0 }
        ];
      } else {
        updatedMaterialRequests[mrIndex].items = [];
      }
    } else {
      // Reset items when no material request is selected
      updatedMaterialRequests[mrIndex].items = [
        { material_request_item_id: "", quantity: 0 }
      ];
    }
    
    setPoInfo((prev) => ({
      ...prev,
      material_requests: updatedMaterialRequests,
    }));
  };

  const handleItemChange = (mrIndex, itemIndex, field, value) => {
    const updatedMaterialRequests = [...poInfo.material_requests];
    
    updatedMaterialRequests[mrIndex].items[itemIndex][field] = 
      field === "quantity"  ? Number(value) : value;
    
    setPoInfo((prev) => ({ 
      ...prev, 
      material_requests: updatedMaterialRequests 
    }));
  };

//   const addMaterialRequest = () => {
//     setPoInfo((prev) => ({
//       ...prev,
//       material_requests: [
//         ...prev.material_requests,
//         {
//           material_request_id: "",
//           items: [{ material_request_item_id: "", quantity: 0 }],
//         },
//       ],
//     }));
//   };

  const removeMaterialRequest = (mrIndex) => {
    const updatedMaterialRequests = [...poInfo.material_requests];
    updatedMaterialRequests.splice(mrIndex, 1);
    setPoInfo((prev) => ({
      ...prev,
      material_requests: updatedMaterialRequests,
    }));
  };

  const addItem = (mrIndex) => {
    const materialRequestId = poInfo.material_requests[mrIndex].material_request_id;
    const availableItems = materialRequestItemsMap[materialRequestId] || [];
    
    // Only allow adding items if there are available items and not all are used
    const usedItemIds = poInfo.material_requests[mrIndex].items
      .map(item => item.material_request_item_id)
      .filter(id => id);
    
    const remainingItems = availableItems.filter(item => !usedItemIds.includes(item.value));
    
    if (remainingItems.length > 0) {
      const updatedMaterialRequests = [...poInfo.material_requests];
      updatedMaterialRequests[mrIndex].items.push({
        material_request_item_id: "",
        quantity: 0,
      });
      
      setPoInfo((prev) => ({
        ...prev,
        material_requests: updatedMaterialRequests,
      }));
    }
  };

  const removeItem = (mrIndex, itemIndex) => {
    const updatedMaterialRequests = [...poInfo.material_requests];
    updatedMaterialRequests[mrIndex].items.splice(itemIndex, 1);
    setPoInfo((prev) => ({
      ...prev,
      material_requests: updatedMaterialRequests,
    }));
  };

//   const prepareDataForSubmit = () => {
//     const material_request_ids = poInfo.material_requests
//       .map(mr => mr.material_request_id)
//       .filter(id => id);
    
//     const items = poInfo.material_requests.flatMap(mr => 
//       mr.items
//         .filter(item => item.material_request_item_id) // Only include items with ID
//         .map(item => ({
//           material_request_item_id: item.material_request_item_id,
//           quantity: item.quantity,
//         }))
//     );

//     return {
//         remarks: poInfo.remarks,
//         material_request_ids,
//         items
//     };
//   };


    const prepareDataForSubmit = () => {
    const material_request_id = poInfo.material_requests[0]?.material_request_id;

    const items = poInfo.material_requests[0]?.items
        .filter(item => item.material_request_item_id)
        .map(item => ({
        material_request_item_id: item.material_request_item_id,
        quantity: item.quantity,
        })) || [];

        return {
          remarks: poInfo.remarks,
          material_request_id,
          items
        };
    };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const dataToSubmit = prepareDataForSubmit();
    
    if (dataToSubmit.material_request_id.length === 0 || dataToSubmit.items.length === 0) {
      setError("Semua data harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/delivery-order",
        dataToSubmit,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        onDeliveryAdded?.();
        onClose();
      } else {
        setError("Gagal menambahkan Purchase Order.");
      }
    } catch (err) {
      console.error("Error creating PO:", err);
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

  const getAvailableItemOptions = (mrIndex, itemIndex) => {
    const materialRequestId = poInfo.material_requests[mrIndex].material_request_id;
    const availableItems = materialRequestItemsMap[materialRequestId] || [];
    
    // Get already selected item IDs in this material request (excluding current item)
    const usedItemIds = poInfo.material_requests[mrIndex].items
      .map((item, index) => index !== itemIndex ? item.material_request_item_id : null)
      .filter(id => id);
    
    // Return items that are not already selected (items are already filtered by "pending" status)
    return availableItems.filter(item => !usedItemIds.includes(item.value));
  };

  const canAddMoreItems = (mrIndex) => {
    const materialRequestId = poInfo.material_requests[mrIndex].material_request_id;
    if (!materialRequestId) return false;
    
    const availableItems = materialRequestItemsMap[materialRequestId] || [];
    const usedItemIds = poInfo.material_requests[mrIndex].items
      .map(item => item.material_request_item_id)
      .filter(id => id);
    
    return availableItems.length > usedItemIds.length;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Delivery Order</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">

          {/* Material Request Sections */}
          {poInfo.material_requests.map((mr, mrIndex) => (
            <div 
              key={mrIndex} 
              className="border border-gray-300 p-4 rounded-md bg-gray-50 space-y-4 relative"
            >
              {poInfo.material_requests.length > 1 && (
                <button
                  onClick={() => removeMaterialRequest(mrIndex)}
                  className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800"
                >
                  Hapus
                </button>
              )}
              
              <div>
                <label className="block font-medium mb-1">Material Request</label>
                <Select
                  options={materialRequestOptions}
                  value={materialRequestOptions.find(
                    (opt) => opt.value === mr.material_request_id
                  )}
                  onChange={(selected) => handleMaterialRequestChange(mrIndex, selected?.value || "")}
                  styles={selectStyles}
                  placeholder="-- Pilih Material Request --"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Remarks</label>
                <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Tuliskan catatan / remarks..."
                    value={poInfo.remarks}
                    onChange={(e) =>
                    setPoInfo((prev) => ({ ...prev, remarks: e.target.value }))
                    }
                ></input>
                </div>


              {/* Item List for this Material Request */}
              {mr.material_request_id && (
                <div>
                  <label className="block font-semibold mb-2">Daftar Item</label>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {mr.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="border border-gray-300 p-4 rounded-md bg-white space-y-2 relative"
                      >
                        {mr.items.length > 1 && (
                          <button
                            onClick={() => removeItem(mrIndex, itemIndex)}
                            className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Hapus
                          </button>
                        )}

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Material Request Item
                          </label>
                          <Select
                            options={getAvailableItemOptions(mrIndex, itemIndex)}
                            value={getAvailableItemOptions(mrIndex, itemIndex).find(
                              (opt) => opt.value === item.material_request_item_id
                            )}
                            onChange={(selected) =>
                              handleItemChange(
                                mrIndex,
                                itemIndex,
                                "material_request_item_id",
                                selected?.value || ""
                              )
                            }
                            styles={selectStyles}
                            placeholder="-- Pilih Item --"
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
                              handleItemChange(mrIndex, itemIndex, "quantity", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Masukkan jumlah"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {canAddMoreItems(mrIndex) && (
                    <button
                      onClick={() => addItem(mrIndex)}
                      className="text-sm text-blue-600 hover:underline mt-2"
                    >
                      + Tambah Item
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* <button
            onClick={addMaterialRequest}
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            + Tambah Material Request
          </button> */}
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

export default AddDOMod;