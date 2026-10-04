import EmptyState from '../common/EmptyState';

/** columns: [{ header, render(row) }] */
export default function DataTable({ columns, rows, emptyTitle = 'Nothing to show', emptyMessage }) {
  if (!rows?.length) return <EmptyState title={emptyTitle} message={emptyMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className="th">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row._id} className="hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.header} className="td">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
