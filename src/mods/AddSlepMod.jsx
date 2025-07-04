import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const AddSlepMod = ({ onClose, onCreated }) => {
  const [projectInfo, setProjectInfo] = useState({
    name: "",
    location: "",
    type: "",
    rig_no: "",
    updated_at: "",
    job_no: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const newProject = {
      id: Date.now(),
      ...projectInfo,
      table: [], // kosong, belum ada detail
    };

    console.log("New Project:", newProject);

    onCreated(newProject);
    onClose(); // tutup modal setelah submit

    // Reset form (opsional)
    setProjectInfo({
      name: "",
      location: "",
      type: "",
      rig_no: "",
      updated_at: "",
      job_no: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah SLEP</h2>
          <button onClick={onClose}>
            <RiCloseLine className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(projectInfo).map(([key, value]) => (
            <div key={key}>
              <label className="block font-medium capitalize mb-1">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>
          ))}
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
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Tambahkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSlepMod;
