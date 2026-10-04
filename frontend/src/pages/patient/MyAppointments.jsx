import { useState } from 'react';
import * as appointmentApi from '../../api/appointmentApi';
import AppointmentList from '../../components/appointments/AppointmentList';
import Alert from '../../components/common/Alert';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/format';

const TABS = ['', 'booked', 'completed', 'cancelled'];

export default function MyAppointments() {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const { data, loading, error, reload } = useFetch(() => appointmentApi.getMyAppointments(status ? { status } : {}), [status]);

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
      <PageHeader title="My appointments" />
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t || 'all'} type="button" onClick={() => setStatus(t)} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${status === t ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-500'}`}>
            {t || 'all'}
          </button>
        ))}
      </div>
      <div className="mb-4 space-y-2">
        <Alert type={message.type || 'info'}>{message.text}</Alert>
        <Alert>{error}</Alert>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <AppointmentList
          appointments={data || []}
          role="patient"
          renderActions={(a) =>
            a.status === 'booked' && (
              <button type="button" className="btn-danger btn-sm" onClick={() => cancel(a)}>Cancel</button>
            )
          }
        />
      )}
    </div>
  );
}
