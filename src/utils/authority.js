/**
 * Created by jibin on 2018/3/9.
 */

//暂时使用setTimeout模拟异步获取authority, 用localStorage存储authority
/*
export const getAuthority = () => new Promise(resolve => {
  setTimeout(()=>{
    resolve(localStorage.getItem('ba-authority') || 'admin');
  }, 1000);
});

export const setAuthority = authority => new Promise(resolve => {
  setTimeout(() => {
    localStorage.setItem('ba-authority', authority);
    resolve(authority);
  }, 1000);
});
*/

export const getAuthority = () => {
  return localStorage.getItem('ba-authority') || 'guest';
};

export const setAuthority = (authority) => {
  return localStorage.setItem('ba-authority', authority);
};