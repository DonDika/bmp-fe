import React, { useState, useEffect } from "react";
import DashboardTemplate from "../components/templates/DashboardTemplate";
import Button from "../components/atoms/Button";
import UsersTable from "../components/organisms/UsersTable";
import Pagination from "../components/organisms/Pagination";
import usePagination from "../hooks/usePagination";
import useMod from "../hooks/useMod";
import axios from "axios";
import Cookies from "js-cookie";
import AddUserMod from "../mods/AddUserMod";
import EditUserMod from "../mods/EditUserMod";
import Swal from 'sweetalert2';

const UsersPage = () => {
  const modController = useMod();
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, handleOpenModal, handleCloseModal } = modController;

  const token = Cookies.get("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      console.log("Fetched Users:", res.data.data);
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        setError("Gagal mengambil data user");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user); 
  };

  const handleUserUpdated = () => {
    fetchUsers();
    setEditUser(null);
  };
  
const handleDeleteUser = async (user) => {
  const result = await Swal.fire({
    title: 'Apakah Anda yakin?',
    text: `Anda akan menghapus user ${user.email}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  });

  if (result.isConfirmed) {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        Swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
        fetchUsers(); // Refresh data
      } else {
        Swal.fire('Gagal', 'Gagal menghapus user.', 'error');
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire('Error', 'Terjadi kesalahan saat hapus user.', 'error');
    }
  }
};

  const handleUserAdded = () => {
    fetchUsers();
  };
  

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setError("Token tidak ditemukan, silakan login ulang.");
      setLoading(false);
    }
  }, [token]);

  const {
    currentPage,
    currentItems: currentUsers,
    totalPages,
    handlePageChange,
    indexOfFirstItem,
  } = usePagination(users, 10);

  return (
    <DashboardTemplate>
      <div className="w-full h-full flex flex-col gap-5">
        <p className="text-3xl font-semibold">Management Users</p>

        <div className="w-full flex justify-end">
          <div className="w-60">
            <Button type="button" onClick={() => handleOpenModal("addUser")}>Tambah User</Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <UsersTable
              users={currentUsers}
              indexOfFirstItem={indexOfFirstItem}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
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
      {isOpen("addUser") && (
        <AddUserMod
          onClose={() => handleCloseModal("addUser")}
          onUserAdded={handleUserAdded}
        />
      )}

      {editUser && (
        <EditUserMod
          user={editUser}
          onClose={() => setEditUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </DashboardTemplate>
  );
};

export default UsersPage;