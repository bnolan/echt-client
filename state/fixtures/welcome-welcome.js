import uuid from 'uuid/v4';
import { ACTION } from '../../constants';

const ingo = uuid();
const photo = uuid();
const key = uuid();

export default {
  user: {
    key: null,
    loggedIn: false
  },
  route: {
    name: 'Welcome'
  }
};
