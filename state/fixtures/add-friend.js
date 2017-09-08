import uuid from 'uuid/v4';

const ingo = uuid();
const ben = uuid();
const key = uuid();

export default {
  user: {
    // uuid: ben(),
    key,
    loggedIn: true
  },
  route: {
    params: {
      uuid: ingo
    },
    name: 'InviteFriend'
  }
};
