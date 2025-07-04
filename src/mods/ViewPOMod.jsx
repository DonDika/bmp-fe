import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";

const ViewPOMod = ({ onClose, id, token }) => {
  const [POData, setPOData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [currentUserClaim, setCurrentUserClaim] = useState(null);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const claimData = localStorage.getItem("claim");
    if (claimData) {
      try {
        const parsedClaim = JSON.parse(claimData);
        setCurrentUserClaim(parsedClaim);
        console.log("Current user claim:", parsedClaim);
      } catch (error) {
        console.error("Error parsing claim data:", error);
      }
    }
  }, []);

  const fetchPORequest = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/purchase-order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setPOData(res.data.data);
      } else {
        setError("Gagal memuat data PO.");
      }
    } catch (err) {
      console.error("Fetch PO error:", err);
      setError("Terjadi kesalahan saat mengambil data PO.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalList = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/purchase-order/${id}/approval/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setApprovalHistory(res.data.data.approvals);
      } else {
        setError("Gagal memuat data approval.");
      }
    } catch (err) {
      console.error("Fetch approval error:", err);
      setError("Terjadi kesalahan saat mengambil data approval.");
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchPORequest();
      fetchApprovalList();
    }
  }, [id, token]);

  const userApprove = async () => {
    if (isApproving) return;

    try {
      setIsApproving(true);
      const cookieToken = Cookies.get("token");
      if (!cookieToken) {
        alert("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      if (!currentUserClaim || currentUserClaim.role !== "admin") {
        alert("Hanya admin yang dapat melakukan approval.");
        return;
      }

      const userAlreadyApproved = approvalHistory.some(
        (approval) => approval.user_id === currentUserClaim.id
      );

      if (userAlreadyApproved) {
        alert("Anda sudah melakukan approval untuk Purchase Order ini.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/purchase-order/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${cookieToken}` },
        }
      );

      if (res.data.success) {
        alert("Approval berhasil!");
        await fetchApprovalList();
      } else {
        alert("Approval gagal: " + (res.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saat approve:", error);
      alert("Terjadi kesalahan saat approval: " + (error.response?.data?.message || error.message));
    } finally {
      setIsApproving(false);
    }
  };

  const getApprovalDisplayData = (index) => {
    if (index < approvalHistory.length) {
      return {
        email: approvalHistory[index].email,
        isApproved: true,
      };
    }
    return {
      email: "",
      isApproved: false,
    };
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!POData) return null;

  const { no_po, status, created_at, user, material_requests = [], items = [] } = POData;

  const itemsWithTotalPrice = items.map((item) => {
    const price = Number(item.price ?? 0);
    const quantity = Number(item.quantity ?? 0);
    return {
      ...item,
      totalPrice: price * quantity,
    };
  });

  const grandTotal = itemsWithTotalPrice.reduce((sum, item) => sum + item.totalPrice, 0);

  const approvalSlots = 4;
  const userAlreadyApproved = approvalHistory.some(
    (approval) => approval.user_id === currentUserClaim?.id
  );
  const canApprove =
    currentUserClaim?.role === "admin" && !userAlreadyApproved && approvalHistory.length < approvalSlots;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detail Purchase Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-bold">
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">No Purchase Order</label>
              <input
                type="text"
                value={no_po}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Status</label>
              <input
                type="text"
                value={status}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">Created By</label>
              <input
                type="text"
                value={user?.email}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Created At</label>
              <input
                type="text"
                value={dayjs(created_at).format("DD-MM-YYYY")}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1">No Material Request</label>
              <textarea
                value={material_requests.map((mr) => mr.no_mr).join("\n")}
                readOnly
                rows={4}
                className="w-full bg-gray-100 border border-gray-300 p-2 rounded-md resize-none whitespace-pre-line"
              />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Item Details</h3>
        <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
          {itemsWithTotalPrice.length > 0 ? (
            itemsWithTotalPrice.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-lg bg-gray-50"
              >
                {[
                  { label: "Supplier", value: item.supplier },
                  { label: "Quantity", value: item.quantity },
                  { label: "Status", value: item.status },
                  { label: "Material Request Item", value: item.material_request_item.item.name },
                  {
                    label: "Price",
                    value: item.price.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }),
                  },
                  {
                    label: "Total Price",
                    value: item.totalPrice.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }),
                  },
                ].map(({ label, value }, idx) => (
                  <div key={idx}>
                    <label className="text-sm font-semibold mb-1 block">{label}</label>
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
          <div className="text-lg font-semibold">
            Grand Total:{" "}
            <span className="text-red-600">
              {grandTotal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          Approvals ({approvalHistory.length}/{approvalSlots})
        </h3>
        <div className="space-y-4">
          {Array.from({ length: approvalSlots }).map((_, index) => {
            const approvalData = getApprovalDisplayData(index);
            const canEdit = canApprove && index === approvalHistory.length;

            return (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  readOnly={!canEdit}
                  value={approvalData.email}
                  placeholder={`Approval ke-${index + 1}`}
                  className={`flex-grow border rounded-md p-2 ${
                    canEdit ? "border-red-500" : "bg-gray-100 border-gray-300"
                  }`}
                />
                <button
                  onClick={userApprove}
                  disabled={!canEdit || isApproving}
                  className={`px-4 py-2 rounded-md text-white ${
                    canEdit
                      ? isApproving
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isApproving && canEdit ? "Processing..." : "Approve"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewPOMod;