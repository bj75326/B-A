import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs} from 'antd';

const {TabPane} = Tabs;

const generateId = (() => {
  let i = 0;
  return (prefix = '') => {
    i += 1; 
    return `${prefix}${i}`;
  };
})();

export default class LoginTab extends Component {
  constructor(props){
    super(props);
    this.uniqueId = generateId('login-tab-');
  }

  static contextTypes = {
    tabUtils: PropTypes.object,
  };

  static _BA_LOGIN_TAB = true;

  componentWillMount(){
    if(this.context.tabUtil){
      this.context.tabUtil.addTab(this.uniqueId);
    }
  }

  render(){
    return <TabPane {...this.props}/>
  }
}