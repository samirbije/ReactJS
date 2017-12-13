import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';


import Itinerary from "./components/Itinerary";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<Itinerary translations={translations} mode="outbound"/>,  document.getElementById("reservation-list"));
