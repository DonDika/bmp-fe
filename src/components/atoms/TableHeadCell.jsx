import React from "react";

const TableHeadCell = ({ children, className = "", width = "" }) => {
  return (
    <th className={`px-6 py-4 text-left ${width} ${className}`}>
      {children}
    </th>
  );
};

export default TableHeadCell;
