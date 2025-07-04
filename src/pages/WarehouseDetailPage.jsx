
import React, { useState, useEffect } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import Button from "../components/atoms/Button";
import Pagination from "../components/organisms/Pagination";
import usePagination from "../hooks/usePagination";
import { useParams, useNavigate } from "react-router";
import { RiArrowLeftLine } from "react-icons/ri";
import ShelfsTable from "../components/organisms/ShelfsTable";
import useMod from "../hooks/useMod";
import axios from "axios";
import Cookies from "js-cookie";
import EditShelfMod from "../mods/EditShelfMod";
import AddShelfMod from "../mods/AddShelfMod";
import ViewShelfMod from "../mods/ViewShelfMod";

const ShelfDetailPage = () => {
  const warehouseID = useParams().id;
  const navigate = useNavigate();

  const modController = useMod();
  const [shelfs, setShelfs] = useState([]);
  const [editShelfs, setEditShelfs] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchShelfs = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/shelf/warehouse/${warehouseID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched Shelf:", res.data.data);
      if (res.data.success) {
        setShelfs(res.data.data);
      } else {
        setError("Gagal mengambil data shelf");
      }
    } catch (err) {
      console.error("Error detail:", err); 
      setError("Terjadi kesalahan saat mengambil data shelf");
    } finally {
      setLoading(false);
    }
  };

  const handleViewShelf = (shelf) => {
    setSelectedShelf(shelf);
    setShowViewModal(true);
  }; 

  const handleEditShelfs = (shelf) => {
    setEditShelfs(shelf); 
  };

  const handleShelfUpdated = () => {
    fetchShelfs();
    setEditShelfs(null);
  };
  
  const handleDeleteShelf = async (shelf) => {
    const confirmDelete = confirm(`Hapus shelf ${shelf.id}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await axios.delete(`http://localhost:5001/api/shelf/${shelf.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.success) {
        alert("shelf berhasil dihapus");
        fetchShelfs(); // Refresh data
      } else {
        alert("Gagal menghapus shelf");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan saat hapus shelf");
    }
  };
  
  const handleShelfAdded = () => {
    fetchShelfs();
  };
  
  useEffect(() => {
    if (token) {
      fetchShelfs();
    } else {
      setError("Token tidak didapatkan, silakan login ulang.");
      setLoading(false);
    }
  }, [token, warehouseID]);

  const {
    currentPage,
    currentItems: currentShelfs,
    totalPages,
    handlePageChange,
    indexOfFirstItem,
  } = usePagination(shelfs, 10);

  return (
    <DashboardTemplate>
      <div className="w-full h-full flex flex-col gap-5">
        <p className="text-3xl font-semibold">
          Management Shelf in {warehouseID}
        </p>

        <div className="w-full flex items-center justify-between">
          <div
            className="w-10 h-10 p-1 rounded-full border border-black"
            onClick={() => navigate(-1)}
          >
            <RiArrowLeftLine className="w-full h-full" />
          </div>
          <div className="w-60">
            <Button type="button" onClick={() => handleOpenModal("addShelf")}>Tambah Item to shelf</Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <ShelfsTable
              shelfs={currentShelfs}
              indexOfFirstItem={indexOfFirstItem}
              onEditShelf={handleEditShelfs}
              onDeleteShelf={handleDeleteShelf}
              onViewShelf={handleViewShelf}
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
      </div>

      {isOpen("addShelf") && (
        <AddShelfMod
          onClose={() => handleCloseModal("addShelf")}
          onShelfAdded={handleShelfAdded}
        />
      )}

      {editShelfs && (
        <EditShelfMod
          shelf={editShelfs}
          onClose={() => setEditShelfs(null)}
          warehouseId={warehouseID} 
          onShelfUpdated={handleShelfUpdated}
        />
      )}

      {showViewModal && (
        <ViewShelfMod
          onClose={() => setShowViewModal(false)}
          shelfData={selectedShelf}
        />
      )}
    </DashboardTemplate>
  );
};

export default ShelfDetailPage;