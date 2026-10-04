import { Link, useParams } from 'react-router-dom';
import * as availabilityApi from '../../api/availabilityApi';
import * as doctorApi from '../../api/doctorApi';
import WaitingListForm from '../../components/appointments/WaitingListForm';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';
import { doctorName, formatDate, formatTime } from '../../utils/format';

export default function DoctorDetails() {
  const { id } = useParams();
  const doctor = useFetch(() => doctorApi.getDoctor(id), [id]);
  const availability = useFetch(() => availabilityApi.getDoctorAvailability(id), [id]);

  if (doctor.loading) return <Spinner />;
  if (doctor.error) return <Alert>{doctor.error}</Alert>;
  const d = doctor.data;
  const windows = availability.data || [];
  const anyFree = windows.some((w) => w.availableSlots > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title={doctorName(d)}
        subtitle={`${d.specialization} · ${d.department?.name || ''}`}
        actions={<Link to="/patient/doctors" className="btn-secondary">Back to doctors</Link>}
      />
      <div className="card grid gap-4 sm:grid-cols-3">
        <div><p className="text-xs uppercase text-slate-400">Qualification</p><p className="font-medium">{d.qualification || '-'}</p></div>
        <div><p className="text-xs uppercase text-slate-400">Experience</p><p className="font-medium">{d.experience} years</p></div>
        <div><p className="text-xs uppercase text-slate-400">Consultation fee</p><p className="font-medium">{d.consultationFee ? `₹${d.consultationFee}` : 'N/A'}</p></div>
        {d.bio && <p className="text-sm text-slate-600 sm:col-span-3">{d.bio}</p>}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming availability</h2>
          <Link to={`/patient/doctors/${id}/slots`} className="btn-primary btn-sm" id="view-slots">View available slots</Link>
        </div>
        <Alert>{availability.error}</Alert>
        {availability.loading ? (
          <Spinner />
        ) : windows.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {windows.map((w) => (
              <Link key={w._id} to={`/patient/doctors/${id}/slots?date=${w.date}`} className="card transition hover:border-brand-500">
                <p className="font-medium">{formatDate(w.date)}</p>
                <p className="text-sm text-slate-500">{formatTime(w.startTime)} - {formatTime(w.endTime)}</p>
                <p className={`mt-2 text-sm font-medium ${w.availableSlots ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {w.availableSlots ? `${w.availableSlots} slot(s) free` : 'Fully booked'}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="No availability published" message="This doctor has not opened any slots yet. You can join the waiting list below." />
        )}
      </section>

      {!availability.loading && !anyFree && <WaitingListForm doctorId={id} />}
    </div>
  );
}
