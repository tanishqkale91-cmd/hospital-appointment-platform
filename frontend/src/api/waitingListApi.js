import api, { unwrap } from './axios';

export const joinWaitingList = (body) => unwrap(api.post('/waiting-list', body));
export const getMyWaitingList = () => unwrap(api.get('/waiting-list/my'));
export const listWaitingList = (params) => unwrap(api.get('/waiting-list', { params }));
export const cancelWaitingEntry = (id) => unwrap(api.delete(`/waiting-list/${id}`));
