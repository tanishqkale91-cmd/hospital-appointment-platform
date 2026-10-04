import { useState } from 'react';
import * as waitingListApi from '../../api/waitingListApi';
import { getErrorMessage, todayString } from '../../utils/format';
import { validateDate } from '../../utils/validation';
import Alert from '../common/Alert';

/** Lets a patient join the waiting list for a doctor on a given date. */
export default function WaitingListForm({ doctorId, defaultDate, onJoined }) {
  const [desiredDate, setDesiredDate] = useState(defaultDate || todayString());
  const [preferredTime, setPreferredTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const dateErr = validateDate(desiredDate);
    if (dateErr) return setError(dateErr);
    setBusy(true);
    try {
      await waitingListApi.joinWaitingList({ doctorId, desiredDate, preferredTime });
      setSuccess('You are on the waiting list. You will get the slot automatically if one is cancelled.');
      onJoined?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4" id="waiting-list-form">
      <div>
        <h3 className="font-semibold text-slate-900">No suitable slot? Join the waiting list</h3>
        <p className="text-sm text-slate-500">If a booked appointment is cancelled, the first eligible patient gets the slot.</p>
      </div>
      <Alert>{error}</Alert>
      <Alert type="success">{success}</Alert>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-date" className="label">Desired date</label>
          <input id="wl-date" type="date" min={todayString()} className="input" value={desiredDate} onChange={(e) => setDesiredDate(e.target.value)} />
        </div>
        <div>
          <label htmlFor="wl-time" className="label">Preferred time (optional)</label>
          <input id="wl-time" type="time" className="input" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? 'Joining...' : 'Join waiting list'}
      </button>
    </form>
  );
}
