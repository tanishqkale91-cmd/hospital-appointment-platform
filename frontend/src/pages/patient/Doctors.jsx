import { useEffect, useState } from 'react';
import * as departmentApi from '../../api/departmentApi';
import * as doctorApi from '../../api/doctorApi';
import DoctorCard from '../../components/doctors/DoctorCard';
import DoctorFilters from '../../components/doctors/DoctorFilters';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import useFetch from '../../hooks/useFetch';

export default function Doctors() {
  const [filters, setFilters] = useState({ search: '', department: '', specialization: '' });
  const [debounced, setDebounced] = useState(filters);
  const departments = useFetch(() => departmentApi.listDepartments());

  // Wait briefly after typing before hitting the API.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(filters), 300);
    return () => clearTimeout(t);
  }, [filters]);

  const params = Object.fromEntries(Object.entries(debounced).filter(([, v]) => v));
  const doctors = useFetch(() => doctorApi.listDoctors(params), [JSON.stringify(params)]);

  return (
    <div>
      <PageHeader title="Find a doctor" subtitle="Filter by department or specialization, then pick a slot" />
      <DoctorFilters departments={departments.data || []} filters={filters} onChange={setFilters} />
      <Alert>{doctors.error}</Alert>
      {doctors.loading ? (
        <Spinner />
      ) : doctors.data?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.data.map((d) => (
            <DoctorCard key={d._id} doctor={d} />
          ))}
        </div>
      ) : (
        <EmptyState title="No doctors found" message="Try changing or clearing the filters." />
      )}
    </div>
  );
}
