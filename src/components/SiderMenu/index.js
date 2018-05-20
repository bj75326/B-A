/**
 * Created by jibin on 2018/3/26.
 */

import React from 'react';
import DrawerMenu from 'rc-drawer-menu';
import SiderMenu from './SiderMenu';

import 'rc-drawer-menu/assets/index.css';

export default props => (
  props.isMobile ? (
    <DrawerMenu
      parent={null}
      level={null}
      iconChild={null}
      open={!props.collapsed}
      onMaskClick={() => {props.onCollapse(true)}}
      width="220px"
    >
      <SiderMenu {...props} collapsed={props.isMobile ? false : props.collapsed}/>
    </DrawerMenu>
  ) : (
    <SiderMenu {...props}/>
  )
);
