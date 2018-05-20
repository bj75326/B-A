/**
 * Created by jibin on 2018/2/7.
 */

import {isUrl} from '../utils/utils';

const menuData = [{
  name: 'Dashboard',
  icon: 'dashboard',
  path: 'dashboard',
},{
  name: 'My Task',
  icon: 'puzzle',
  path: 'task',
},{
  name: 'Clients',
  icon: 'group',
  path: 'clients',
},{
  name: 'Form',
  icon: 'form',
  path: 'form',
  children: [{
    name: 'Basic Form',
    path: 'basic-form',
  }, {
    name: 'Step Form',
    path: 'step-form',
  }, {
    name: 'Advanced Form',
    path: 'advanced-form',
  }]
}];

function formatter(data, parentPath = '/', parentAuthority){
  return data.map(item => {
    let {path} = item;
    if(!isUrl(path)){
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if(item.children){
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority)
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
