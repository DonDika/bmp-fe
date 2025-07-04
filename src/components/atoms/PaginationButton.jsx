import React from "react";

const PaginationButton = ({
  children,
  onClick,
  disabled = false,
  active = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-md text-sm transition
        ${active ? "bg-red-500 text-white" : "bg-white border"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-100"}
      `}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
