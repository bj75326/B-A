import React, {PureComponent} from 'react';
import {Table} from 'antd';
import StandardTableAction from './StandardTableAction';

import './index.css';

class StandardTable extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      selectedRowKeys: [],

    };

    this.handleRowSelectChange = this.handleRowSelectChange.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  static StandardTableAction = StandardTableAction;

  componentWillReceiveProps(nextProps){
    //除去在table组件自己提供的清空或者修改已选行的手段之外，父级组件某些情况也需要直接能参与行的选中与清空
    if(nextProps.selectedRows.length === 0){
      this.setState({
        selectRowKeys: [],
      });
    }
  }

  handleRowSelectChange(selectedRowKeys, selectedRows){
    if(this.props.onSelectRow){
      this.props.onSelectRow(selectedRows);
    }
    this.setState({
      selectedRowKeys,
    });
  }

  handleTableChange(pagination, filters, sorter){
    this.props.onChange(pagination, filters, sorter);
  }

  render(){
    const {selectedRowKeys} = this.state;
    const {data: tickets, pagination, loading, columns } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    return (
      <div className="standard-table">
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={tickets}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );  
  }
}

export default StandardTable;