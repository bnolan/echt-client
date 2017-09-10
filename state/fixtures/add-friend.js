import uuid from 'uuid/v4';

const photo = uuid();
const key = uuid();

export default {
  user: {
    key,
    loggedIn: true
  },
  uploads: [{
    uuid: photo
  }],
  route: {
    params: {
      uuid: photo
    },
    name: 'InviteFriend'
  }
};
