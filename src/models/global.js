/**
 * Created by jibin on 2018/2/7.
 */
import {queryNotices} from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: []
  },

  effects: {
    *fetchNotices(_, {call, put}){
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });      
    },
    
    *clearNotices({payload}, {put, select}){

    }
  },

  reducers: {
    changeLayoutCollapsed(state, {payload}){
      return {
        ...state,
        collapsed: payload
      };
    },
    saveNotices(state, {payload}){
      return {
        ...state,
        notices: payload
      };
    },
    
  }
};
