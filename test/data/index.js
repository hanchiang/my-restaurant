const { ObjectID } = require('mongodb');

exports.stores = [
  {
    name: 'Great beer',
    description: 'Enjoy a great beer after work',
    slug: 'Great-beer',
    tags: ['Wifi', 'Open late'],
    photo: 'd88efbbe-b2f8-49d3-9682-61dbdb680fec.jpeg',
    location: {
      address: 'Brisbane City QLD, Australia',
      coordinates: [153.02512350000006, -27.4697707]
    }
  },
  {
    name: 'Chill tapas bar',
    description: 'Wind down after work!',
    slug: 'Chill-tapas-bar',
    location: {
      address: 'Brisbane Airport QLD, Australia',
      coordinates: [153.11533899999995, -27.394131]
    }
  }
]

exports.users = [
  {
    _id: ObjectID('5b8022060e4f924a1e42aeb6'),
    name: 'han',
    email: 'han@han.com',
    hash: '$2b$10$fv1LT52fWifIT8SpP.jAJeNwV2fqt3B5wF1SC1QdevpzrggS0q4J.',  // 123456
    gravatar: 'https://gravatar.com/avatar/b9a8472d1aa6066a40d37449b99f1da4'
  }, {
    _id: ObjectID('5b802651e3ab2b55b95ec7a9'),
    name: 'wes',
    email: 'wes@wes.com',
    hash: '$2b$10$xU3VsmWj9xWEL6bpIVBVUOYskdtqi.eeGJRRPAqdNN73RMLuCq7jm', // 1234567
    gravatar: 'https://gravatar.com/avatar/87da2fe5b9faa9643d3dad5488c3acfe'
  }
]
