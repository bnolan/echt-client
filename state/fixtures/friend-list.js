import uuid from 'uuid/v4';
import { STATUS, ACTION } from '../../constants';
import photos from './photos';

const key = uuid();
const ingo = uuid();
const sam = uuid();
const rissa = uuid();

export default {
  user: {
    key,
    loggedIn: true,
    seenWelcome: true
  },
  friends: [
    {
      uuid: ingo,
      status: STATUS.ACCEPTED,
      photo: { small: { url: photos.ingo }},
      createdAt: new Date() - 1000 * 3600 * 24 * 5
    },
    {
      uuid: sam,
      status: STATUS.RECIEVED,
      photo: { small: { url: photos.sam }},
      createdAt: new Date() - 1000 * 3600 * 24 * 2
    },
    {
      uuid: rissa,
      status: STATUS.SENT,
      photo: { small: { url: photos.rissa }},
      createdAt: new Date() - 1000 * 3600 * 4
    }
  ],
  route: {
    name: 'Friends'
  }
};
