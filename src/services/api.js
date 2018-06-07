import request from '../utils/request';
import {stringify} from 'qs';

export async function queryNotices(){
  return request('/api/notices');
};

export async function fakeAccountLogin(params){
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
};

export async function queryFakeTickets(params){
  return request(`/api/fake_tickets?${stringify(params)}`);
};

export async function queryFakeTaskStaistics(){
  return request('/api/fake_task_staistics');
};