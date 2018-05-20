import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import dynamic from 'dva/dynamic';
import {getRouterData} from './common/router';
import Authorized from './utils/Authorized';

const {ConnectedRouter} = routerRedux;
const {AuthorizedRoute} = Authorized;

dynamic.setDefaultLoadingComponent(() => (
  <Spin size="large" className=""/>
));

function RouterConfig({ history, app }) {

  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;

  return (
    <LocaleProvider locale={enUS}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/user"
            component={UserLayout}
          />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props}/>}
            authority={['admin', 'user']}
            redirectPath="/user/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
