import request from '../utils/request';

export async function queryNotices(){
  return request('/api/notices');
};

export async function fakeAccountLogin(params){
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
};