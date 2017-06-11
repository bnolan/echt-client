/* globals it, expect, jest */

import store from '../state/store';

jest.mock('react-native-fs');

it('loads', () => {
  expect(store).toBeTruthy();
});

it('should be empty', () => {
  expect(store.uploads).toHaveLength(0);
  expect(store.photos).toHaveLength(0);
  expect(store.friends).toHaveLength(0);
});
