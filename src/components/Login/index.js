import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Tabs} from 'antd';
import LoginItem from './LoginItem';
import LoginTab from './LoginTab';
import LoginSubmit from './LoginSubmit';

import './index.css';

@Form.create()
class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      type: this.props.defaultActiveKey,
      tabs: [],
      active: {},
    };

    this.onSwitch= this.onSwitch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    onTabChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  static childContextTypes = {
    tabUtil: PropTypes.object,
    form: PropTypes.object,
    updateActive: PropTypes.func,
  };

  getChildContext(){
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...this.state.tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: this.state.tabs.filter(currentId => currentId !== id),
          });
        }  
      },
      form: this.props.form,
      updateActive: activeItem => {
        const {type, active} = this.state;
        if(active[type]){
          active[type].push(activeItem);
        }else{
          active[type] = [activeItem];    
        }
        this.setState({
          active,
        });  
      }
    };    
  }

  handleSubmit(e){
    e.preventDefault();
    const {active, type} = this.state;
    const activeFields = active[type];
    this.props.form.validateFields(activeFields, {force: true}, 
      (err, values) => {
        this.props.onSubmit(err, values);
      }
    );
  }

  onSwitch(type){
    this.setState({
      type,
    });
    this.props.onTabChange(type);
  }

  render(){
    const {className, children} = this.props;
    const {type, tabs} = this.state;
    const tabChildren = [];
    const otherChildren = [];
    React.Children.forEach(children, item => {
      if(!item){
        return;    
      }
      // eslint-disable-next-line
      if(item.type._BA_LOGIN_TAB){
        tabChildren.push(item);
      }else{
        otherChildren.push(item);
      }
    });
    return (
      <div className="login">
        <Form onSubmit={this.handleSubmit}>
          {
            tabChildren.length ? (
              <div>
                <Tabs
                  animated={false}
                  className={`login-tabs ba-tabs--custom`}
                  activeKey={type}
                  onChange={this.onSwitch}
                >
                  {tabChildren}
                </Tabs>
                {otherChildren}
              </div>    
            ) : [...children]
          }
        </Form>
      </div>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Login;