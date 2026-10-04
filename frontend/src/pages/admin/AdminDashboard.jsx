import { Link } from 'react-router-dom';
import * as adminApi from '../../api/adminApi';
import StatCard from '../../components/admin/StatCard';
import Alert from '../../components/common/Alert';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';

export default function AdminDashboard() {
  const { data: s, loading, error } = useFetch(() => adminApi.getStats());
  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;
  return (
    <div>
      <PageHeader title="Admin dashboard" subtitle="System overview" />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Patients" value={s.patients} tone="sky" />
        <StatCard label="Active doctors" value={s.doctors} tone="brand" />
        <StatCard label="Departments" value={s.departments} tone="emerald" />
        <StatCard label="Booked today" value={s.todayAppointments} tone="amber" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-semibold">Appointments</h2>
          <ul className="space-y-1 text-sm text-slate-600">
            <li className="flex justify-between"><span>Total</span><b>{s.appointments.total}</b></li>
            <li className="flex justify-between"><span>Booked</span><b>{s.appointments.booked || 0}</b></li>
            <li className="flex justify-between"><span>Completed</span><b>{s.appointments.completed || 0}</b></li>
            <li className="flex justify-between"><span>Cancelled</span><b>{s.appointments.cancelled || 0}</b></li>
          </ul>
          <Link to="/admin/appointments" className="btn-secondary btn-sm mt-4">View appointments</Link>
        </div>
        <div className="card">
          <h2 className="mb-3 font-semibold">Waiting list</h2>
          <ul className="space-y-1 text-sm text-slate-600">
            <li className="flex justify-between"><span>Total entries</span><b>{s.waitingList.total}</b></li>
            <li className="flex justify-between"><span>Waiting</span><b>{s.waitingList.waiting || 0}</b></li>
            <li className="flex justify-between"><span>Assigned</span><b>{s.waitingList.assigned || 0}</b></li>
            <li className="flex justify-between"><span>Cancelled</span><b>{s.waitingList.cancelled || 0}</b></li>
          </ul>
          <Link to="/admin/waiting-list" className="btn-secondary btn-sm mt-4">View waiting lists</Link>
        </div>
      </div>
    </div>
  );
}
