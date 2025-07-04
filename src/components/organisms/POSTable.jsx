import React from "react";
import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";

const POSTable = ({ pos, indexOfFirstItem, onViewPurchase, onEditPurchase, onDeletePurchase }) => {
  console.log("POS", pos);
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-fit">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Purchase Order No.</TableHeadCell>
            <TableHeadCell className="w-2/12">Created by</TableHeadCell>
            <TableHeadCell className="w-3/12">Material Req. No.</TableHeadCell>
            <TableHeadCell className="w-1/12">Status</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {pos.map((po, index) => (
            <tr
              key={`${po.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== pos.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{po.no_po}</TableDataCell>
              <TableDataCell>{po.user.email}</TableDataCell>
              <TableDataCell className="whitespace-pre-line">
                {po.material_requests.length > 0
                ? po.material_requests.map((mr) => mr.no_mr).join("\n")
                : "-"}
              </TableDataCell>
              <TableDataCell className="capitalize">{po.status}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() => onViewPurchase(po)}
                  onEdit={() => onEditPurchase(po)}
                  onDelete={() => onDeletePurchase(po)}
                />
              </TableDataCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default POSTable;
