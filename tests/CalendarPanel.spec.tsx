import React from 'react';
import Adapter from 'enzyme-adapter-react-15';
import { default as Enzyme, render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { CalendarPanel } from '../src';

Enzyme.configure({ adapter: new Adapter() });

describe('CalendarPanel', () => {
  it('renders correctly', () => {
    const wrapper = render(
      <CalendarPanel
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
