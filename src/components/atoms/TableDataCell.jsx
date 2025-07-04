import React from "react";

const TableDataCell = ({ children, className = "" }) => {
  return (
    <td className={`px-6 py-2 ${className}`}>
      {children}
    </td>
  );
};

export default TableDataCell;
