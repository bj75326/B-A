import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Row, Col, Form, Menu, Button, Dropdown, Radio, Input, Tag, Popover, Modal, Select, AutoComplete} from 'antd';
import {TaskCard} from '../../components/Charts';
import StandardTable from '../../components/StandardTable';
import moment from 'moment';

import './TaskList.css';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
const StandardTableAction = StandardTable.StandardTableAction;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

//new ticket autocomplete 组件使用，真正产品环境需要到后台获取dataSource
const clientDataSource = [
  'Adam Briggs',
  'Erik Beck',
  'Marcus Gomez',
  'Isaiah Hawkins',
  'Alfred Coleman',
  'Theodore Lawson',
  'Curtis Rodriquez',
  'Leo Conner',
  'Connor Welch',
  'Corey Barton',
  'Don Medina',
  'Luis Thompson',
];

const status = ['Open', 'Closed', 'Reopened', 'Checking'];
const queue = ['Showstopper', 'High', 'Middle', 'Low'];
const columns = [
  {
    title: 'Ticket ID',
    dataIndex: 'id',
  },{
    title: 'Status',
    dataIndex: 'status',
    filters: [
      {
        text: status[0],
        value: 0,
      },{
        text: status[1],
        value: 1,
      },{
        text: status[2],
        value: 2,
      },{
        text: status[3],
        value: 3,
      }
    ],
    render(val){
      let color;
      switch(val){
        case 0: 
          color = '#ffa854';
          break;
        case 1:
          color = '#eeeeee';
          break;    
        case 2:
          color = '#ff4805';
          break;
        case 3:
          color = '#5eb870';
          break;          
      }
      return (
        <Tag 
          color={color} 
          className="ba-tag--custom"
          style={{
            color: color === '#eeeeee' ?  '#8d8d8d' : '#fff',
          }}
        >
          {status[val]}
        </Tag>
      );
    },
  },{
    title: 'Subject',
    dataIndex: 'subject',
  },{
    title: 'Queue',
    dataIndex: 'queue',
    filters: [
      {
        text: queue[0],
        value: 0,
      },{
        text: queue[1],
        value: 1,
      },{
        text: queue[2],
        value: 2,
      },{
        text: queue[3],
        value: 3,
      }
    ],
    render(val){
      return <span>{queue[val]}</span>;
    },
  },{
    title: 'Client',
    dataIndex: 'client',
  },{
    title: 'Last Update',
    dataIndex: 'updatedAt',
    sorter: true,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },{
    title: '',
    /*render: () => {
      const menu = (
        <Menu
          selectable={false} 
        >
          <Menu.Item key="edit">Edit</Menu.Item>
          <Menu.Item key="remove">Remove</Menu.Item>
        </Menu>
      );
      return (
        <Popover
          placement="leftTop"
          content={menu}
          overlayClassName="ba-popover--custom standard-table-popover"
        >
          <i className={`iconfont icon-ellipsis`} style={{color: '#d8d8d8'}}/>
        </Popover>    
      );  
    },*/
    render: () => {
      return (
        <StandardTableAction
          options={[{key: 'edit', title: 'Edit'}, {key: 'remove', title: 'Remove'}]}
          onMenuClick={({key}) => {console.log(key)}}
          placement="leftTop"
          overlayClassName="ba-popover--custom standard-table-popover"
        >
          <i className={`iconfont icon-ellipsis`} style={{color: '#d8d8d8'}}/>  
        </StandardTableAction>    
      );
    }
  }
];

const CreateForm = Form.create()(props => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValues) => {
      if(err) return;
      handleAdd(fieldsValues);
    });  
  };

  return (
    <Modal
      title="Create Ticket"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false)}
      wrapClassName="ba-modal--custom task-list-modal"
      width={400}
    >
      <FormItem
        label="Subject"
        colon={false}
      >
        {form.getFieldDecorator('subject', {
          rules: [{required: true, message: 'Please input subject for new ticket.'}],
        })(
          <Input placeholder="Ticket Subject"/>
        )}
      </FormItem>
      <FormItem
        label="Queue"
        colon={false}
      >
        {form.getFieldDecorator('queue', {
          rules: [{required: true, message: 'Please choose queue for new ticket.'}],
        })(
          <Select defaultValue="3" style={{width: '100%'}}>
            <Option value="3">Low</Option>
            <Option value="2">Middle</Option>
            <Option value="1">High</Option>
            <Option value="0">Showstopper</Option>
          </Select>
        )}      
      </FormItem>
      <FormItem
        label="Client"
        colon={false} 
      >
        {form.getFieldDecorator('client', {
          rules: [{required: true, message: 'Please input client name.'}],
        })(
          <AutoComplete
            dataSource={clientDataSource}
            style={{width: '100%'}}
            filterOption={true}
          />  
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({task, loading}) => ({
  task,
  loading: loading.effects["task/fetchTaskStaistics"],
  ticketsLoading: loading.effects["task/fetch"],
}))
@Form.create()
export default class TaskList extends PureComponent {
  constructor(props){
    super(props);

    this.state = {
      selectedRows: [],
      formValues: {},
      modalVisible: false,
    };

    this.handleSelectRows = this.handleSelectRows.bind(this);
    this.handleStandardTableChange = this.handleStandardTableChange.bind(this);
    this.handleTableSearch = this.handleTableSearch.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleModalVisible = this.handleModalVisible.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'task/fetchTaskStaistics',
    });
    
    this.props.dispatch({
      type: 'task/fetch',
    }); 
  }

  handleMenuClick(){

  }

  handleTableSearch(val){
    const {dispatch} = this.props;
    const {formValues} = this.state;
    this.setState({
      formValues: {
        ...formValues,
        id: val
      }
    });
    let params = {
      ...formValues,
      id: val,  
    };
    if(this.ticketsFetchParams){
      params = {
        ...this.ticketsFetchParams,
        ...params,
      };
    }
    dispatch({
      type: 'task/fetch',
      payload: params,
    });
  }

  handleRadioChange(e){
    console.log('handleRadioChange', e.target.value);
    const {dispatch} = this.props;
    const {formValues} = this.state;
    
    this.setState({
      formValues: {
        ...formValues,
        radioStatus: e.target.value,
      }
    });
    let params = {
      ...formValues,
      radioStatus: e.target.value,
    };
    if(this.ticketsFetchParams){
      params = {
        ...this.ticketsFetchParams,
        ...params,
      };
    }
    dispatch({
      type: 'task/fetch',
      payload: params,
    });
  }

  handleSelectRows(rows){
    this.setState({
      selectedRows: rows,  
    });
  }

  handleModalVisible(visible){
    this.setState({
      modalVisible: !!visible,
    });
  }

  handleAdd(){

  }

  handleStandardTableChange(pagination, filtersArg, sorter){
    const {dispatch} = this.props; 
    const {formValues} = this.state;
    console.log('pagination', pagination);
    console.log('filtersArg', filtersArg);
    console.log('sorter', sorter);
    console.log('formValues', formValues);

    //{status: ["0", "1"]} => {status: "0,1"}    
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      //...formValues,
      ...filters,
    };
    if(sorter.field){
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    //ant design pro中并没有保存table change的参数，这里暂且先保存在TaskList的实例上，在其他触发table重新渲染的时候加上table过滤
    this.ticketsFetchParams = params;  

    dispatch({
      type: 'task/fetch',
      payload: {
        ...params,
        ...formValues,
      },
    });
  }

  render(){
    const {task, loading, ticketsLoading} = this.props;
    const {tickets, pagination} = task;
    const {total, pageSize, current} = pagination;

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: {
        marginBottom: '24px'
      },
    };

    const {selectedRows, modalVisible} = this.state;
    const {getFieldDecorator} = this.props.form;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">Delete</Menu.Item>
        <Menu.Item key="approval">Approve</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout disablePageHeader>
        <div className="task-list-container">
          <section className="task-list-staistics">
            <h3>Quick Staistics</h3>
            <Row gutter={24}>
              <Col {...topColResponsiveProps}>
                <TaskCard
                  title="Assigned Tasks"
                  number={task.all}
                  progress={false}
                />
              </Col>
              <Col {...topColResponsiveProps}>
                <TaskCard
                  title="Finished Tasks"
                  number={task.finished}
                  percent={task.all ? task.finished / task.all * 100 : 0}
                  color="green"
                />
              </Col>
              <Col {...topColResponsiveProps}>
                <TaskCard
                  title="On Hold Tasks"
                  number={task.holded}
                  percent={task.all ? task.holded / task.all * 100 : 0}
                  color="yellow"
                />
              </Col>
              <Col {...topColResponsiveProps}>
                <TaskCard
                  title="Terminated Tasks"
                  number={task.terminated}
                  percent={task.all ? task.terminated / task.all * 100 : 0}
                  color="red"
                />
              </Col>
            </Row>
          </section>
          <section className="task-list-tickets">
            <div className="task-list-table-head">
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={10} xl={8}>
                  <div className="task-list-table-count">
                    {`Latest Tickets (Showing ${pageSize * (current-1) + 1} to ${pageSize * current} of  ${total} records)`}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={14} xl={16}>
                  <div className="task-list-table-operator">
                    <Search
                      placeholder="Ticket ID"
                      onSearch={this.handleTableSearch}
                      className="task-list-search task-list-operator"
                    />
                    <Dropdown 
                      overlay={menu} 
                      overlayClassName="ba-dropdown--custom"
                      disabled={selectedRows.length ? false : true}
                    >
                      <Button  className="ba-btn--custom task-list-operator" style={{marginLeft: '12px'}}>
                        Bulk Action <i className={`iconfont icon-down`}/>
                      </Button>
                    </Dropdown>
                    <RadioGroup defaultValue="all" className="ba-radio--custom task-list-operator" style={{marginLeft: '12px'}}
                      onChange={this.handleRadioChange}
                    >
                      <RadioButton value="all">All</RadioButton>
                      <RadioButton value="open">Open</RadioButton>
                      <RadioButton value="closed">Closed</RadioButton>
                    </RadioGroup>  
                    <Button 
                      className="ba-global-add-btn task-list-operator"
                      style={{margin: '0 0 0 24px'}}
                      onClick={() => this.handleModalVisible(true)}
                    >
                      <i className="iconfont icon-plus"/>
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={ticketsLoading}
              data={tickets}
              pagination={pagination}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </section>
        </div>    
        <CreateForm 
          modalVisible={modalVisible}
          handleModalVisible={this.handleModalVisible}
          handleAdd={this.handleAdd}
        />
      </PageHeaderLayout>
    );
  }
}