import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { expect } from 'chai';

global.shallow = shallow;
global.expect = expect;
global.render = render;
global.mount = mount;
global.React = React;
// Обрушим тест при любой ошибке
console.error = message => {
    throw new Error(message);
};

configure({ adapter: new Adapter() });
