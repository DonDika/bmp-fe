import React, { useState } from "react";
import { RiCloseLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from 'sweetalert2'

const AddUserMod = ({ onClose, onUserAdded }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Validasi input sederhana
    if (!userInfo.email || !userInfo.password || !userInfo.role) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get("token");

      const response = await axios.post(
        "http://localhost:5001/api/user",
        {
          email: userInfo.email,
          password: userInfo.password,
          role: userInfo.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (onUserAdded) {
          Swal.fire({
            title: 'Success',
            text: 'Berhasil Menambahkan Data',
            icon: 'success',
            confirmButtonText: 'Tutup'
          })
          onUserAdded(); // Refresh data di halaman UsersPage
        }
        onClose(); // Tutup modal
      } else {
        setError("Gagal menambahkan user.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah User</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Masukkan email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userInfo.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md pr-10"
              placeholder="Masukkan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">Role</label>
            <select
              name="role"
              value={userInfo.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>
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

export default AddUserMod;
