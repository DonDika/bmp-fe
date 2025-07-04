import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";

const MPRSTable = ({ mprs, indexOfFirstItem, onViewPurchase, onEditPurchase, onDeletePurchase }) => {
  console.log("MPRS", mprs);
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-1/12">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Material Req. No.</TableHeadCell>
            <TableHeadCell className="w-3/12">Created By</TableHeadCell>
            <TableHeadCell className="w-2/12">Status</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {mprs.map((mpr, index) => (
            <tr
              key={`${mpr.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== mprs.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{mpr.no_mr}</TableDataCell>
              <TableDataCell>{mpr.user.email}</TableDataCell>
              <TableDataCell className="capitalize">{mpr.status}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() => onViewPurchase(mpr)}
                  onEdit={() => onEditPurchase(mpr)}
                  onDelete={() => onDeletePurchase(mpr)}
                />
              </TableDataCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MPRSTable;
