/**
 * Created by jibin on 2018/3/9.
 */

import React from 'react';
import { Route, Redirect } from 'dva/router';
import Authorized from './Authorized';

class AuthorizedRoute extends React.Component {
  //包装输入的props给Authorized
  render(){
    const {
      component: Component,
      render,
      authority,
      redirectPath,
      ...rest
    } = this.props;
    return (
      <Authorized
        authority={authority}
        noMatch={
          <Route
            {...rest}
            render={() => <Redirect to={{ pathname: redirectPath }} />}
          />
        }
      >
        <Route
          {...rest}
          render={props =>
            (Component ? <Component {...props}/> : render(props))
          }
        />
      </Authorized>
    );
  }
}

export default AuthorizedRoute;
