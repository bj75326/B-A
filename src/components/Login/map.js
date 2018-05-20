import React from 'react';
import {Input} from 'antd';

import './index.css';

const map = {
  UserName: {
    component: Input,
    props: {
      //size: 'large',
      prefix: <i className={`iconfont icon-geren`}/>,
      placeholder: 'admin',
    },
    rules: [{
      required: true, message: 'User name required.',
    }],
  },
  Password: {
    component: Input,
    props: {
      //size: 'large',
      prefix: <i className={`iconfont icon-password`}/>,
      placeholder: '888888',
      type: 'password',
    },
    rules: [{
      required: true, message: 'Password required.',
    }],
  },
  Mobile: {
    component: Input,
    props: {
      //size: 'large',
      prefix: <i className={`iconfont icon-mobile`}/>,
      placeholder: 'mobile phone',
    },
    rules: [{
      required: true, message: 'Mobile phone number required.',
    }, {
      pattern: /^1\d{10}$/, message: 'Invaild phone number.',
    }],
  },
  Captcha: {
    component: Input,
    props: {
      //size: 'large',
      prefix: <i className={`iconfont icon-youxiang`}/>,
      placeholder: 'captcha'
    },
    rules: [{
      required: true, message: 'Captcha required.',
    }],
  }
};

export default map;