import React, { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import Pagination from "../../components/organisms/Pagination";
import usePagination from "../../hooks/usePagination";
import DOSTable from "../../components/organisms/DOSTable";
import axios from "axios";
import Cookies from "js-cookie";
import useMod from "../../hooks/useMod";
import AddDOMod from "../../mods/AddDOMod";
import ViewDOMod from "../../mods/ViewDOMod";

const DOTab = () => {
  const modController = useMod();
  const [delivery, setDelivery] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchDelivery = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/delivery-order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched delivery:", res.data.data);
      if (res.data.success) {
        setDelivery(res.data.data);
      } else {
        setError("Gagal mengambil data delivery");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data delivery");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  const handleDeliveryUpdated = () => {
    fetchDelivery();
  };

  const handleDeliveryAdded = () => {
    fetchDelivery();
  };

  useEffect(() => {
      if (token) {
        fetchDelivery();
      } else {
        setError("Token tidak ditemukan, silakan login ulang.");
        setLoading(false);
      }
  }, [token]);

  const {
    currentPage,
    currentItems: currentDOs,
    totalPages,
    handlePageChange,
    indexOfFirstItem,
  } = usePagination(delivery, 10);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="w-full flex justify-end">
        <div className="w-60">
          <Button type="button" onClick={() => handleOpenModal("addDeliveryOrder")}>Tambah DO</Button>
        </div>
      </div>

      {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <DOSTable 
              dos={currentDOs} 
              indexOfFirstItem={indexOfFirstItem} 
              onViewDelivery={handleViewDelivery}
            />
            {totalPages > 1 && (
              <div className="flex w-full justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {isOpen("addDeliveryOrder") && (
          <AddDOMod
            onClose={() => handleCloseModal("addDeliveryOrder")}
            onDeliveryAdded={handleDeliveryAdded}
          />
        )}

        {showViewModal && (
          <ViewDOMod 
            onClose={() => setShowViewModal(false)}
            id={selectedDelivery?.id}
            token={token}
          />
        )}
    </div>
  );
};

export default DOTab;