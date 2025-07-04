import React from "react";
import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";
import { useNavigate } from "react-router";

const WarehousesTable = ({ warehouses, indexOfFirstItem, onEditWarehouse, onDeleteWarehouse }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-1/12">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Name</TableHeadCell>
            <TableHeadCell className="w-2/12">Location</TableHeadCell>
            <TableHeadCell className="w-3/12">Contact</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse, index) => (
            <tr
              key={`${warehouse.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== warehouses.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{warehouse.name}</TableDataCell>
              <TableDataCell className="uppercase">
                {warehouse.location}
              </TableDataCell>
              <TableDataCell>{warehouse.contact}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() =>
                    navigate(`/dashboard/warehouses/${warehouse.id}`)
                  }
                  onEdit={() => onEditWarehouse(warehouse)}
                  onDelete={() => onDeleteWarehouse(warehouse)}
                  showView={true}
                  showEdit={true}
                  showDelete={true}
                />
              </TableDataCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehousesTable;