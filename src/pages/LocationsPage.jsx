import React, { useState, useEffect } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import Button from "../components/atoms/Button";
import LocationsTable from "../components/organisms/LocationsTable";
import Pagination from "../components/organisms/Pagination";
import usePagination from "../hooks/usePagination";
import useMod from "../hooks/useMod";
import axios from "axios";
import Cookies from "js-cookie";
import AddLocationMod from "../mods/AddLocationMod";
import EditLocationMod from "../mods/EditLocationMod";

const LocationsPage = () => {
  const modController = useMod();
  const [locations, setLocations] = useState([]);
  const [editLocation, setEditLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchLocations = async () => {
    try {
      const res = await axios.get("${import.meta.env.VITE_API_URL}/location/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched Locations:", res.data.data);
      if (res.data.success) {
        setLocations(res.data.data);
      } else {
        setError("Gagal mengambil data location");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data location");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = (location) => {
    setEditLocation(location); 
  };

  const handleLocationUpdated = () => {
    fetchLocations();
    setEditLocation(null);
  };
  
  const handleDeleteLocation = async (location) => {
    const confirmDelete = confirm(`Hapus Lokasi ${location.name}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/location/${location.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.success) {
        alert("Location berhasil dihapus");
        fetchLocations(); // Refresh data
      } else {
        alert("Gagal menghapus location");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan saat hapus location");
    }
  };
  

  const handleLocationAdded = () => {
    fetchLocations();
  };
  

  useEffect(() => {
    if (token) {
      fetchLocations();
    } else {
      setError("Token tidak ditemukan, silakan login ulang.");
      setLoading(false);
    }
  }, [token]);

  const {
    currentPage,
    currentItems: currentLocations,
    totalPages,
    handlePageChange,
    indexOfFirstItem, 
  } = usePagination(locations, 10);

  return (
    <DashboardTemplate>
      <div className="w-full h-full flex flex-col gap-5">
        <p className="text-3xl font-semibold">Management Locations</p>

        <div className="w-full flex justify-end">
          <div className="w-60">
            <Button type="button" onClick={() => handleOpenModal("addLocation")}>Tambah Location</Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <LocationsTable
              locations={currentLocations}
              indexOfFirstItem={indexOfFirstItem}
              onEditLocation={handleEditLocation}
              onDeleteLocation={handleDeleteLocation}
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
      {isOpen("addLocation") && (
        <AddLocationMod
          onClose={() => handleCloseModal("addLocation")}
          onLocationAdded={handleLocationAdded}
        />
      )}

      {editLocation && (
        <EditLocationMod
          location={editLocation}
          onClose={() => setEditLocation(null)}
          onLocationUpdated={handleLocationUpdated}
        />
      )}

    </DashboardTemplate>
  );
};

export default LocationsPage;
