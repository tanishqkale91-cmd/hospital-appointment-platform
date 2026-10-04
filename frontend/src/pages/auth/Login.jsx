import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import AuthShell from '../../components/common/AuthShell';
import FormField from '../../components/common/FormField';
import { homeFor } from '../../components/common/ProtectedRoute';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/format';
import { isValidEmail } from '../../utils/validation';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    setApiError('');
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const u = await login(form);
      navigate(homeFor(u.role), { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to MediSlot">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Alert>{apiError}</Alert>
        <FormField label="Email" id="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" className={`input ${errors.email ? 'input-error' : ''}`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Password" id="password" error={errors.password}>
          <input id="password" type="password" autoComplete="current-password" className={`input ${errors.password ? 'input-error' : ''}`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </FormField>
        <button type="submit" id="login-submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        New here? <Link to="/register" className="font-medium text-brand-700 hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
