import api, { unwrap } from './axios';

export const listDepartments = () => unwrap(api.get('/departments'));
export const listAllDepartments = () => unwrap(api.get('/departments/all'));
export const createDepartment = (body) => unwrap(api.post('/departments', body));
export const updateDepartment = (id, body) => unwrap(api.put(`/departments/${id}`, body));
export const deactivateDepartment = (id) => unwrap(api.delete(`/departments/${id}`));
