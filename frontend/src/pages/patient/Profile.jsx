import { useEffect, useState } from 'react';
import * as patientApi from '../../api/patientApi';
import Alert from '../../components/common/Alert';
import FormField from '../../components/common/FormField';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage, todayString } from '../../utils/format';

export default function Profile() {
  const { setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    patientApi.getPatientProfile().then((res) => {
      const { name, phone, dateOfBirth, gender, bloodGroup, address } = res.data;
      setEmail(res.data.email);
      setForm({ name, phone, dateOfBirth, gender, bloodGroup, address });
    }).catch((err) => setMessage({ type: 'error', text: getErrorMessage(err) }));
  }, []);

  if (!form) return message.text ? <Alert>{message.text}</Alert> : <Spinner />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!form.name.trim()) return setMessage({ type: 'error', text: 'Name is required' });
    if (form.dateOfBirth && form.dateOfBirth > todayString()) return setMessage({ type: 'error', text: 'Date of birth cannot be in the future' });
    setBusy(true);
    try {
      const res = await patientApi.updatePatientProfile(form);
      setUser(res.data);
      setMessage({ type: 'success', text: 'Profile updated' });
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="My profile" />
      <form onSubmit={submit} className="card grid gap-4 sm:grid-cols-2" noValidate>
        <div className="sm:col-span-2"><Alert type={message.type || 'info'}>{message.text}</Alert></div>
        <FormField label="Full name" id="p-name"><input id="p-name" className="input" value={form.name} onChange={set('name')} /></FormField>
        <FormField label="Email" id="p-email"><input id="p-email" className="input bg-slate-100" value={email} disabled /></FormField>
        <FormField label="Phone" id="p-phone"><input id="p-phone" className="input" value={form.phone} onChange={set('phone')} /></FormField>
        <FormField label="Date of birth" id="p-dob"><input id="p-dob" type="date" max={todayString()} className="input" value={form.dateOfBirth} onChange={set('dateOfBirth')} /></FormField>
        <FormField label="Gender" id="p-gender">
          <select id="p-gender" className="input" value={form.gender} onChange={set('gender')}>
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FormField>
        <FormField label="Blood group" id="p-blood"><input id="p-blood" className="input" value={form.bloodGroup} onChange={set('bloodGroup')} /></FormField>
        <div className="sm:col-span-2"><FormField label="Address" id="p-address"><textarea id="p-address" rows={2} className="input" value={form.address} onChange={set('address')} /></FormField></div>
        <div className="sm:col-span-2"><button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button></div>
      </form>
    </div>
  );
}
