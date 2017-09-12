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
    loggedIn: true
  },
  friends: [],
  //   {
  //     uuid: ingo,
  //     type: STATUS.ACCEPTED,
  //     photo: { small: { url: photos.ingo }}
  //   },
  //   {
  //     uuid: sam,
  //     type: STATUS.PENDING,
  //     photo: { small: { url: photos.sam }}
  //   },
  //   {
  //     uuid: rissa,
  //     type: STATUS.PROPOSED,
  //     photo: { small: { url: photos.rissa }}
  //   }
  // ],
  route: {
    name: 'Friends'
  }
};
