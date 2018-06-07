import {parse} from 'url';

const titles = [
  '',
];

const avatars = [
  '',
];

const users = [
  '',
];

const subjects = [
  'Need help with software installation',
  'Not working console',
  'Need to update. Help me',
  'Software not working',  
];
const status = ['Open', 'Closed', 'Reopened', 'Checking'];
const queue = ['Showstopper', 'High', 'Middle', 'Low'];
const client = [
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
const owner = [
  'Jane Patrick',
  'Winifred Burns',
  'Ida Rios',
  'Esther Vasquez',
  'Estella Powers',
  'Sarah Sanchez',
  'Nina Wong',
  'Mattie Powell',
  'Louisa Barrett',
  'Rhoda Bates',
  'Bernice Bass',
  'Lula Warner',
];

let ticketListDataSource = [];
for(let i = 96; i > 0; i--){
  ticketListDataSource.push({
    key: i,
    id: `${100000 + i}`,
    status: Math.floor(Math.random() * 10) % 4,
    subject: subjects[Math.floor(Math.random() * 10) % 4],
    queue: Math.floor(Math.random() * 10) % 4,
    client: client[i % 12],
    owner: owner[i % 12],
    updatedAt: i >=36 ? new Date(`2018-05-${Math.floor((i-36)/2 + 1)}`) 
      : new Date(`2018-04-${Math.floor((i+24)/2 + 1)}`),
  });
}

export function getFakeTickets(req, res, u){
  let url = u;
  if(!url || Object.prototype.toString.call(url).slice(8, -1) !== 'String'){
    url = req.url;
  }
  const params = parse(url, true).query;

  let dataSource = [...ticketListDataSource];

  if(params.sorter){
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if(s[1] === 'descend'){
        return next[s[0]] - prev[s[0]];      
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if(params.status){
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if(params.queue){
    const queue = params.queue.split(',');
    let filterDataSource = [];
    queue.forEach(q => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.queue, 10) === parseInt(q[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if(params.id){
    dataSource = dataSource.filter(data => parseInt(data.id, 10) ===  parseInt(params.id, 10));
  }
  if(params.radioStatus && params.radioStatus === 'open'){
    dataSource = dataSource.filter(data => parseInt(data.status, 10) === 0);    
  }
  if(params.radioStatus && params.radioStatus === 'closed'){
    dataSource = dataSource.filter(data => parseInt(data.status, 10) === 1);
  }

  let pageSize = 10;
  if(params.pageSize){
    pageSize = params.pageSize * 1;
  }

  const result = {
    tickets: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if(res && res.json){
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getFakeTickets,
};