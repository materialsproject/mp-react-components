import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '@testing-library/jest-dom';
import React from 'react';

Enzyme.configure({
  adapter: new Adapter()
});
