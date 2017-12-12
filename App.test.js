import React from 'react';
import App from './App';
import { shallow } from 'enzyme';

// test case for javascript function
    describe ('<App />', () => {
        it('renders 1 <App /> component' , () => {
            const component = shallow(<App  name="app"/>);
            expect(component).toHaveLength(1);
          });

        it('it renders props correctly ' ,() => {
            const component = shallow (<App name="app" />);
            expect(component.instance().props.name).toBe('app');
        });

        it('it updates the counter on button click ' , () =>{
            const component = shallow (<App /> );
            //console.log(component);
            const button = component.find('button');
            //console.log(button.props());
            button.simulate('click');
            expect(component.state().counter).toEqual(1);
        });
    });
