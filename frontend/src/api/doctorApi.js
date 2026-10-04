import api, { unwrap } from './axios';

export const listDoctors = (params) => unwrap(api.get('/doctors', { params }));
export const getDoctor = (id) => unwrap(api.get(`/doctors/${id}`));
export const createDoctor = (body) => unwrap(api.post('/doctors', body));
export const updateDoctor = (id, body) => unwrap(api.put(`/doctors/${id}`, body));
export const deactivateDoctor = (id) => unwrap(api.delete(`/doctors/${id}`));
export const getMyDoctorProfile = () => unwrap(api.get('/doctors/me/profile'));
export const updateMyDoctorProfile = (body) => unwrap(api.put('/doctors/me/profile', body));
export const getMyDoctorAppointments = (params) => unwrap(api.get('/doctors/me/appointments', { params }));
