export const getNotices = (req, res) => {
  res.json([
    {
      id: '000000001',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/bear.jpg',
      title: 'Fred Yates created Contest',
      datetime: '2018-04-22',
    },{
      id: '000000002',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/cat.jpg',
      title: 'Jennie Thompson uploaded video',
      datetime: '2018-04-23',
    },{
      id: '000000003',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/cat.jpg',
      title: 'Jennie Thompson created Contest',
      datetime: '2018-04-23',
    },{
      id: '000000004',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/dog.jpg',
      title: 'Divan Raj created Contest',
      datetime: '2018-04-24',
    },{
      id: '000000005',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/cat.jpg',
      title: 'Jennie Thompson assigned Task',
      datetime: '2018-04-25',
    },{
      id: '000000006',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/dog.jpg',
      title: 'Divan Raj created Issue',
      datetime: '2018-04-25',
    },{
      id: '000000007',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/hedgehog.jpg',
      title: 'Dan Abramov publish Article',
      datetime: '2018-04-25',
    },{
      id: '000000008',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/hedgehog.jpg',
      title: 'Dan Abramov created Contest',
      datetime: '2018-04-25',
    },{
      id: '000000009',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/kangaroo.jpg',
      title: 'Jed Watson created Contest',
      datetime: '2018-04-25',
    },{
      id: '000000010',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/kangaroo.jpg',
      title: 'Jed Watson created Contest',
      datetime: '2018-04-25',
    },{
      id: '000000011',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/raccoon.jpg',
      title: 'Andrew Clark create Contest',
      datetime: '2018-04-25',
    },{
      id: '000000012',
      avatar: 'https://bj75326.github.io/ba-asset/avatar/raccoon.jpg',
      title: 'Andrew Clark create Contest',
      datetime: '2018-04-25',
    }
  ]);
};

export const getNotices1 = (req, res) => {
  res.json([]);
};

export default {
  getNotices,
  getNotices1
};