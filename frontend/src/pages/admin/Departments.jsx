import { useState } from 'react';
import * as departmentApi from '../../api/departmentApi';
import DataTable from '../../components/admin/DataTable';
import Alert from '../../components/common/Alert';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';
import useFetch from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/format';

export default function Departments() {
  const { data, loading, error, reload } = useFetch(() => departmentApi.listAllDepartments());
  const [modal, setModal] = useState(null); // {} to create, { department } to edit
  const [form, setForm] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const openCreate = () => { setForm({ name: '', description: '' }); setFormError(''); setModal({}); };
  const openEdit = (d) => { setForm({ name: d.name, description: d.description }); setFormError(''); setModal({ department: d }); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError('Department name is required');
    setBusy(true);
    try {
      if (modal.department) await departmentApi.updateDepartment(modal.department._id, form);
      else await departmentApi.createDepartment(form);
      setModal(null);
      setMessage({ type: 'success', text: modal.department ? 'Department updated' : 'Department created' });
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
        if (!window.confirm(`Deactivate ${d.name}?`)) return;
        await departmentApi.deactivateDepartment(d._id);
      } else {
        await departmentApi.updateDepartment(d._id, { isActive: true });
      }
      setMessage({ type: 'success', text: `Department ${d.isActive ? 'deactivated' : 'activated'}` });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  const columns = [
    { header: 'Name', render: (d) => <span className="font-medium">{d.name}</span> },
    { header: 'Description', render: (d) => d.description || '-' },
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
      <PageHeader title="Departments" actions={<button type="button" id="add-department" className="btn-primary" onClick={openCreate}>Add department</button>} />
      <div className="mb-4 space-y-2">
        <Alert type={message.type || 'info'}>{message.text}</Alert>
        <Alert>{error}</Alert>
      </div>
      {loading ? <Spinner /> : <DataTable columns={columns} rows={data || []} emptyTitle="No departments yet" />}
      {modal && (
        <Modal title={modal.department ? 'Edit department' : 'Add department'} onClose={() => setModal(null)}>
          <form onSubmit={submit} className="space-y-3" noValidate>
            <Alert>{formError}</Alert>
            <FormField label="Name" id="dep-name"><input id="dep-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
            <FormField label="Description" id="dep-desc"><textarea id="dep-desc" rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button type="submit" id="save-department" className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
