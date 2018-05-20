
import mockjs from 'mockjs';
import {format, delay} from 'roadhog-api-doc';
import {getActivities, getNotice, getFakeList} from './mock/api';
import {getNotices, getNotices1} from './mock/notices';

//是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

const proxy = {
  'GET /api/currentUser': {
    $desc: '',
    $param: {
      pageSize: {
        desc: '分页',
        exp: 2
      },    
    },
    $body: {
      name: 'Bill Ji',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/avatar.jpg',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotices,
  'GET /api/activities': getActivities,
  
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if(password === '888888' && userName === 'admin'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return ;
    }
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return ;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/notices1': getNotices1,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

export default noProxy ? {} : delay(proxy, 1000);