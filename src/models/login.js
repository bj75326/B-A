/**
 * Created by jibin on 2018/4/11.
 */
import {routerRedux} from 'dva/router';
import {fakeAccountLogin} from '../services/api';
import {setAuthority} from '../utils/authority';
import {reloadAuthorized} from '../utils/Authorized';
import LoginPage from '../routes/User/Login';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({payload}, {call, put}){
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if(response.status === 'ok'){
        reloadAuthorized();   
        yield put(routerRedux.push('/')); 
      }
    },
    *logout(_, {put, select}){
      try{
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        urlParams.searchParams.set('redirect', pathname); 
        window.history.replaceState(null, 'login', urlParams.href);     
      }finally{
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',    
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, {payload}){
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    }
  }
}
