import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import * as availabilityApi from '../../api/availabilityApi';
import * as doctorApi from '../../api/doctorApi';
import SlotGrid from '../../components/appointments/SlotGrid';
import WaitingListForm from '../../components/appointments/WaitingListForm';
import Alert from '../../components/common/Alert';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';
import { doctorName, formatDate, todayString } from '../../utils/format';

export default function AvailableSlots() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [date, setDate] = useState(params.get('date') || todayString());
  const doctor = useFetch(() => doctorApi.getDoctor(id), [id]);
  const slots = useFetch(() => availabilityApi.getDoctorSlots(id, date), [id, date], { enabled: Boolean(date) });
  const upcoming = useFetch(() => availabilityApi.getDoctorAvailability(id), [id]);

  useEffect(() => {
    if (date) setParams({ date }, { replace: true });
  }, [date, setParams]);

  const list = slots.data || [];
  const hasFree = list.some((s) => s.available);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Available slots"
        subtitle={doctor.data ? `${doctorName(doctor.data)} · ${doctor.data.specialization}` : ''}
        actions={<Link to={`/patient/doctors/${id}`} className="btn-secondary">Doctor profile</Link>}
      />
      <div className="card space-y-4">
        <div className="max-w-xs">
          <label htmlFor="slot-date" className="label">Choose a date</label>
          <input id="slot-date" type="date" min={todayString()} className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        {upcoming.data?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {[...new Set(upcoming.data.map((w) => w.date))].slice(0, 7).map((d) => (
              <button key={d} type="button" onClick={() => setDate(d)} className={`rounded-full border px-3 py-1 text-xs ${d === date ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-500'}`}>
                {formatDate(d)}
              </button>
            ))}
          </div>
        )}
      </div>

      <Alert>{slots.error}</Alert>
      {slots.loading ? (
        <Spinner />
      ) : !slots.error && (
        <>
          {list.length === 0 ? (
            <Alert type="info">The doctor has no availability on {formatDate(date)}.</Alert>
          ) : (
            <div className="card">
              <h2 className="mb-3 font-semibold">{formatDate(date)}</h2>
              <SlotGrid
                slots={list}
                onSelect={(s) => navigate(`/patient/doctors/${id}/book?date=${date}&time=${s.startTime}`)}
              />
            </div>
          )}
          {!hasFree && date >= todayString() && <WaitingListForm key={date} doctorId={id} defaultDate={date} />}
        </>
      )}
    </div>
  );
}
