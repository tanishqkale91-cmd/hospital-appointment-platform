export default function DoctorFilters({ departments, filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  return (
    <div className="card mb-6 grid gap-4 md:grid-cols-3">
      <div>
        <label htmlFor="filter-search" className="label">Doctor name</label>
        <input id="filter-search" className="input" placeholder="Search by name" value={filters.search} onChange={set('search')} />
      </div>
      <div>
        <label htmlFor="filter-department" className="label">Department</label>
        <select id="filter-department" className="input" value={filters.department} onChange={set('department')}>
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-specialization" className="label">Specialization</label>
        <input id="filter-specialization" className="input" placeholder="e.g. Cardiologist" value={filters.specialization} onChange={set('specialization')} />
      </div>
    </div>
  );
}
