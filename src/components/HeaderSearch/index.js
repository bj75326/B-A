/**
 * Created by jibin on 2018/4/2.
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {AutoComplete, Input} from 'antd';

import './index.css';

export default class HeaderSearch extends PureComponent {

  constructor(props){
    super(props);

    this.state = {
      searchMode: false,
      value: ''
    };

    this.enterSearchMode = this.enterSearchMode.bind(this);
    this.leaveSearchMode = this.leaveSearchMode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  static defaultProps = {
    className: '',
    placeholder: '',
    onSearch: ()=>{},
    onPressEnter: ()=>{},
    defaultActiveFirstOption: false,
    dataSource: [],
  };

  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    onSearch: PropTypes.func,
    onPressEnter: PropTypes.func,
    defaultActiveFirstOption: PropTypes.bool,
    dataSource: PropTypes.array,
  };

  componentWillUnmount(){
    clearTimeout(this.timeout);
  }

  enterSearchMode(){
    this.setState({
      searchMode: true
    }, () => {
      this.input.focus();
    });
  }

  leaveSearchMode(){
    this.setState({
      searchMode: false,
      value: ''
    });
  }

  onChange(value){
    this.setState({
      value
    });
    if(this.props.onChange){
      this.props.onChange();
    }
  }

  onKeyDown(e){
    //利用setTimeout处理连续按回车键的情况
    if(e.key === 'Enter'){
      this.timeout = setTimeout(() => {
        this.props.onPressEnter(this.state.value);
      }, 0);
    }
  }

  render(){
    const {className, placeholder, ...restProps} = this.props;

    return (
      <span
        className={classNames({
          [className]: !!className,
          ['header-search-show']: this.state.searchMode,
        })}
        onClick={this.enterSearchMode}
      >
        <i className={`iconfont icon-search`}/>
        <AutoComplete
          key="AutoComplete"
          value={this.state.value}
          onChange={this.onChange}
          {...restProps}
        >
          <Input
            placeholder={placeholder}
            ref={node => {this.input = node;}}
            onKeyDown={this.onKeyDown}
            onBlur={this.leaveSearchMode}
          />
        </AutoComplete>
      </span>
    );
  }
}

