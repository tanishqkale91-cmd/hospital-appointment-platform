import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import * as departmentApi from '../../api/departmentApi';
import Alert from '../../components/common/Alert';
import AuthShell from '../../components/common/AuthShell';
import FormField from '../../components/common/FormField';
import { homeFor } from '../../components/common/ProtectedRoute';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/format';
import { isValidEmail } from '../../utils/validation';

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', role: 'patient', phone: '', departmentId: '', specialization: '',
  });
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setDepartmentsLoading(true);
    setDepartmentsError('');
    try {
      const res = await departmentApi.listDepartments();
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setDepartments(list);
    } catch (err) {
      setDepartmentsError(getErrorMessage(err) || 'Failed to load departments');
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const isDoctor = form.role === 'doctor';

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match';
    if (isDoctor && !form.departmentId) next.departmentId = 'Select a department';
    if (isDoctor && !form.specialization.trim()) next.specialization = 'Specialization is required';
    setErrors(next);
    setApiError('');
    if (Object.keys(next).length) return;

    const { confirm, ...payload } = form;
    if (!isDoctor) {
      delete payload.departmentId;
      delete payload.specialization;
    }
    setBusy(true);
    try {
      const u = await register(payload);
      navigate(homeFor(u.role), { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const cls = (k) => `input ${errors[k] ? 'input-error' : ''}`;

  return (
    <AuthShell title="Create your account" subtitle="Book appointments or manage your practice">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Alert>{apiError}</Alert>
        <FormField label="I am a" id="role">
          <select id="role" className="input" value={form.role} onChange={set('role')}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </FormField>
        <FormField label="Full name" id="name" error={errors.name}>
          <input id="name" className={cls('name')} value={form.name} onChange={set('name')} />
        </FormField>
        <FormField label="Email" id="email" error={errors.email}>
          <input id="email" type="email" className={cls('email')} value={form.email} onChange={set('email')} />
        </FormField>
        <FormField label="Phone (optional)" id="phone">
          <input id="phone" className="input" value={form.phone} onChange={set('phone')} />
        </FormField>
        {isDoctor && (
          <>
            <FormField label="Department" id="departmentId" error={errors.departmentId}>
              {departmentsLoading ? (
                <select id="departmentId" className="input text-slate-400" disabled>
                  <option value="">Loading departments...</option>
                </select>
              ) : departmentsError ? (
                <div className="space-y-1">
                  <select id="departmentId" className="input input-error" disabled>
                    <option value="">Error loading departments</option>
                  </select>
                  <p className="text-xs text-rose-600 flex items-center justify-between">
                    <span>{departmentsError}</span>
                    <button
                      type="button"
                      onClick={fetchDepartments}
                      className="font-medium text-brand-700 underline hover:text-brand-800 ml-2"
                    >
                      Retry
                    </button>
                  </p>
                </div>
              ) : departments.length === 0 ? (
                <div className="space-y-1">
                  <select id="departmentId" className="input input-error" disabled>
                    <option value="">No departments available</option>
                  </select>
                  <p className="text-xs text-amber-600">
                    No active departments found. Please contact an administrator.
                  </p>
                </div>
              ) : (
                <select
                  id="departmentId"
                  className={cls('departmentId')}
                  value={form.departmentId}
                  onChange={set('departmentId')}
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              )}
            </FormField>
            <FormField label="Specialization" id="specialization" error={errors.specialization}>
              <input id="specialization" className={cls('specialization')} value={form.specialization} onChange={set('specialization')} />
            </FormField>
          </>
        )}
        <FormField label="Password" id="password" error={errors.password}>
          <input id="password" type="password" autoComplete="new-password" className={cls('password')} value={form.password} onChange={set('password')} />
        </FormField>
        <FormField label="Confirm password" id="confirm" error={errors.confirm}>
          <input id="confirm" type="password" autoComplete="new-password" className={cls('confirm')} value={form.confirm} onChange={set('confirm')} />
        </FormField>
        <button type="submit" id="register-submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Already registered? <Link to="/login" className="font-medium text-brand-700 hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
