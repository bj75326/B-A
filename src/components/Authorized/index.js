/**
 * Created by jibin on 2018/3/9.
 */

import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
//import Secured from './Secured';
import check from './CheckPermissions';

let current = {authority: null};

//Authorized.Secrued = Secured;
Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;

const renderAuthorize = currentAuthority => {
  if(currentAuthority){
    if(Object.prototype.toString.call(currentAuthority).slice(8, -1) === 'Function'){
      current.authority = currentAuthority();
    }
    if(Object.prototype.toString.call(currentAuthority).slice(8, -1) === 'String'){
      current.authority = currentAuthority;
    }
    //当currentAuthority为Promise实例时
    if(typeof currentAuthority === 'object' && typeof currentAuthority.then === 'function'){
      current.authority = currentAuthority;
      currentAuthority.then(authority => {
        current.authority = authority
      }).catch(error => {
        current.authortiy = null;
        throw new Error('getAuthority occurred error', error);
      });
    }
  }else{
    current.authority = null;
  }
  return Authorized;
};

export {current};
export default renderAuthorize;


