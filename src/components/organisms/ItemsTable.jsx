import React from "react";
import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";

const ItemsTable = ({ items, indexOfFirstItem, onEditItem, onDeleteItem }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-1/12">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Name</TableHeadCell>
            <TableHeadCell className="w-2/12">Code</TableHeadCell>
            <TableHeadCell className="w-3/12">Part Number</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={`${item.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== items.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{item.name}</TableDataCell>
              <TableDataCell className="uppercase">{item.code}</TableDataCell>
              <TableDataCell>{item.part_number}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() => console.log("View", item)}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item)}
                  showView={false}
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

export default ItemsTable;
