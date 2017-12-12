import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import Accommodation from "./components/Accommodation";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);

ReactDOM.render(<Accommodation translations={translations} store={store} />,  document.getElementById("accommodation-profile"));


