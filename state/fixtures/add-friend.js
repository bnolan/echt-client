import uuid from 'uuid/v4';
import { ACTION } from '../../constants';

const ingo = uuid();
const photo = uuid();
const key = uuid();

export default {
  user: {
    key,
    loggedIn: true,
    seenWelcome: true
  },
  uploads: [{
    uuid: photo,
    url: 'https://s3-us-west-2.amazonaws.com/echt.uat.us-west-2/photos/photo-1a1be309-46d5-4b44-b752-b6098930fc1f-original.jpg',
    actions: [{
      type: ACTION.ADD_FRIEND,
      user: {
        uuid: ingo,
        avatar: 'https://s3-us-west-2.amazonaws.com/echt.uat.us-west-2/users/user-5300c1c4-11bc-4bfe-b6f8-e5244b896a24.jpg'
      }
    }]
  }],
  route: {
    params: {
      uuid: photo
    },
    name: 'InviteFriend'
  }
};
