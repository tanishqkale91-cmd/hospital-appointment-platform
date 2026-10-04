import { useState } from 'react';
import * as availabilityApi from '../../api/availabilityApi';
import DataTable from '../../components/admin/DataTable';
import Alert from '../../components/common/Alert';
import FormField from '../../components/common/FormField';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';
import { formatDate, formatTime, getErrorMessage, todayString } from '../../utils/format';
import { validateAvailability } from '../../utils/validation';

const emptyForm = { date: '', startTime: '09:00', endTime: '12:00', slotDuration: 30 };

export default function AvailabilityManagement() {
  const { data, loading, error, reload } = useFetch(() => availabilityApi.getMyAvailability({ from: todayString() }));
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const reset = () => { setForm(emptyForm); setEditingId(null); setErrors({}); };

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const errs = validateAvailability(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const payload = { ...form, slotDuration: Number(form.slotDuration) };
    setBusy(true);
    try {
      if (editingId) await availabilityApi.updateAvailability(editingId, payload);
      else await availabilityApi.createAvailability(payload);
      setMessage({ type: 'success', text: editingId ? 'Availability updated' : 'Availability added' });
      reset();
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Remove availability on ${formatDate(a.date)}?`)) return;
    try {
      await availabilityApi.removeAvailability(a._id);
      setMessage({ type: 'success', text: 'Availability removed' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const edit = (a) => {
    setEditingId(a._id);
    setForm({ date: a.date, startTime: a.startTime, endTime: a.endTime, slotDuration: a.slotDuration });
    setErrors({});
  };

  const columns = [
    { header: 'Date', render: (a) => formatDate(a.date) },
    { header: 'Window', render: (a) => `${formatTime(a.startTime)} - ${formatTime(a.endTime)}` },
    { header: 'Slot length', render: (a) => `${a.slotDuration} min` },
    {
      header: 'Actions',
      render: (a) => (
        <div className="flex gap-2">
          <button type="button" className="btn-secondary btn-sm" onClick={() => edit(a)}>Edit</button>
          <button type="button" className="btn-danger btn-sm" onClick={() => remove(a)}>Remove</button>
        </div>
      ),
    },
  ];
  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <div>
      <PageHeader title="Availability" subtitle="Publish the windows in which patients can book you" />
      <form onSubmit={submit} className="card mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" noValidate id="availability-form">
        <FormField label="Date" id="a-date" error={errors.date}>
          <input id="a-date" type="date" min={todayString()} className={cls('date')} value={form.date} onChange={set('date')} />
        </FormField>
        <FormField label="Start time" id="a-start" error={errors.startTime}>
          <input id="a-start" type="time" className={cls('startTime')} value={form.startTime} onChange={set('startTime')} />
        </FormField>
        <FormField label="End time" id="a-end" error={errors.endTime}>
          <input id="a-end" type="time" className={cls('endTime')} value={form.endTime} onChange={set('endTime')} />
        </FormField>
        <FormField label="Slot (minutes)" id="a-dur" error={errors.slotDuration}>
          <input id="a-dur" type="number" min="10" max="120" step="5" className={cls('slotDuration')} value={form.slotDuration} onChange={set('slotDuration')} />
        </FormField>
        <div className="flex items-end gap-2">
          <button type="submit" id="save-availability" className="btn-primary" disabled={busy}>{editingId ? 'Update' : 'Add window'}</button>
          {editingId && <button type="button" className="btn-secondary" onClick={reset}>Cancel</button>}
        </div>
      </form>
      <div className="mb-4 space-y-2">
        <Alert type={message.type || 'info'}>{message.text}</Alert>
        <Alert>{error}</Alert>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} rows={data || []} emptyTitle="No upcoming availability" emptyMessage="Add a window above so patients can book." />}
    </div>
  );
}
