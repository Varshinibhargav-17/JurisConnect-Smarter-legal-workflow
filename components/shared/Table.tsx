import { JSX } from "react";

interface TableProps {
  columns: {
    header: string;
    accessor: string;
    cell?: ({ value }: { value: any }) => JSX.Element;
  }[];
  data: any[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {col.cell ? col.cell({ value: row[col.accessor] }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
