import React from "react";
import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";
import dayjs from "dayjs";

const LocationsTable = ({ locations, indexOfFirstItem, onEditLocation, onDeleteLocation }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-1/12">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Name</TableHeadCell>
            <TableHeadCell className="w-3/12">Code</TableHeadCell>
            <TableHeadCell className="w-3/12">Created At</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>

        <tbody>
          {locations.map((location, index) => (
            <tr
              key={`${location.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== locations.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{location.name}</TableDataCell>
              <TableDataCell className="uppercase">
                {location.code}
              </TableDataCell>
              <TableDataCell>{dayjs(location.created_at).format("DD-MM-YYYY")}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() => console.log("View", location)}
                  onEdit={() => onEditLocation(location)}
                  onDelete={() => onDeleteLocation(location)}
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

export default LocationsTable;
