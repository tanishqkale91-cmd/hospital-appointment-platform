const pad = (n) => String(n).padStart(2, '0');

/** Today's local date as YYYY-MM-DD. */
export const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const nowTimeString = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** "2025-01-10" -> "Fri, 10 Jan 2025" (parsed as local date, no timezone shift). */
export const formatDate = (s) => {
  if (!s) return '-';
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (t) => {
  if (!t) return '-';
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${pad(m)} ${suffix}`;
};

export const doctorName = (doctor) => (doctor?.user?.name ? `Dr. ${doctor.user.name.replace(/^Dr\.?\s*/i, '')}` : 'Doctor');

/** Extract a readable message from an Axios error. */
export const getErrorMessage = (err) =>
  err?.response?.data?.message || (err?.request ? 'Cannot reach the server. Is the API running?' : err?.message) || 'Something went wrong';

/** True when the date/time combination is not in the future. */
export const isPastValue = (date, time) => {
  const today = todayString();
  return date < today || (date === today && time <= nowTimeString());
};
