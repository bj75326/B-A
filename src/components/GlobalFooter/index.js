/**
 * Created by jibin on 2018/4/11.
 */
import React from 'react';
import classNames from 'classnames';
import './index.css';

export default ({className, links, copyright}) => {
  
  return (
    <div className="footer">
      {
        links && (
          <div className="footer-links">
          </div>
        )
      }
      {copyright && <div className="footer-copyright">{copyright}</div>}
    </div>
  ); 
};