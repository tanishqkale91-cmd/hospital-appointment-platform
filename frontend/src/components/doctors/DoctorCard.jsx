import { Link } from 'react-router-dom';
import { doctorName } from '../../utils/format';

export default function DoctorCard({ doctor }) {
  const initials = (doctor.user?.name || 'D').replace(/^Dr\.?\s*/i, '').slice(0, 1).toUpperCase();
  return (
    <div className="card flex flex-col transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">{initials}</div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{doctorName(doctor)}</h3>
          <p className="truncate text-sm text-brand-700">{doctor.specialization}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-1 text-sm text-slate-600">
        <div className="flex justify-between"><dt>Department</dt><dd>{doctor.department?.name || '-'}</dd></div>
        <div className="flex justify-between"><dt>Experience</dt><dd>{doctor.experience} yrs</dd></div>
        <div className="flex justify-between"><dt>Fee</dt><dd>{doctor.consultationFee ? `₹${doctor.consultationFee}` : 'Free / N/A'}</dd></div>
      </dl>
      <Link to={`/patient/doctors/${doctor._id}`} className="btn-primary mt-4">
        View profile &amp; slots
      </Link>
    </div>
  );
}
