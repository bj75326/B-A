import React from 'react';
import classNames from 'classnames';
import {Button, Form} from 'antd';

import './index.css';

const FormItem = Form.Item;

export default ({className, ...rest}) => {
  const clsString = classNames({
    [className]: !!className,
  });
  return (
    <FormItem>
      <Button className={clsString} type="primary" htmlType="submit" {...rest}>Sign in</Button>
    </FormItem>
  );
};