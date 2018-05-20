/**
 * Created by jibin on 2018/3/14.
 */

import React, {Fragment} from 'react';
import DocumentTitle from 'react-document-title';
import logo from '../assets/logo.svg';
import {Link, Redirect, Switch, Route} from 'dva/router';
import {getRoutes} from '../utils/utils';
import GlobalFooter from '../components/GlobalFooter';

import './UserLayout.css';

const links = [];

const copyright = <Fragment>BinAdmin <i className="iconfont icon-copyright"/> 2018 Bill Ji</Fragment>;

class UserLayout extends React.PureComponent {
  getPageTitle(){
    const {routerData, location} = this.props;
    const {pathname} = location;
    let title = 'B/A';
    if(routerData[pathname] && routerData[pathname].name){
      title = `${routerData[pathname].name} - B/A`;      
    }
    return title;
  }

  render(){
    console.log('userlayout render');
    const {routerData, match} = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className="user-layout-container">
          <div className="user-layout-content">
            <div className="user-layout-top">
              <div className="user-layout-header">
                <Link to="/">
                  <img alt="logo" className="user-layout-logo" src={logo}/>
                  <span className="user-layout-title">Bin Admin</span>
                </Link>
              </div>
              <div className="user-layout-desc">Admin UI build on the basis of dva & antd</div>
            </div>   
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact} 
                />  
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter link={links} copyright={copyright} />
        </div>  
      </DocumentTitle>
    );      
  }
}

export default UserLayout; 
