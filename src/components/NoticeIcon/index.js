/**
 * Created by jibin on 2018/4/2.
 */

import React, {PureComponent} from 'react';
import {Spin, Badge, Icon, Popover} from 'antd';
import classNames from 'classnames';
import List from './NoticeList';
import {Scrollbars} from 'react-custom-scrollbars';
import emptyNotice from '../../assets/emptyNotice.svg';

import './index.css';

export default class NoticeIcon extends PureComponent {

  constructor(props){
    super(props);

    const {list} = props;
    let showLoadingMore = false;
    if(list && list.length > 5){
      showLoadingMore = true;
    }

    this.noticePage = 1;

    this.state = {
      showLoadingMore,
      loadingMore: false,
    };

    this.onPopupVisibleChange = this.onPopupVisibleChange.bind(this);
  }

  static defaultProps = {
    loading: false,
    locale: {
      emptyText: 'No notices yet.',
      clear: 'Clear',
    },
    emptyImage: emptyNotice,

  };

  componentWillReceiveProps(nextProps){
    const {list} = nextProps;    
    if(list && list.length > this.noticePage * 5 && !this.state.showLoadingMore){
      this.setState({
        showLoadingMore: true,
      });
    }
  }

  onItemClick(item){
    const {onItemClick} = this.props;
    onItemClick(item);
  }

  onLoadingMore(){
    this.noticePage++;
    let showLoadingMore = this.state.showLoadingMore;
    if(this.props.list.length <= this.noticePage * 5){
      showLoadingMore = false;
    }
    this.setState({
      showLoadingMore,
      loadingMore: true
    }, () => {
      this.setState({
        loadingMore: false
      });
    });
  }

  onPopupVisibleChange(visible){
    const {onPopupVisibleChange} = this.props;
    this.noticePage = 1;
    onPopupVisibleChange(visible);
  }

  getNotificationBox(){
    const {list, loading, locale, emptyText, emptyImage} = this.props;
    const {showLoadingMore, loadingMore} = this.state;

    const showList = list.slice(0, this.noticePage * 5); 
    return (
      <Scrollbars style={{height: 345}}>
        <Spin spinning={loading} delay={0}>
          <List
            data={showList}
            onClick={item => this.onItemClick(item)}
            onLoadingMore={() => this.onLoadingMore()}
            showLoadingMore={showLoadingMore}
            loadingMore={loadingMore}
            locale={locale}
            emptyText={emptyText}
            emptyImage={emptyImage}
          />
        </Spin>
      </Scrollbars>
    );
  }

  render(){
    const {className, count, popupAlign} = this.props;
    const noticeButtonClass = classNames({
      [className]: !!className,
    });

    const notificationBox = this.getNotificationBox();

    const trigger = (
      <span className="notice-icon">
        <Badge dot={count} offset={[1, -3]} style={{height: '8px', width: '8px'}}>
          <i className={`iconfont icon-notice`}/>
        </Badge>
      </span>
    );

    const popoverProps = {};
    if('popupVisible' in this.props){
      popoverProps.visible = this.props.popupVisible;
    }
    return (
      <Popover
        overlayClassName="ba-popover--custom notice-list-popover"
        placement="bottomRight"
        content={notificationBox}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={this.onPopupVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </Popover>
    );
  }
}
