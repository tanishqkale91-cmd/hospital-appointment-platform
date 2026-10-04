import api, { unwrap } from './axios';

export const getMyAvailability = (params) => unwrap(api.get('/availability/me', { params }));
export const createAvailability = (body) => unwrap(api.post('/availability', body));
export const updateAvailability = (id, body) => unwrap(api.put(`/availability/${id}`, body));
export const removeAvailability = (id) => unwrap(api.delete(`/availability/${id}`));
export const getDoctorAvailability = (doctorId, params) => unwrap(api.get(`/availability/doctor/${doctorId}`, { params }));
export const getDoctorSlots = (doctorId, date) => unwrap(api.get(`/availability/doctor/${doctorId}/slots`, { params: { date } }));
