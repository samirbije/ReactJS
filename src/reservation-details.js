import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import ReservationDetails from "./components/ReservationDetails";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<ReservationDetails translations={translations}/>,  document.getElementById("reservation-details"));
