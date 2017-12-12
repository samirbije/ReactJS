import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';


import AccommodationList from "./components/AccommodationList";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);

ReactDOM.render(<AccommodationList translations={translations} />,  document.getElementById("accommodation-list"));

