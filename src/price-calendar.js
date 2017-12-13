import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import PriceCalendar from "./components/PriceCalendar";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';

var store = createStore(containerApp);
CommonRenderer.render(store);

//function sum1(a, b) {
  //  return a + b;
//}

ReactDOM.render(<PriceCalendar translations={translations} />,  document.getElementById("price-calendar"));