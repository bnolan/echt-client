/* globals describe, it, expect, jest */

import {EchtStore} from '../state/store';
import {observe, useStrict} from 'mobx';

jest.mock('react-native-fs');

describe('store', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = new EchtStore()
    store.clear();
  });

  it('loads', () => {
    expect(store).toBeTruthy();
  });

  it('should be empty', () => {
    expect(store.uploads).toHaveLength(0);
    expect(store.photos).toHaveLength(0);
    expect(store.friends).toHaveLength(0);
  });

  it('should merge', () => {
    store.merge(store.friends, [{uuid: '1234', name: 'ahitler'}]);
    expect(store.friends).toHaveLength(1);
    expect(store.friends[0].get('name')).toEqual('ahitler');

    store.merge(store.friends, [{uuid: '1234', name: 'dave'}]);
    expect(store.friends).toHaveLength(1);
    expect(store.friends[0].get('name')).toEqual('dave');

    store.merge(store.friends, [{uuid: '6969', name: 'sean'}]);
    expect(store.friends).toHaveLength(2);
    expect(store.friends[0].get('name')).toEqual('sean');

    store.merge(store.friends, []);
    expect(store.friends).toHaveLength(2);
  });

  it('should dispatch on merge', () => {
    let isObserved = false;
    const observation = observe(store.friends, (changes) => {
      isObserved = true;
      expect(changes.type).toEqual('splice');
    });

    store.merge(store.friends, [{uuid: '1234', name: 'amerkel'}]);
    expect(isObserved).toEqual(true);
  });

  it('should remove', () => {
    store.merge(store.friends, [{uuid: '1234', name: 'ahitler'}]);
    expect(store.friends).toHaveLength(1);

    store.remove(store.friends, [{uuid: '1234'}]);
    expect(store.friends).toHaveLength(0);
  });
});
