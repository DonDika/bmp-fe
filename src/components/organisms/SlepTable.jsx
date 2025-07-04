import React from "react";

const SlepTable = ({ items }) => {
  return (
    <div className="mt-6 overflow-x-auto border">
      <table className="min-w-[2000px] w-full table-auto text-sm text-center border-collapse">
        <thead>
          <tr>
            <th rowSpan={3} className="border p-2">
              No.
            </th>
            <th rowSpan={3} className="border p-2">
              Part Book ID
            </th>
            <th rowSpan={3} className="border p-2">
              Description
            </th>
            <th rowSpan={3} className="border p-2">
              Size
            </th>
            <th rowSpan={3} className="border p-2">
              Part No.
            </th>
            <th rowSpan={3} className="border p-2">
              Unit
            </th>
            <th rowSpan={3} className="border p-2 bg-yellow-100">
              Qty STD
            </th>
            <th colSpan={6} className="border p-2 bg-rose-200">
              Stock Location
            </th>
            <th rowSpan={3} className="border p-2 bg-orange-200">
              Total Stock
            </th>
            <th rowSpan={3} className="border p-2 bg-lime-100">
              Condition
            </th>
            <th colSpan={2} className="border p-2 bg-yellow-100">
              Qty
            </th>
            <th colSpan={2} className="border p-2 bg-yellow-100">
              Estimate Price
            </th>
            <th
              rowSpan={3}
              className="border border-black p-2 bg-gray-500 text-white"
            >
              Qty Total
              <br />
              <span className="text-xs underline">Send</span>
            </th>
          </tr>
          <tr>
            <th colSpan={2} className="border p-2 bg-gray-300">
              BSD
            </th>
            <th colSpan={2} className="border p-2 bg-green-400">
              SBW
            </th>
            <th colSpan={2} className="border p-2 bg-purple-300">
              MND
            </th>
            <th rowSpan={2} className="border p-2 bg-yellow-50">
              MPR
            </th>
            <th rowSpan={2} className="border p-2 bg-yellow-50">
              PO
            </th>
            <th rowSpan={2} className="border p-2 bg-yellow-50">
              Unit Price
            </th>
            <th rowSpan={2} className="border p-2 bg-yellow-50">
              Total Price
            </th>
          </tr>
          <tr>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Pos</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Pos</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Pos</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) =>
            item.slep_detail.map((detail, subIndex) => (
              <tr key={`${item.id}-${subIndex}`}>
                {subIndex === 0 && (
                  <>
                    <td
                      className="border p-2"
                      rowSpan={item.slep_detail.length}
                    >
                      {index + 1}
                    </td>
                    <td
                      className="border p-2"
                      rowSpan={item.slep_detail.length}
                    >
                      {item.part_book_id}
                    </td>
                  </>
                )}
                <td className="border p-2">{detail.description}</td>
                <td className="border p-2">{detail.size}</td>
                <td className="border p-2">{detail.part_no}</td>
                <td className="border p-2">{detail.unit}</td>
                <td className="border p-2">{detail.qty_std}</td>
                <td className="border p-2">{detail.bsd_qty}</td>
                <td className="border p-2">{detail.bsd_pos}</td>
                <td className="border p-2">{detail.sbw_qty}</td>
                <td className="border p-2">{detail.sbw_pos}</td>
                <td className="border p-2">{detail.mnd_qty}</td>
                <td className="border p-2">{detail.mnd_pos}</td>
                <td className="border p-2">{detail.total_stock}</td>
                <td className="border p-2">{detail.condition}</td>
                <td className="border p-2">{detail.mpr}</td>
                <td className="border p-2">{detail.po}</td>
                <td className="border p-2">{detail.unit_price}</td>
                <td className="border p-2">{detail.total_price}</td>
                <td className="border p-2">{detail.qty_total_send}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SlepTable;
