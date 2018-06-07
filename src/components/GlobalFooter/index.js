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
            {links.map(link => (
              <a
                key={link.key}
                target={link.blankTarget ? '_blank' : '_self'}
                href={link.href}
              >
                {link.title}
              </a>
            ))}
          </div>
        )
      }
      {copyright && <div className="footer-copyright">{copyright}</div>}
    </div>
  ); 
};