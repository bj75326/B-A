/**
 * Created by jibin on 2018/3/30.
 */

import React, {PureComponent} from 'react';
import {Menu, Icon, Tag, Divider, Spin, Dropdown, Avatar} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { Link } from 'dva/router';
import Debounce from 'lodash-decorators/debounce';
import HeaderSearch from '../HeaderSearch';
import NoticeIcon from '../NoticeIcon';
import collapseBar from '../../assets/collapse.svg';
import classNames from 'classnames';

import './index.css';

export default class GlobalHeader extends PureComponent{

  constructor(props){
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  getNoticeData(){
    const {notices = []} = this.props;
    console.log('notices', notices);
    if(notices.length === 0){
      return {
        'all': []
      };
    }

    const newNotices = notices.map(notice => {
      //
      const newNotice = {...notice};
      //获取已过多长时间
      if(newNotice.datetime){
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if(newNotice.id){
        newNotice.key = newNotice.id;
      }
      if(newNotice.extra && newNotice.status){
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{}}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });

    // 暂时不需要使用tab分组
    //return groupBy(newNotices, 'type');
    return {
      'all': newNotices
    };
  }

  toggle(){
    const {collapsed, onCollapse} = this.props;
    onCollapse(!collapsed);
    console.log('click toggle');
    this.triggerResizeEvent();
  }

  //Sider的collapse操作应该也模拟触发出resize事件
  @Debounce(600)
  triggerResizeEvent(){ // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render(){
    const { currentUser, collapsed, fetchingNotices, isMobile, logo, onMenuClick, onNoticeClear,
      onNoticeVisibleChange, onNoticeLoadingMore} = this.props;

    //头部点击个人信息的下拉菜单
    const menu = (
      <Menu selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="profile"><i className={`iconfont icon-ProfileHili`}/>Profile</Menu.Item>
        <Menu.Item key="setting"><i className={`iconfont icon-setting`}/>Setting</Menu.Item>
        <Menu.Item key="logout"><i className={`iconfont icon-siglypharrowbackward`}/>Logout</Menu.Item>
      </Menu>
    );

    const noticeData = this.getNoticeData();
    
    const headerSearchCls = classNames({
      ['header-left']: true,
      ['header-left-mobile']: !!isMobile,
    });

    const headerRightCls = classNames({
      ['header-right']: true,
      ['header-right-mobile']: !!isMobile,
    });
    
    return (
      <div className="header">
        {isMobile && (
          [
            (
              <Link to="/" className="header-logo" key="logo">
                <img src={logo} alt="logo" />
              </Link>
            ),
            <Divider type="vertical" key="line"/>,
            <span className="header-collapse-bar" onClick={this.toggle}>
              <img src={collapseBar} alt="collapse" />
            </span>
          ]
        )}
        <div className={headerSearchCls}>
          <HeaderSearch
            className="header-search"
            placeholder="Search..."
            dataSource={['Tip One', 'Tip Two', 'Tip Three']}
            onSearch={value => {
              console.log('input', value);  // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value);  // eslint-disable-line
            }}
          />
        </div>
        <div className={headerRightCls}>
          <NoticeIcon
            count={currentUser.notifyCount}
            onItemClick={(item) => {
              console.log(item); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onLoadingMore={onNoticeLoadingMore}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}

            list={noticeData['all']}
            emptyText="There's no notices yet. :)"
            emptyImage={<icon className={`iconfont icon-empty`}/>}
            popupAlign={{offset: [20, -16]}}
          />
          {currentUser.name ? (
            <Dropdown 
              overlay={menu} 
              overlayClassName="ba-dropdown--custom header-account-dropdown"
              placement="bottomRight"
            >
              <span className="header-account" >
                <Avatar size="small" className="header-avatar" src={currentUser.avatar} />
                <span className="header-name">{currentUser.name} <i className={`iconfont icon-down`} /></span>
              </span>  
            </Dropdown>    
          ) : <Spin size="small" className="header-account-spin" />}
        </div>
      </div>
    );
  }
}

