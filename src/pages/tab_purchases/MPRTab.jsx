import React, { useState, useEffect } from "react";
import Button from "../../components/atoms/Button";
import Pagination from "../../components/organisms/Pagination";
import usePagination from "../../hooks/usePagination";
import MPRSTable from "../../components/organisms/MPRSTable";
import axios from "axios";
import Cookies from "js-cookie";
import AddMPRMod from "../../mods/AddMPRMod"
import EditMPRMod from "../../mods/EditMPRMod"
import ViewMPRMod from "../../mods/ViewMPRMod";
import useMod from "../../hooks/useMod";

const MPRTab = () => {
  const modController = useMod();
  const [purchases, setPurchases] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [editPurchase, setEditPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/material-request/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched purchases:", res.data.data);
      if (res.data.success) {
        setPurchases(res.data.data);
      } else {
        setError("Gagal mengambil data purchase");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data purchase");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    setShowViewModal(true);
  }; 

  const handleEditPurchase = (purchase) => {
    setEditPurchase(purchase); 
  };

  const handlePurchaseUpdated = () => {
    fetchPurchases();
    setEditPurchase(null);
  };
  
  const handleDeletePurchase = async (purchase) => {
    const confirmDelete = confirm(`Hapus purchase ${purchase.id}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/material-request/${purchase.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.success) {
        alert("purchase berhasil dihapus");
        fetchPurchases(); // Refresh data
      } else {
        alert("Gagal menghapus purchase");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan saat hapus purchase");
    }
  };
  

  const handlePurchaseAdded = () => {
    fetchPurchases();
  };
  

  useEffect(() => {
    if (token) {
      fetchPurchases();
    } else {
      setError("Token tidak ditemukan, silakan login ulang.");
      setLoading(false);
    }
  }, [token]);

  const {
    currentPage,
    currentItems: currentPurchases,
    totalPages,
    handlePageChange,
    indexOfFirstItem,
  } = usePagination(purchases, 10);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="w-full flex justify-end">
          <div className="w-60">
            <Button type="button" onClick={() => handleOpenModal("addMaterialPurchases")}>Tambah MPR</Button>
          </div>
        </div>

      {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <MPRSTable 
              mprs={currentPurchases} 
              indexOfFirstItem={indexOfFirstItem} 
              onEditPurchase={handleEditPurchase}
              onDeletePurchase={handleDeletePurchase}
              onViewPurchase={handleViewPurchase}
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

    {isOpen("addMaterialPurchases") && (
      <AddMPRMod
        onClose={() => handleCloseModal("addMaterialPurchases")}
        onPurchaseAdded={handlePurchaseAdded}
      />
    )}

    {editPurchase && (
      <EditMPRMod
        purchase={editPurchase}
        onClose={() => setEditPurchase(null)}
        onPurchaseUpdated={handlePurchaseUpdated}
      />
    )}

    {showViewModal && (
      <ViewMPRMod 
        onClose={() => setShowViewModal(false)}
        id={selectedPurchase?.id}
        token={token}
      />
    )}
    </div>
    
  );
};

export default MPRTab;
