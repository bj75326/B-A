/**
 * Created by jibin on 2018/2/7.
 */

import {createElement} from 'react'
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';

import {getMenuData} from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => {
  //eslint-disable-next-line
  console.log('!!!!!!!!!', model);
  //eslint-disable-next-line
  const a = !app._models.some(({namespace}) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });
  
  console.log('!!!!!!!!!!!!', a);
  return a;
};

//wrapper of dva/dynamic
const dynamicWrapper = (app, models, component) => {
  // .webpackrc.js中设置"disableDynamicImport"为true
  // transform by babel-plugin-dynamic-import-node-sync
  if(component.toString().indexOf('.then(') < 0){
    models.forEach(model => {
      if(modelNotExisted(app, model)){
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if(!routerDataCache){
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache
      });
    };
  }
  // .webpackrc.js中设置"disableDynamicImport"为false
  // transform by babel-plugin-dynamic-import-node-async
  return dynamic({
    app, 
    models: () => models.filter( 
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    component: () => {
      if(!routerDataCache){
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache
        });
      });
    }
  });
};

function getFlatMenuData(menus){
  // 将menus转化为path与component的键值对
  // { name: ..., path: /../../../.., icon: ..., children: ...}
  let keys = {};
  menus.forEach(item => {
    if(item.children){
      keys[item.path] = {...item};
      keys = {...keys, ...getFlatMenuData(item.children)};
    }else{
      keys[item.path] = {...item};
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard': {
      component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Dashboard')),
    },
    '/task': {
      component: dynamicWrapper(app, ['task'], () => import('../routes/Task/TaskList')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
  };
  // path与component的键值对
  const menuData = getFlatMenuData(getMenuData());

  const routerData = {};
  Object.keys(routerConfig).forEach(path => {
    // 使用path-to-regexp
    // 例如 /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(key));
    let menuItem = {};
    if(menuKey){
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  // routerData 包含
  // {[path]: {component: ..., name: ..., authority: ...}}
  return routerData;
};
