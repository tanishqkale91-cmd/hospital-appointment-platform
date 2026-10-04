import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as appointmentApi from '../../api/appointmentApi';
import * as doctorApi from '../../api/doctorApi';
import Alert from '../../components/common/Alert';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';
import { doctorName, formatDate, formatTime, getErrorMessage, isPastValue } from '../../utils/format';

export default function BookAppointment() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const date = params.get('date');
  const time = params.get('time');
  const navigate = useNavigate();
  const doctor = useFetch(() => doctorApi.getDoctor(id), [id]);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (doctor.loading) return <Spinner />;
  if (doctor.error) return <Alert>{doctor.error}</Alert>;
  if (!date || !time) {
    return (
      <Alert type="warning">
        No slot selected. <Link className="underline" to={`/patient/doctors/${id}/slots`}>Choose a slot</Link>
      </Alert>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (isPastValue(date, time)) return setError('This slot is in the past. Please pick another one.');
    if (reason.length > 500) return setError('Reason must be 500 characters or fewer');
    setBusy(true);
    try {
      const res = await appointmentApi.bookAppointment({ doctorId: id, date, startTime: time, reason });
      navigate(`/patient/appointments/${res.data._id}`, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Confirm appointment" />
      <form onSubmit={submit} className="card space-y-4" id="book-form">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-slate-500">Doctor</dt><dd className="font-medium">{doctorName(doctor.data)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Specialization</dt><dd>{doctor.data.specialization}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Date</dt><dd className="font-medium">{formatDate(date)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-500">Time</dt><dd className="font-medium">{formatTime(time)}</dd></div>
        </dl>
        <div>
          <label htmlFor="reason" className="label">Reason for visit (optional)</label>
          <textarea id="reason" rows={3} maxLength={500} className="input" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <Alert>{error}</Alert>
        <div className="flex gap-2">
          <button type="submit" id="confirm-booking" className="btn-primary" disabled={busy}>{busy ? 'Booking...' : 'Confirm booking'}</button>
          <Link to={`/patient/doctors/${id}/slots?date=${date}`} className="btn-secondary">Choose another slot</Link>
        </div>
      </form>
    </div>
  );
}
