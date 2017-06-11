/* globals it, expect, jest */

import 'react-native';
import React from 'react';
import store from '../state/store';
import td from 'testdouble';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-fs');

it('loads', () => {
  expect(store).toBeTruthy();
});

it('should be empty', () => {
  expect(store.uploads).toHaveLength(0);
  expect(store.photos).toHaveLength(0);
  expect(store.friends).toHaveLength(0);
});
