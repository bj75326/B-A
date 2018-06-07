import React, {PureComponent, createElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Breadcrumb, Tabs} from 'antd';
import {urlToList} from '../utils/pathTools';
import pathToRegexp from 'path-to-regexp';

import './index.css';

const {TabPane} = Tabs;

export const getBreadcrumb = (breadcrumbNameMap, url) => {
  let breadcrumb = breadcrumbNameMap[url];
  if(!breadcrumb){
    Object.keys(breadcrumbNameMap).forEach(item => {
      if(pathToRegexp(item).test(url)){
        breadcrumb = breadcrumbName[item];
      }
    });
  }
  return breadcrumb || {};
};

export default class PageHeader extends PureComponent {
  constructor(props){
    super(props);

    this.itemRender = this.itemRender.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }; 

  onChange(key){
    if(this.props.onTabChange){
      this.props.onTabChange(key);
    }
  }

  getBreadcrumbProps(){
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      routerLocation: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  }

  conversionFromProps(){
    const {
      breadcrumbList,
      breadcrumbSeparator,
      linkElement = 'a',
    } = this.props;
    return (
      <Breadcrumb className="ba-breadcrumb--custom" separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => (
          <Breadcrumb.Item key={item.title}>
            {item.href 
              ? createElement(
                  linkElement,
                  {
                    [linkElement === 'a' ? 'href' : 'to'] : item.href,
                  },
                  item.title,
                ) 
              : item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  }

  conversionFromLocation(routerLocation, breadcrumbNameMap){
    const {breadcrumbSeparator, linkElement = 'a'} = this.props;
    const pathSnippets = urlToList(routerLocation.pathname);
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            {
              [linkElement === 'a' ? 'href' : 'to']: url,
            },
            currentBreadcrumb.name,
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    extraBreadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        {createElement(
          linkElement,
          { 
            [linkElement === 'a' ? 'href' : 'to']: '/',
          },
          "Home"
        )}
      </Breadcrumb.Item>
    );
    return (
      <Breadcrumb className="ba-breadcrumb--custom" separator={breadcrumbSeparator}>
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  }

  conversionBreadcrumbList(){
    const {breadcrumbList, breadcrumbSeparator} = this.props;
    const {
      routes,
      params,
      routerLocation,
      breadcrumbNameMap,
    } = this.getBreadcrumbProps();

    if(breadcrumbList && breadcrumbSeparator){
      return this.conversionFromProps();
    }

    if(routes && params){
      return (
        <Breadcrumb
          className="ba-breadcrumb--custom"
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender} 
          separator={breadcrumbSeparator}
        />
      );
    }

    if(routerLocation && routerLocation.pathname){
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }

    return null;
  }

  itemRender(route, params, routes, paths){
    const {linkElement = 'a'} = this.props; 
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          [linkElement === 'a' ? 'href' : 'to']: paths.join('/') || '/',
        },
        route.breadcrumbName,
      )
    );
  }

  render(){
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabBarExtraContent,
    } = this.props;
    const clsString = classNames({
      [className]: !!className,
      ['page-header']: true,
    });

    let tabDefaultValue;
    if(tabActiveKey !== undefined && tabList){
      tabDefaultValue = tabList.filter(item => item.default)[0] || tabList[0];
    } 

    const breadcrumb = this.conversionBreadcrumbList();
    const activeKeyProps = {
      defaultActiveKey: tabDefaultValue && tabDefaultValue.key,
    };

    if(tabActiveKey !== undefined){
      activeKeyProps.activeKey = tabActiveKey;
    }

    return (
      <div className={clsString}>
        {breadcrumb}
        <div className="">
          {logo && <div className="">{logo}</div>}
          <div className="">
            <div className="">
              {title && <h1 className="">{title}</h1>}
              {action && <div className="">{action}</div>}
            </div>
            <div className="">
              {content && <div className="">{content}</div>}
              {extraContent && (
                <div className="">{extraContent}</div>
              )}
            </div>
          </div>
        </div>
        {(tabList && tabList.length) && (
          <Tabs
            className=""
            {...activeKeyProps}
            onChange={this.onChange}
            tabBarExtraContent={tabBarExtraContent}
          >
            {tabList.map(item => <TabPane tab={item.tab} key={item.key}/>)}
          </Tabs>
        )}
      </div>
    );
  }
}