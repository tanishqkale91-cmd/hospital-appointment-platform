import api, { unwrap } from './axios';

export const getPatientProfile = () => unwrap(api.get('/patients/profile'));
export const updatePatientProfile = (body) => unwrap(api.put('/patients/profile', body));
export const getPatientHistory = () => unwrap(api.get('/patients/history'));
