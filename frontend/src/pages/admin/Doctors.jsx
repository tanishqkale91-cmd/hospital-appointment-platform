import { useState } from 'react';
import * as departmentApi from '../../api/departmentApi';
import * as doctorApi from '../../api/doctorApi';
import DataTable from '../../components/admin/DataTable';
import Alert from '../../components/common/Alert';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import useFetch from '../../hooks/useFetch';
import { doctorName, getErrorMessage } from '../../utils/format';
import { isValidEmail } from '../../utils/validation';

const blank = { name: '', email: '', password: '', departmentId: '', specialization: '', qualification: '', experience: 0, consultationFee: 0 };

export default function Doctors() {
  const { data, loading, error, reload } = useFetch(() => doctorApi.listDoctors({ includeInactive: 'true' }));
  const departments = useFetch(() => departmentApi.listDepartments());
  const [modal, setModal] = useState(null); // {} to create, { doctor } to edit
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const openCreate = () => { setForm(blank); setFormError(''); setModal({}); };
  const openEdit = (d) => {
    setForm({ name: d.user.name, specialization: d.specialization, qualification: d.qualification, experience: d.experience, consultationFee: d.consultationFee, departmentId: d.department?._id || '' });
    setFormError('');
    setModal({ doctor: d });
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const editing = modal.doctor;
    if (!form.name.trim()) return setFormError('Name is required');
    if (!editing && !isValidEmail(form.email)) return setFormError('Enter a valid email');
    if (!editing && form.password.length < 6) return setFormError('Password must be at least 6 characters');
    if (!form.departmentId) return setFormError('Select a department');
    if (!form.specialization.trim()) return setFormError('Specialization is required');
    const payload = { ...form, experience: Number(form.experience), consultationFee: Number(form.consultationFee) };
    setBusy(true);
    try {
      if (editing) await doctorApi.updateDoctor(editing._id, payload);
      else await doctorApi.createDoctor(payload);
      setModal(null);
      setMessage({ type: 'success', text: editing ? 'Doctor updated' : 'Doctor created' });
      reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (d) => {
    try {
      if (d.isActive) {
        if (!window.confirm(`Deactivate ${doctorName(d)}?`)) return;
        await doctorApi.deactivateDoctor(d._id);
      } else {
        await doctorApi.updateDoctor(d._id, { isActive: true });
      }
      setMessage({ type: 'success', text: `Doctor ${d.isActive ? 'deactivated' : 'activated'}` });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const columns = [
    { header: 'Doctor', render: (d) => <div><p className="font-medium">{doctorName(d)}</p><p className="text-xs text-slate-500">{d.user?.email}</p></div> },
    { header: 'Department', render: (d) => d.department?.name || '-' },
    { header: 'Specialization', render: (d) => d.specialization },
    { header: 'Experience', render: (d) => `${d.experience} yrs` },
    { header: 'Status', render: (d) => <StatusBadge status={d.isActive ? 'active' : 'inactive'} /> },
    {
      header: 'Actions',
      render: (d) => (
        <div className="flex gap-2">
          <button type="button" className="btn-secondary btn-sm" onClick={() => openEdit(d)}>Edit</button>
          <button type="button" className={`${d.isActive ? 'btn-danger' : 'btn-primary'} btn-sm`} onClick={() => toggle(d)}>{d.isActive ? 'Deactivate' : 'Activate'}</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Doctors" actions={<button type="button" id="add-doctor" className="btn-primary" onClick={openCreate}>Add doctor</button>} />
      <div className="mb-4 space-y-2">
        <Alert type={message.type || 'info'}>{message.text}</Alert>
        <Alert>{error}</Alert>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} rows={data || []} emptyTitle="No doctors yet" />}

      {modal && (
        <Modal title={modal.doctor ? 'Edit doctor' : 'Add doctor'} onClose={() => setModal(null)}>
          <form onSubmit={submit} className="space-y-3" noValidate>
            <Alert>{formError}</Alert>
            <FormField label="Full name" id="m-name"><input id="m-name" className="input" value={form.name} onChange={set('name')} /></FormField>
            {!modal.doctor && (
              <>
                <FormField label="Email" id="m-email"><input id="m-email" type="email" className="input" value={form.email} onChange={set('email')} /></FormField>
                <FormField label="Temporary password" id="m-password"><input id="m-password" type="password" className="input" value={form.password} onChange={set('password')} /></FormField>
              </>
            )}
            <FormField label="Department" id="m-dept">
              <select id="m-dept" className="input" value={form.departmentId} onChange={set('departmentId')}>
                <option value="">Select department</option>
                {(departments.data || []).map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </FormField>
            <FormField label="Specialization" id="m-spec"><input id="m-spec" className="input" value={form.specialization} onChange={set('specialization')} /></FormField>
            <FormField label="Qualification" id="m-qual"><input id="m-qual" className="input" value={form.qualification} onChange={set('qualification')} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Experience (yrs)" id="m-exp"><input id="m-exp" type="number" min="0" className="input" value={form.experience} onChange={set('experience')} /></FormField>
              <FormField label="Fee (₹)" id="m-fee"><input id="m-fee" type="number" min="0" className="input" value={form.consultationFee} onChange={set('consultationFee')} /></FormField>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" id="save-doctor" className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
