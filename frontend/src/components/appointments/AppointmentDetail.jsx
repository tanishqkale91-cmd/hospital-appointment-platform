import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as appointmentApi from '../../api/appointmentApi';
import useFetch from '../../hooks/useFetch';
import { doctorName, formatDate, formatTime, getErrorMessage } from '../../utils/format';
import Alert from '../common/Alert';
import PageHeader from '../common/PageHeader';
import Spinner from '../common/Spinner';
import StatusBadge from '../common/StatusBadge';

const Row = ({ label, children }) => (
  <div className="flex flex-col gap-1 border-b border-slate-100 py-3 sm:flex-row sm:justify-between">
    <dt className="text-sm text-slate-500">{label}</dt>
    <dd className="text-sm font-medium text-slate-800">{children}</dd>
  </div>
);

/** Shared appointment details page for patient and doctor. */
export default function AppointmentDetail({ role }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: appt, loading, error, reload } = useFetch(() => appointmentApi.getAppointment(id), [id]);
  const [notes, setNotes] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  if (loading && !appt) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;
  if (!appt) return null;

  const run = async (fn, successText) => {
    setBusy(true);
    setMessage({ type: '', text: '' });
    try {
      await fn();
      setMessage({ type: 'success', text: successText });
      await reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    if (!window.confirm('Cancel this appointment?')) return;
    run(() => appointmentApi.cancelAppointment(appt._id), 'Appointment cancelled');
  };
  const setStatus = (status) =>
    run(() => appointmentApi.updateAppointmentStatus(appt._id, { status, notes: notes ?? appt.notes }), `Appointment marked ${status}`);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Appointment details"
        actions={<button type="button" className="btn-secondary" onClick={() => navigate(`/${role}/appointments`)}>Back</button>}
      />
      <div className="card">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{formatDate(appt.date)}</h2>
          <StatusBadge status={appt.status} />
        </div>
        <dl>
          <Row label="Time">{formatTime(appt.startTime)} - {formatTime(appt.endTime)}</Row>
          <Row label="Doctor">{doctorName(appt.doctor)} ({appt.doctor?.specialization})</Row>
          <Row label="Department">{appt.department?.name || appt.doctor?.department?.name || '-'}</Row>
          <Row label="Patient">{appt.patient?.name} · {appt.patient?.email}</Row>
          <Row label="Reason">{appt.reason || '-'}</Row>
          <Row label="Doctor notes">{appt.notes || '-'}</Row>
          {appt.status === 'cancelled' && <Row label="Cancelled by">{appt.cancelledBy || '-'}</Row>}
        </dl>

        <div className="mt-4 space-y-3">
          <Alert type={message.type || 'info'}>{message.text}</Alert>
          {role === 'doctor' && appt.status === 'booked' && (
            <div>
              <label htmlFor="notes" className="label">Notes</label>
              <textarea id="notes" rows={3} maxLength={1000} className="input" value={notes ?? appt.notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          )}
          {appt.status === 'booked' && (
            <div className="flex flex-wrap gap-2">
              {role === 'doctor' && (
                <button type="button" id="mark-completed" className="btn-primary" disabled={busy} onClick={() => setStatus('completed')}>Mark completed</button>
              )}
              <button type="button" id="cancel-appointment" className="btn-danger" disabled={busy} onClick={cancel}>Cancel appointment</button>
            </div>
          )}
          {role === 'patient' && appt.status !== 'booked' && (
            <Link to={`/patient/doctors/${appt.doctor?._id}`} className="btn-secondary">Book again</Link>
          )}
        </div>
      </div>
    </div>
  );
}
