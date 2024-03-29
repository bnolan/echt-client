/* globals describe, beforeEach, it, expect, jest */

import {EchtStore} from '../state/store';
import {ObservableMap, observe, useStrict} from 'mobx';

jest.mock('react-native-fs');

describe('store', () => {
  let store;

  beforeEach(() => {
    useStrict(false);
    store = new EchtStore();
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

  it('should observe on merge', () => {
    let isObserved = false;

    observe(store.friends, (changes) => {
      isObserved = true;
      expect(changes.type).toEqual('splice');
    });

    store.merge(store.friends, [{uuid: '1234', name: 'amerkel'}]);
    expect(isObserved).toEqual(true);
  });

  it('should remove', () => {
    store.merge(store.friends, [{uuid: '1234', name: 'ahitler'}]);
    expect(store.friends).toHaveLength(1);

    let isObserved = false;

    observe(store.friends, (changes) => {
      isObserved = true;
      expect(changes.type).toEqual('splice');
    });

    store.remove(store.friends, [{uuid: '1234'}]);
    expect(isObserved).toEqual(true);
    expect(store.friends).toHaveLength(0);
  });

  it('should generate upload', () => {
    const upload = store.generateUpload();

    expect(upload).toBeInstanceOf(ObservableMap);
    expect(upload.get('uuid').length).toEqual(36);
    expect(store.uploads.length).toEqual(1);
  });

  it('should getPhoto', () => {
    store.merge(store.photos, [{uuid: '1234', url: 'beep://boop'}]);

    const photo = store.getPhoto('1234');
    expect(photo).toBeTruthy();
    expect(photo.get('uuid')).toEqual('1234');
    expect(store.getPhoto('6969')).toBeFalsy();
  });

  it('should getFriend', () => {
    store.merge(store.friends, [{uuid: '4545', name: 'dtrump'}]);

    expect(store.getFriend('4545')).toBeTruthy();
    expect(store.getFriend('6969')).toBeFalsy();
  });
});
