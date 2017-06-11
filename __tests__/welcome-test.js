/* globals it, expect */

import 'react-native';
import React from 'react';
import Welcome from '../screens/welcome/Welcome';
import td from 'testdouble';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <Welcome navigation={{navigate: () => td.function()}} />
  );

  expect(tree).toBeTruthy();
});
