import {queryFakeTickets, queryFakeTaskStaistics} from '../services/api';

export default {
  namespace: 'task',

  state: {
    all: 0,
    finished: 0,
    holded: 0,
    terminated: 0,

    tickets: [],
    pagination: {},
  },

  effects: {
    *fetchTaskStaistics(_, {call, put}){
      const response = yield call(queryFakeTaskStaistics);
      yield put({
        type: 'saveTaskStaistics',
        payload: response,
      });
    },

    *fetch({payload}, {call, put}){
      const response = yield call(queryFakeTickets, payload);
      yield put({
        type: 'saveTickets',
        payload: response,
      });
    }, 
  },

  reducers: {
    saveTickets(state, action){
      return {
        ...state,
        ...action.payload,
      };
    },

    saveTaskStaistics(state, action){
      return {
        ...state,
        ...action.payload,
      };
    }
  }
}