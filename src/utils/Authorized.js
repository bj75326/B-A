/**
 * Created by jibin on 2018/2/7.
 */

import RenderAuthorized from '../components/Authorized';
import {getAuthority} from './authority';

let Authorized = RenderAuthorized(getAuthority());
//重新获取
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export {reloadAuthorized};
export default Authorized;


