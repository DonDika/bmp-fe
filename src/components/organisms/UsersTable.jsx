import React from "react";
import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";
import dayjs from "dayjs";

const UsersTable = ({ users, indexOfFirstItem, onEditUser, onDeleteUser }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-1/12">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Email</TableHeadCell>
            <TableHeadCell className="w-2/12">Role</TableHeadCell>
            <TableHeadCell className="w-3/12">Created At</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={`${user.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== users.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{user.email}</TableDataCell>
              <TableDataCell className="capitalize">{user.role}</TableDataCell>
              <TableDataCell>{dayjs(user.created_at).format("DD-MM-YYYY")}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() => console.log("View", user)}
                  onEdit={() => onEditUser(user)}
                  onDelete={() => onDeleteUser(user)}
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

export default UsersTable;
