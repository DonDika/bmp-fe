import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";

const IGRSTable = ({ igrs, indexOfFirstItem, onViewReceipt, onEditReceipt }) => {
  console.log("IGR", igrs);
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-fit">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Goods Receipt No.</TableHeadCell>
            <TableHeadCell className="w-2/12">Created by</TableHeadCell>
            <TableHeadCell className="w-3/12">Purchase Order No.</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {igrs.map((igr, index) => (
            <tr
              key={`${igr.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== igrs.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{igr.no_igr}</TableDataCell>
              <TableDataCell>{igr.purchase_order.created_by.email}</TableDataCell>
              <TableDataCell>{igr.purchase_order.no_po}</TableDataCell>
              {/* <TableDataCell className="capitalize">{igr.status}</TableDataCell> */}
              <TableDataCell>
                <ActionButton
                  onView={() => onViewReceipt(igr)}
                  onEdit={() => onEditReceipt(igr)}
                  onDelete={() => console.log("Delete", igr)}
                  showDelete={false}
                  showEdit={false}
                />
              </TableDataCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IGRSTable;