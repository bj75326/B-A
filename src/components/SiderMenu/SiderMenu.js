/**
 * Created by jibin on 2018/3/26.
 */

import React, {PureComponent} from 'react';
import {Layout, Menu, Icon} from 'antd';
import pathToRegexp from 'path-to-regexp';
import {Link} from 'dva/router';
import {urlToList} from '../utils/pathTools';
import Debounce from 'lodash-decorators/debounce';
import collapseBar from '../../assets/collapse.svg';
import './index.css';

const {Sider} = Layout;
const {SubMenu} = Menu;

const getIcon = icon => {
  if(typeof icon === 'string' && icon.indexOf('http') === 0){
    return <img src={icon} alt="icon" />
  }
  if(typeof icon === 'string'){
    //return <Icon type={icon}/>
    return <i className={`iconfont icon-${icon}`}/>
  }
  return icon;
};

export const getMenuMatchKeys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

export default class SiderMenu extends PureComponent{
  constructor(props){
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props)
    };

    this.handleOpenChange = this.handleOpenChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  /**
   * [{path: '/.../...', children: [{path: '/.../...'}]}, {path: '/.../...'}] => ['/.../...', '/.../...']
   * 子级的path总是放在父级path之前
   * @param menus
   */
  getFlatMenuKeys(menus){
    let keys = [];
    menus.forEach(item => {
      if(item.children){
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 转化当前的地址
   * '/list/search/articles' => ['/list', '/list/search', '/list/search/articles']
   * @param props
   */
  getDefaultCollapsedSubMenus(props){
    const {location: {pathname}} = props || this.props;
    return urlToList(pathname).map(item => {
      return getMenuMatchKeys(this.flatMenuKeys, item)[0];
    }).filter(item => item);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps)
      });
    }
  }

  //为什么用pop??
  getSelectedMenuKeys(){
    const {location : {pathname}} = this.props;
    return urlToList(pathname).map(item =>
      getMenuMatchKeys(this.flatMenuKeys, item).pop()
    );
  }

  /**
   * 根据menusData递归获取Menu组件的vDOM(jsx)结构
   */
  getNavMenuItems(menusData){
    if(!menusData){
      return [];
    }
    return menusData.filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const itemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, itemDom);
      })
      .filter(item => item);
  }

  /**
   * 获取Menu组件填充内容 SubMenu 或者 Menu.Item
   */
  getSubMenuOrItem(item){
    if(item.children && item.children.some(child => child.name)){
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : (
              item.name
            )
          }
          key={item.path}
          className="ba-menu--custom"
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }else{
      return (
        <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
      );
    }
  }

  /**
   * 获取每个Menu.Item的jsx结构 Link 或者 标签a
   */
  getMenuItemPath(item){
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const {target, name} = item;

    if(/^https?:\/\//.test(itemPath)){
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath => this.props.location.pathname}
        onClick={
          this.props.isMobile ? () => {
            this.props.onCollapse(true);
          } : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  }

  /**
   * 转换menuItem.path
   * url直接返回
   * path中多个'/'应该只保留一个
   */
  conversionPath(path){
    if(path.indexOf('http') === 0){
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  }

  /**
   * item如果有authority设置，判定后渲染
   */
  checkPermissionItem(authority, itemDom){
    if(this.props.Authorized && this.props.Authorized.check){
      const {check} = this.props.Authorized;
      return check(authority, itemDom);
    }
    return itemDom;
  }

  //点击菜单的时候，收起其他打开的根级菜单，保持页面清洁
  handleOpenChange(openKeys){
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isRootMenu = this.menus.some(item => {
      return lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    });
    this.setState({
      openKeys: isRootMenu ? [lastOpenKey] : [...openKeys]
    });
  }

  toggle(){
    const {collapsed, onCollapse} = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }

  @Debounce(600)
  triggerResizeEvent(){ // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render(){
    const {logo, collapsed, onCollapse, collapsedWidth} = this.props;
    const {openKeys} = this.state;
    // openKeys 传递给menu组件
    const menuProps = collapsed ? {} : {openKeys};

    let selectedKeys = this.getSelectedMenuKeys();
    if(!selectedKeys.length){
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={220}
        className="sider-shadow"
        collapsedWidth={collapsedWidth}
      >
        <div className="logo" key="logo">
          <Link to="/">
            <img src={logo} alt="logo"/>
            <h1>BinAdmin</h1>
          </Link>
          <span className="collapse-bar" onClick={this.toggle}>
            <img src={collapseBar} alt="collapse" />
          </span>
        </div>
        <Menu
          key="menu"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{padding: '18px 0', width: '100%'}}
          className="ba-menu--custom"
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}
