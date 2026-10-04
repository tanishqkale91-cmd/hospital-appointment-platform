import { useState } from 'react';
import * as waitingListApi from '../../api/waitingListApi';
import DataTable from '../../components/admin/DataTable';
import Alert from '../../components/common/Alert';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import useFetch from '../../hooks/useFetch';
import { doctorName, formatDate, formatTime, getErrorMessage } from '../../utils/format';

export default function WaitingLists() {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const { data, loading, error, reload } = useFetch(() => waitingListApi.listWaitingList(status ? { status } : {}), [status]);

  const cancel = async (w) => {
    if (!window.confirm('Cancel this waiting list entry?')) return;
    try {
      await waitingListApi.cancelWaitingEntry(w._id);
      setMessage({ type: 'success', text: 'Entry cancelled' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const columns = [
    { header: 'Patient', render: (w) => <div><p className="font-medium">{w.patient?.name}</p><p className="text-xs text-slate-500">{w.patient?.email}</p></div> },
    { header: 'Doctor', render: (w) => doctorName(w.doctor) },
    { header: 'Desired date', render: (w) => formatDate(w.desiredDate) },
    { header: 'Preferred time', render: (w) => (w.preferredTime ? formatTime(w.preferredTime) : 'Any') },
    { header: 'Requested', render: (w) => new Date(w.createdAt).toLocaleString() },
    { header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
    { header: 'Actions', render: (w) => w.status === 'waiting' && <button type="button" className="btn-danger btn-sm" onClick={() => cancel(w)}>Cancel</button> },
  ];

  return (
    <div>
      <PageHeader title="Waiting lists" />
      <div className="mb-4 max-w-xs">
        <label htmlFor="wl-status" className="label">Status</label>
        <select id="wl-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="waiting">Waiting</option>
          <option value="assigned">Assigned</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="mb-4 space-y-2">
        <Alert type={message.type || 'info'}>{message.text}</Alert>
        <Alert>{error}</Alert>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} rows={data || []} emptyTitle="No waiting list entries" />}
    </div>
  );
}
