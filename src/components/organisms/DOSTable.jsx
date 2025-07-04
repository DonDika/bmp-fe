import TableHeadCell from "../atoms/TableHeadCell";
import TableDataCell from "../atoms/TableDataCell";
import ActionButton from "../molecules/ActionButton";

const DOSTable = ({ dos, indexOfFirstItem, onViewDelivery }) => {
  console.log("DO", dos);
  return (
    <div className="overflow-x-auto bg-white rounded-xl border">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-300 uppercase text-xs">
          <tr>
            <TableHeadCell width="w-fit">#</TableHeadCell>
            <TableHeadCell className="w-3/12">Delivery Order No.</TableHeadCell>
            <TableHeadCell className="w-2/12">Remarks</TableHeadCell>
            <TableHeadCell className="w-3/12">Material Request No.</TableHeadCell>
            <TableHeadCell className="w-1/12">Status</TableHeadCell>
            <TableHeadCell width="w-3/12">Actions</TableHeadCell>
          </tr>
        </thead>
        <tbody>
          {dos.map((do_, index) => (
            <tr
              key={`${do_.id}-${index}`}
              className={`hover:bg-gray-50 ${
                index !== dos.length - 1 ? "border-b" : ""
              }`}
            >
              <TableDataCell>{index + indexOfFirstItem + 1}</TableDataCell>
              <TableDataCell>{do_.no_do}</TableDataCell>
              <TableDataCell>{do_.remarks}</TableDataCell>
              <TableDataCell>{do_.material_request.no_mr}</TableDataCell>
              <TableDataCell className="capitalize">{do_.status}</TableDataCell>
              <TableDataCell>
                <ActionButton
                  onView={() => onViewDelivery(do_)}
                  onEdit={() => console.log("Edit", do_)}
                  onDelete={() => console.log("Delete", do_)}
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

export default DOSTable;
