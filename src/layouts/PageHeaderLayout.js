import React from 'react';
import PageHeader from '../components/PageHeader';
import {Link} from 'dva/router';
import classNames from 'classnames';

import './PageHeaderLayout.css';

export default ({children, wrapperClassName, top, disablePageHeader, ...restProps}) => {

  const clsString = classNames({
    [wrapperClassName]: !!wrapperClassName,
    ["page-header-layout-wrapper"]: true,
  });

  return (
    <div className={clsString}>
      {top}
      {!disablePageHeader ? <PageHeader key="pageheader" {...restProps} linkElement={Link}/> : null}
      {children ? <div className="page-header-layout-content">{children}</div> : null}
    </div>
  );
};