

import App from '../client/components/App/App';

describe('#App component', () => {
    it('h2 present', () => {
        const wrapper = mount(<App/>);
        expect(wrapper.find('h1').length).equal(1)
    });
});
