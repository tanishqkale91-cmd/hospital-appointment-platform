import { useState } from 'react';
import * as appointmentApi from '../../api/appointmentApi';
import AppointmentList from '../../components/appointments/AppointmentList';
import Alert from '../../components/common/Alert';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/format';

export default function Appointments() {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const params = { ...(status && { status }), ...(date && { date }) };
  const { data, loading, error, reload } = useFetch(() => appointmentApi.listAllAppointments(params), [status, date]);

  const cancel = async (a) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentApi.cancelAppointment(a._id);
      setMessage({ type: 'success', text: 'Appointment cancelled' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  return (
    <div>
      <PageHeader title="All appointments" />
      <div className="card mb-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="a-status" className="label">Status</label>
          <select id="a-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="a-filter-date" className="label">Date</label>
          <input id="a-filter-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex items-end"><button type="button" className="btn-secondary" onClick={() => { setStatus(''); setDate(''); }}>Clear filters</button></div>
      </div>
      <div className="mb-4 space-y-2">
        <Alert type={message.type || 'info'}>{message.text}</Alert>
        <Alert>{error}</Alert>
      </div>
      {loading ? <Spinner /> : (
        <AppointmentList
          appointments={data || []}
          role="admin"
          renderActions={(a) => a.status === 'booked' && <button type="button" className="btn-danger btn-sm" onClick={() => cancel(a)}>Cancel</button>}
        />
      )}
    </div>
  );
}
