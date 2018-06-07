import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Popover, Menu} from 'antd';

class StandardTableAction extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
    };

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
  }

  static defaultProps = {
    options: [],
    onMenuClick: () => {},
  };

  static propTypes = {
    options: PropTypes.array,
    onMenuClick: PropTypes.func,
  };

  handleMenuClick({key, item, keyPath}){
    this.setState({
      visible: false,
    });

    if(this.props.onMenuClick){
      this.props.onMenuClick({key, item, keyPath});
    }
  }

  handleVisibleChange(visible){
    this.setState({ 
      visible 
    });
  }

  render(){
    const {options, children, ...restProps} = this.props;
    const {visible} = this.state;
    const menu = (
      <Menu
        onClick={this.handleMenuClick}
        selectable={false}
      >
        {options.map(option => <Menu.Item key={option.key}>{option.title}</Menu.Item>)}
      </Menu>
    );

    return (
      <Popover
        content={menu}
        visible={visible}
        onVisibleChange={this.handleVisibleChange} 
        {...restProps}
      >
        {children}
      </Popover>
    );
  }
}

export default StandardTableAction;
