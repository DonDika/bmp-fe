import React, { useState, useEffect } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import Button from "../components/atoms/Button";
import Pagination from "../components/organisms/Pagination";
import usePagination from "../hooks/usePagination";
import ItemsTable from "../components/organisms/ItemsTable";
import useMod from "../hooks/useMod";
import axios from "axios";
import Cookies from "js-cookie";
import AddItemMod from "../mods/AddItemMod";
import EditItemMod from "../mods/EditItemMod";

const ItemsPage = () => {
  const modController = useMod();
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/item/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched Items:", res.data.data);
      if (res.data.success) {
        setItems(res.data.data);
      } else {
        setError("Gagal mengambil data item");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data item");
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item); 
  };

  const handleItemUpdated = () => {
    fetchItems();
    setEditItem(null);
  };
  
  const handleDeleteItem = async (item) => {
    const confirmDelete = confirm(`Hapus item ${item.name}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/item/${item.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.data.success) {
        alert("Item berhasil dihapus");
        fetchItems(); // Refresh data
      } else {
        alert("Gagal menghapus item");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan saat hapus item");
    }
  };
  

  const handleItemAdded = () => {
    fetchItems();
  };
  

  useEffect(() => {
    if (token) {
      fetchItems();
    } else {
      setError("Token tidak ditemukan, silakan login ulang.");
      setLoading(false);
    }
  }, [token]);

  const {
    currentPage,
    currentItems: currentItems,
    totalPages,
    handlePageChange,
    indexOfFirstItem,
  } = usePagination(items, 10);
  

  return (
    <DashboardTemplate>
      <div className="w-full h-full flex flex-col gap-5">
        <p className="text-3xl font-semibold">Management Items</p>

        <div className="w-full flex justify-end">
          <div className="w-60">
            <Button type="button" onClick={() => handleOpenModal("addItem")}>Tambah Item</Button>
          </div>
        </div>

        

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <ItemsTable 
              items={currentItems} 
              indexOfFirstItem={indexOfFirstItem} 
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
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
      {isOpen("addItem") && (
        <AddItemMod
          onClose={() => handleCloseModal("addItem")}
          onItemAdded={handleItemAdded}
        />
      )}

      {editItem && (
        <EditItemMod
          item={editItem}
          onClose={() => setEditItem(null)}
          onItemUpdated={handleItemUpdated}
        />
      )}
    </DashboardTemplate>
  );
};

export default ItemsPage;
