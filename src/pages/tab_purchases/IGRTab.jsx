import React, { useState, useEffect } from "react";
import Pagination from "../../components/organisms/Pagination";
import usePagination from "../../hooks/usePagination";
import IGRSTable from "../../components/organisms/IGRSTable";
import axios from "axios";
import Cookies from "js-cookie";
import EditIGRMod from "../../mods/EditIGRMod"
import ViewIGRMod from "../../mods/ViewIGRMod"
// import useMod from "../../hooks/useMod";

const IGRTab = () => {
  // const modController = useMod();
  const [receipts, setReceipts] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [editReceipt, setEditReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchReceipts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/incoming-good-receipt/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched receipts:", res.data.data);
      if (res.data.success) {
        setReceipts(res.data.data);
      } else {
        setError("Gagal mengambil data receipt");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data receipt");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowViewModal(true);
  }; 

  const handleEditReceipt = (receipt) => {
    setEditReceipt(receipt); 
  };

  const handleReceiptUpdated = () => {
    fetchReceipts();
    setEditReceipt(null);
  };

  const handleReceiptAdded = () => {
      fetchReceipts();
    };
    
  
  useEffect(() => {
    if (token) {
      fetchReceipts();
    } else {
      setError("Token tidak ditemukan, silakan login ulang.");
      setLoading(false);
    }
  }, [token]);


  const {
    currentPage,
    currentItems: currentIGRs,
    totalPages,
    handlePageChange,
    indexOfFirstItem,
  } = usePagination(receipts, 10);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {/* <div className="w-full flex justify-end">
        <div className="w-60">
          <Button type="button" onClick={() => handleOpenModal("addIncomingGoodReceipt")}>Tambah IGR</Button>
        </div>
      </div> */}

      {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <IGRSTable 
              igrs={currentIGRs} 
              indexOfFirstItem={indexOfFirstItem} 
              onEditReceipt={handleEditReceipt}
              onViewReceipt={handleViewReceipt}
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

        {editReceipt && (
          <EditIGRMod
            receipt={editReceipt}
            onClose={() => setEditReceipt(null)}
            onReceiptUpdated={handleReceiptUpdated}
          />
        )}

        {showViewModal && (
          <ViewIGRMod 
            onClose={() => setShowViewModal(false)}
            id={selectedReceipt?.id}
            token={token}
          />
        )}
    </div>
  );
};

export default IGRTab;