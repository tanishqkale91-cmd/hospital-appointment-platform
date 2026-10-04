import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as waitingListApi from '../../api/waitingListApi';
import DataTable from '../../components/admin/DataTable';
import Alert from '../../components/common/Alert';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import useFetch from '../../hooks/useFetch';
import { doctorName, formatDate, formatTime, getErrorMessage } from '../../utils/format';

export default function WaitingList() {
  const { data, loading, error, reload } = useFetch(() => waitingListApi.getMyWaitingList());
  const [message, setMessage] = useState({ type: '', text: '' });

  const cancel = async (entry) => {
    if (!window.confirm('Leave the waiting list for this slot?')) return;
    try {
      await waitingListApi.cancelWaitingEntry(entry._id);
      setMessage({ type: 'success', text: 'Removed from waiting list' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const columns = [
    { header: 'Doctor', render: (w) => <div><p className="font-medium">{doctorName(w.doctor)}</p><p className="text-xs text-slate-500">{w.doctor?.specialization}</p></div> },
    { header: 'Desired date', render: (w) => formatDate(w.desiredDate) },
    { header: 'Preferred time', render: (w) => (w.preferredTime ? formatTime(w.preferredTime) : 'Any') },
    { header: 'Status', render: (w) => <StatusBadge status={w.status} /> },
    {
      header: 'Actions',
      render: (w) => (
        <div className="flex gap-2">
          {w.status === 'waiting' && <button type="button" className="btn-danger btn-sm" onClick={() => cancel(w)}>Leave</button>}
          {w.status === 'assigned' && w.appointment && <Link to={`/patient/appointments/${w.appointment}`} className="btn-secondary btn-sm">View appointment</Link>}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Waiting list" subtitle="You are assigned automatically when a matching slot is cancelled" />
      <div className="mb-4 space-y-2">
        <Alert type={message.type || 'info'}>{message.text}</Alert>
        <Alert>{error}</Alert>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} rows={data || []} emptyTitle="You are not on any waiting list" emptyMessage="Join one from a doctor's page when no slots are free." />}
    </div>
  );
}
