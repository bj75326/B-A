/**
 * Created by jibin on 2018/4/4.
 */

import React from 'react';
import {Avatar, List, Spin} from 'antd';
import classNames from 'classnames';

export default function Noticelist({
  data=[], onClick, showLoadingMore, loadingMore, onLoadingMore, title, locale, emptyText, emptyImage
}){
  if(data.length === 0){
    return (
      <div className="notice-list-empty">
        {emptyImage ? (
          emptyImage
        ) : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }

  return (
    <div>
      <List className="notice-list ba-list--custom">
        {
          data.map((item, i) => {
            const itemCls = classNames({

            });
            return (
              <List.Item className="notice-list-item" key={item.key || i} onClick={() => onClick(item)}>
                <List.Item.Meta
                  className="notice-list-item-meta"
                  avatar={item.avatar ? <Avatar className="notice-list-avatar" src={item.avatar}/> : null}
                  title={
                    <div className="notice-list-title">
                      {item.title}
                      <div className="notice-list-extra">{item.extra}</div>
                    </div>
                  }
                  description={
                    <div>
                      <div className="notice-list-desc" title={item.description}>
                        {item.description}
                      </div>
                      <div className="notice-list-date">{item.datetime}</div>
                    </div>
                  }
                />
              </List.Item>
            );
          })
        }
      </List>
      {
        showLoadingMore ? (
          <div>
            {loadingMore && <Spin/>}
            {!loadingMore && <div className="notice-list-loading-btn" onClick={onLoadingMore}>Loading More</div>}
          </div>
        ) : null
      }
    </div>
  );
}
