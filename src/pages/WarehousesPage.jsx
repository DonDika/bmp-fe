
import React, { useState, useEffect } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import Button from "../components/atoms/Button";
import Pagination from "../components/organisms/Pagination";
import usePagination from "../hooks/usePagination";
import useMod from "../hooks/useMod";
import axios from "axios";
import Cookies from "js-cookie";
import WarehousesTable from "../components/organisms/WarehousesTable";
import AddWarehouseMod from "../mods/AddWarehousesMod";
import EditWarehousesMod from "../mods/EditWarehousesMod"

const WarehousesPage = () => {
  const modController = useMod();
  const [warehouses, setWarehouses] = useState([]);
  const [editWarehouse, setEditWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchWarehouse = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/warehouse/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched Warehouse:", res.data.data);
      if (res.data.success) {
        setWarehouses(res.data.data);
      } else {
        setError("Gagal mengambil data warehouse");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleEditWarehouse = (warehouse) => {
    setEditWarehouse(warehouse); 
  };

  const handleWarehouseUpdated = () => {
    fetchWarehouse();
    setEditWarehouse(null);
  };
  
  const handleDeletewarehouse = async (warehouse) => {
    const confirmDelete = confirm(`Hapus warehouse ${warehouse.name}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await axios.delete(`http://localhost:5001/api/warehouse/${warehouse.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.success) {
        alert("Warehouse berhasil dihapus");
        fetchWarehouse(); // Refresh data
      } else {
        alert("Gagal menghapus warehouse");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan saat hapus warehouse");
    }
  };
  

  const handleWarehouseAdded = () => {
    fetchWarehouse();
  };
  

  useEffect(() => {
    if (token) {
      fetchWarehouse();
    } else {
      setError("Token tidak didapatkan, silakan login ulang.");
      setLoading(false);
    }
  }, [token]);

  const {
    currentPage,
    currentItems: currentWarehouses,
    totalPages,
    handlePageChange,
    indexOfFirstItem,
  } = usePagination(warehouses, 10);

  return (
    <DashboardTemplate>
      <div className="w-full h-full flex flex-col gap-5">
        <p className="text-3xl font-semibold">Management Warehouses</p>
        <div className="w-full flex justify-end">
          <div className="w-60">
            <Button type="button" onClick={() => handleOpenModal("addWarehouse")}>Tambah Warehouse</Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <WarehousesTable
              warehouses={currentWarehouses}
              indexOfFirstItem={indexOfFirstItem} 
              onEditWarehouse={handleEditWarehouse}
              onDeleteWarehouse={handleDeletewarehouse}
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
      {isOpen("addWarehouse") && (
        <AddWarehouseMod
          onClose={() => handleCloseModal("addWarehouse")}
          onWarehouseAdded={handleWarehouseAdded}
        />
      )}

      {editWarehouse && (
        <EditWarehousesMod
          warehouse={editWarehouse}
          onClose={() => setEditWarehouse(null)}
          onWarehouseUpdated={handleWarehouseUpdated}
        />
      )}
    </DashboardTemplate>
  );
};

export default WarehousesPage;
