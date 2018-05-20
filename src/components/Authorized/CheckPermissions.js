/**
 * Created by jibin on 2018/3/9.
 */

import React from 'react';
import PromiseRender from './PromiseRender';
import {current} from './index';
import {Spin} from 'antd';

function isPromise(obj){
  return (
    !!obj &&
    (typeof obj === 'object') &&
    (typeof obj.then === 'function')
  );
}

class AuthorizedPromise extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentAuthority: null
    };
  }

  componentDidMount(){
    this.props.promise.then(authority => {
      this.setState({
        currentAuthority: authority
      });
    }).catch(error => {
      //todo 获取当前权限失败
    });
  }

  render(){
    const {currentAuthority} = this.state;
    const {authority, target, Exception} = this.props;
    return currentAuthority ? (
      checkPermissions(authority, currentAuthority, target, Exception)
    ) : (
      <div style={{
        width: '100%',
        height: '100%',
        margin: 'auto',
        paddingTop: 50,
        textAlign: 'center'
      }}>
        <Spin size="large"/>
      </div>
    );
  }
}

/**
 * 通用权限检测方法
 * @param { 权限判定标准 type: string | array | Promise | Function } authority
 * @param { 当前权限 type: string } currentAuthority
 * @param { 权限检测通过渲染的组件 } target
 * @param { 权限检测未过渲染的组件 } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  //没有权限判定标准，默认通过
  if(!authority){
    return target;
  }

  //权限判定标准的数据类型为数组array
  if(Array.isArray(authority)){
    if(authority.indexOf(currentAuthority) >= 0){
      return target;
    }
    return Exception;
  }

  //权限判定标准的数据类型为字符串string
  if(typeof authority === 'string'){
    if(authority === currentAuthority){
      return target;
    }
    return Exception;
  }

  //权限判定标准的数据类型为Promise实例
  if(isPromise(authority)){
    return <PromiseRender ok={target} error={Exception} promise={authority}/>;
  }

  //权限判定标准的数据类型为函数function
  if(typeof authority === 'function'){
    try{
      const bool = authority(currentAuthority);
      if(bool){
        return target;
      }
      return Exception;
    }catch(error){
      throw error;
    }
  }

  throw new Error('checkPermissions occurred unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, Exception) => {

  if(isPromise(current.authority)){
    return <AuthorizedPromise promise={current.authority} authority={authority} target={target} Exception={Exception}/>
  }
  return checkPermissions(authority, current.authority, target, Exception);
};

export default check;
