import api, { unwrap } from './axios';

export const getStats = () => unwrap(api.get('/users/stats'));
export const listPatients = (params) => unwrap(api.get('/patients', { params }));
export const updateUser = (id, body) => unwrap(api.put(`/users/${id}`, body));
