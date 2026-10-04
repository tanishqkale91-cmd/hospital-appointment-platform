import { Link } from 'react-router-dom';
import DataTable from '../admin/DataTable';
import StatusBadge from '../common/StatusBadge';
import { doctorName, formatDate, formatTime } from '../../utils/format';

/**
 * Appointment table for all roles.
 * role: 'patient' | 'doctor' | 'admin' decides the "who" column and detail link.
 * renderActions(appointment) can add extra buttons.
 */
export default function AppointmentList({ appointments, role, renderActions }) {
  const columns = [
    { header: 'Date', render: (a) => formatDate(a.date) },
    { header: 'Time', render: (a) => `${formatTime(a.startTime)} - ${formatTime(a.endTime)}` },
    role === 'patient'
      ? { header: 'Doctor', render: (a) => (
          <div>
            <p className="font-medium">{doctorName(a.doctor)}</p>
            <p className="text-xs text-slate-500">{a.doctor?.specialization}</p>
          </div>
        ) }
      : { header: 'Patient', render: (a) => (
          <div>
            <p className="font-medium">{a.patient?.name}</p>
            <p className="text-xs text-slate-500">{a.patient?.email}</p>
          </div>
        ) },
    ...(role === 'admin' ? [{ header: 'Doctor', render: (a) => doctorName(a.doctor) }] : []),
    { header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    {
      header: 'Actions',
      render: (a) => (
        <div className="flex flex-wrap gap-2">
          {role !== 'admin' && (
            <Link className="btn-secondary btn-sm" to={`/${role}/appointments/${a._id}`}>Details</Link>
          )}
          {renderActions?.(a)}
        </div>
      ),
    },
  ];
  return <DataTable columns={columns} rows={appointments} emptyTitle="No appointments found" />;
}
