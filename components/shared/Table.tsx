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
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
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
