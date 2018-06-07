/**
 * Created by jibin on 2018/3/14.
 */

import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Layout} from 'antd';
import {connect} from 'dva';
import {Route, Redirect, Switch, routerRedux} from 'dva/router';
import classNames from 'classnames';
import {enquireScreen} from 'enquire-js';
import Authorized from '../utils/Authorized';
import {getMenuData} from '../common/menu';
import SiderMenu from '../components/SiderMenu';
import logo from '../assets/logo.svg';
import DocumentTitle from 'react-document-title';
import {ContainerQuery} from 'react-container-query';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import {getRoutes} from '../utils/utils';

import './BasicLayout.css';

const {Content, Header, Footer} = Layout;
const {AuthorizedRoute} = Authorized;

const copyright = <Fragment>BinAdmin <i className="iconfont icon-copyright"/> 2018 Bill Ji</Fragment>;

//重定向配置
const getRedirect = items => {
  let redirectData = [];
  items.forEach(item => {
    if(item && item.children){
      if(item.children[0] && item.children[0].path){
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`
        });
        redirectData = redirectData.concat(getRedirect(item.children));
      }
    }
  });
  return redirectData;
};
const redirectData = getRedirect(getMenuData());

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      isMobile
    };

    this.handleMenuCollapse = this.handleMenuCollapse.bind(this);
    this.handleNoticeLoadingMore = this.handleNoticeLoadingMore.bind(this);
    this.handleNoticeVisibleChange = this.handleNoticeVisibleChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
    isMobile: PropTypes.bool,
  };

  getChildContext(){
    const {location, routerData} = this.props;
    //在basic layout的上下文中添加isMobile，供子级路由下的页面做响应式（暂时）
    const {isMobile} = this.state;
    return {
      location,
      breadcrumbNameMap: routerData,
      isMobile,
    };
  }

  componentDidMount(){
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  getBashRedirect(){
    //根据当前url中的参数设置重定向
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    if(redirect){
      urlParams.searchParams.delete('redirect');
      //这里会不会触发history的subscribe？
      window.history.replaceState(null, 'redirect', urlParams.href);
      console.log('replaceState complete');
    }else{
      return '/task';
    }
    return redirect;
  }

  handleMenuCollapse(collapsed){
    console.log('handleMenuCollapse', collapsed);
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    });
  }

  //待定
  handleNoticeClear(){

  }

  //待定
  handleNoticeLoadingMore(){

  }

  handleMenuClick({key}){
    if(key === 'setting'){

    }else if(key === 'profile'){

    }else if(key === 'logout'){
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }

  handleNoticeVisibleChange(visible){
    if(visible){
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

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
    console.log('basiclayout render');
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location
    } = this.props;
    const bashRedirect = this.getBashRedirect();
    const contentCls = classNames({
      ["basic-layout-content"]: true,
      ["basic-layout-content-collapsed"]: collapsed,
    });

    const layout = (
      <Layout className="ba-layout--custom">
        <SiderMenu
          logo={logo}
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
          collapsedWidth={88}
        />
        <Layout style={{height: '100vh', overflowY: 'scroll'}} className="ba-layout--custom">
          <Header style={{padding: 0}}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              notices={notices}
              fetchingNotices={fetchingNotices}
              collapsed={collapsed}
              location={location}
              isMobile={this.state.isMobile}
              onMenuClick={this.handleMenuClick}
              onNoticeClear={this.handleNoticeClear}
              onNoticeLoadingMore={this.handleNoticeLoadingMore}
              onCollapse={this.handleMenuCollapse}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content className={contentCls}>
            <Switch>
              {
                redirectData.map(item =>
                  <Redirect key={item.from} exact from={item.from} to={item.to}/> 
                )
              }
              {
                getRoutes(match.path, routerData).map(item => (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                    authority={item.authority}
                    redirectPath="/exception/403"
                  />
                ))
              }
              <Redirect exact from="/" to={bashRedirect}/>
            </Switch>
          </Content>
          <Footer style={{padding: 0}}>
            <GlobalFooter copyright={copyright}/>  
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({user, global, loading}) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);
