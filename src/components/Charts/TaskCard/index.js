import React from 'react';
import {Card, Spin, Progress} from 'antd';
import classNames from 'classnames';
import CountUp from 'react-countup';

import './index.css';

const TaskCard = ({loading = false, contentHeight, title, number, percent, progress = true, color}) => {
  
  const content = (
    <div className="task-card" style={{height: contentHeight || 'auto'}}>
      <div className="task-card-title">
        {
          title
        }
      </div>
      <div className="task-card-content">
        <div className="task-card-number">
          <CountUp
            start={0}
            end={number}
            duration={1}
            useEasing
            useGrouping
            separator=","
          />    
        </div>
        {progress ? <div className={`task-card-progress task-card-bg-${color}`}>
          <Progress 
            className="ba-progress--custom"
            percent={percent} 
            status="active" 
            showInfo={false} 
            strokeWidth={5} 
          />
        </div> : null}
      </div>  
    </div>  
  );

  return (
    <Card bodyStyle={{
      padding: "18px 20px 25px",
      WebkitBoxShadow: "0px 5px 10px 0px rgba(170,170,170,.1)",
      boxShadow: "0px 5px 10px 0px rgba(170,170,170,.1)",
    }} bordered={false}>
      <Spin spinning={loading}>{content}</Spin>
    </Card>
  );
};

export default TaskCard;