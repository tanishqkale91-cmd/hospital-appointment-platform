import { useEffect, useState } from 'react';
import * as doctorApi from '../../api/doctorApi';
import Alert from '../../components/common/Alert';
import FormField from '../../components/common/FormField';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import { getErrorMessage } from '../../utils/format';

export default function Profile() {
  const [form, setForm] = useState(null);
  const [meta, setMeta] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    doctorApi.getMyDoctorProfile().then((res) => {
      const d = res.data;
      setMeta({ email: d.user.email, department: d.department?.name });
      setForm({
        name: d.user.name, phone: d.user.phone || '', specialization: d.specialization, qualification: d.qualification,
        experience: d.experience, consultationFee: d.consultationFee, bio: d.bio,
      });
    }).catch((err) => setMessage({ type: 'error', text: getErrorMessage(err) }));
  }, []);

  if (!form) return message.text ? <Alert>{message.text}</Alert> : <Spinner />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!form.name.trim()) return setMessage({ type: 'error', text: 'Name is required' });
    if (!form.specialization.trim()) return setMessage({ type: 'error', text: 'Specialization is required' });
    if (Number(form.experience) < 0 || Number(form.experience) > 70) return setMessage({ type: 'error', text: 'Experience must be between 0 and 70' });
    if (Number(form.consultationFee) < 0) return setMessage({ type: 'error', text: 'Fee cannot be negative' });
    setBusy(true);
    try {
      await doctorApi.updateMyDoctorProfile({ ...form, experience: Number(form.experience), consultationFee: Number(form.consultationFee) });
      setMessage({ type: 'success', text: 'Profile updated' });
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Doctor profile" subtitle={`${meta.email} · ${meta.department || ''}`} />
      <form onSubmit={submit} className="card grid gap-4 sm:grid-cols-2" noValidate>
        <div className="sm:col-span-2"><Alert type={message.type || 'info'}>{message.text}</Alert></div>
        <FormField label="Full name" id="d-name"><input id="d-name" className="input" value={form.name} onChange={set('name')} /></FormField>
        <FormField label="Phone" id="d-phone"><input id="d-phone" className="input" value={form.phone} onChange={set('phone')} /></FormField>
        <FormField label="Specialization" id="d-spec"><input id="d-spec" className="input" value={form.specialization} onChange={set('specialization')} /></FormField>
        <FormField label="Qualification" id="d-qual"><input id="d-qual" className="input" value={form.qualification} onChange={set('qualification')} /></FormField>
        <FormField label="Experience (years)" id="d-exp"><input id="d-exp" type="number" min="0" max="70" className="input" value={form.experience} onChange={set('experience')} /></FormField>
        <FormField label="Consultation fee (₹)" id="d-fee"><input id="d-fee" type="number" min="0" className="input" value={form.consultationFee} onChange={set('consultationFee')} /></FormField>
        <div className="sm:col-span-2"><FormField label="Bio" id="d-bio"><textarea id="d-bio" rows={3} className="input" value={form.bio} onChange={set('bio')} /></FormField></div>
        <div className="sm:col-span-2"><button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button></div>
      </form>
    </div>
  );
}
