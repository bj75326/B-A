/**
 * Created by jibin on 2018/2/13.
 */

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

function getRelation(str1, str2){
  if(str1 === str2){
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if(arr2.every((item, index) => item === arr1[index])){
    return 1;
  }else if(arr1.every((item, index) => arr2[index] === item)){
    return 2;
  }
  return 3;
}

function getRenderArr(routes){
  let renderArr = [];
  renderArr.push(routes[0]);
  for(let i = 1; i < routes.length; i++){
    let isAdd = false;
    //相互是否为父子级路径
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3); 
    //ant design pro 中加的去重，考虑去掉
    //renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if(isAdd){
      renderArr.push(routes[i]);
    }     
  }
  return renderArr;
}

/**
 * 给定path，获取routerData中给定path的所有其本身和子级路径的配置
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  //获取所有子路径
  let routes = Object.keys(routerData).filter(routePath => {
    return routePath.indexOf(path) === 0 && routePath !== path
  });
  // '/user/name' => '/name'
  routes = routes.map(item => item.replace(path, ''));
  const renderArr = getRenderArr(routes);
  const renderRoutes = renderArr.map(item => {
    //筛选出来的renderArr与routes比较是否属于某个route的父级路径
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  //返回 [{component: ..., name: ..., authority: ..., key: ..., path: ..., exact: ...}, {...}]
  return renderRoutes;
}