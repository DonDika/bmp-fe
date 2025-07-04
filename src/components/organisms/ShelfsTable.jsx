import React from "react";
import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";

const ShelfsTable = ({ shelfs, indexOfFirstItem, onViewShelf, onEditShelf, onDeleteShelf }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-fit">#</TableHeadCell>
            <TableHeadCell>Item Name</TableHeadCell>
            <TableHeadCell>Item Code</TableHeadCell>
            <TableHeadCell>Location</TableHeadCell>
            <TableHeadCell>Position</TableHeadCell>
            <TableHeadCell>Stock Qty</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {shelfs.map((shelf, index) => (
            <tr
              key={`${shelf.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== shelfs.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{shelf.item.item_name}</TableDataCell>
              <TableDataCell className="uppercase">
                {shelf.item.item_code}
              </TableDataCell>
              <TableDataCell>{shelf.location}</TableDataCell>
              <TableDataCell>{shelf.position}</TableDataCell>
              <TableDataCell>{shelf.stock_qty}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() => onViewShelf(shelf)}
                  onEdit={() => onEditShelf(shelf)}
                  onDelete={() => onDeleteShelf(shelf)}
                />
              </TableDataCell>
            </tr>
          ))}
          {shelfs.length === 0 && (
            <tr>
              <TableDataCell colSpan="6">No shelfs found</TableDataCell>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShelfsTable;