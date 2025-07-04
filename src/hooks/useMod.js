import { useState } from "react";

const useMod = () => {
  const [modals, setModals] = useState({});
  const [selectdItem, setSelectedItem] = useState(null);

  const handleOpenModal = (type, item = null) => {
    setModals((prev) => ({ ...prev, [type]: true }));
    setSelectedItem(item);
  };

  const handleCloseModal = (type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedItem(null);
  };

  const isOpen = (type) => !!modals[type];

  return {
    modals,
    isOpen,
    selectdItem,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useMod;
