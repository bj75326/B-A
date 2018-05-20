/**
 * Created by jibin on 2018/4/11.
 */
import React, {Component} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import Login from '../../components/Login';
import {Checkbox, Alert} from 'antd';


import './Login.css'; 

const {Tab, UserName, Password, Mobile, Captcha, Submit} = Login;

@connect(({login, loading}) => ({
  login,
  submitting: loading.effects['login/login'], 
}))
export default class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      type: 'account',
      rememberMe: true,
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeRememberMe = this.changeRememberMe.bind(this);
  }

  onTabChange(type){
    this.setState({
      type,
    });
  }

  handleSubmit(err, values){
    const {type} = this.state;
    if(!err){
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        }
      });
    }
  }

  changeRememberMe(e){
    this.setState({
      rememberMe: e.target.checked,
    });
  }

  renderMessage(message){
    return (
      <Alert style={{}} message={message} type="error" showIcon/>
    );
  }

  render(){
    const {login, submitting} = this.props;
    const {type, rememberMe} = this.state;
    return (
      <div className="login-container">
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="Account">
            {
              login.status === 'error' && 
              login.type === 'account' && 
              !login.submitting && 
              this.renderMessage('Incorrect username or password.') 
            }
            <UserName name="userName" placeholder="admin/user" />
            <Password name="password" placeholder="888888/123456" />  
          </Tab>
          <Tab key="mobile" tab="Mobile">
            {
              login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting && 
              this.renderMessage('Incorrect captcha.')
            }
            <Mobile name="mobile" />
            <Captcha name="captcha" />    
          </Tab>
          <div>
            <Checkbox checked={rememberMe} className="login-remember-me" onChange={this.changeRememberMe} >Remember me</Checkbox>
            <a className="login-forget-pwd" href="">Forget Password?</a>
          </div>
          <Submit loading={submitting} className="login-submit">Login</Submit>
          <div className="login-to-register">
            Need an account? <Link className="" to="/user/register">Sign up now!</Link>
          </div>
        </Login>
      </div>
    );
  }
}
