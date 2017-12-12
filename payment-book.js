import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import PaymentBook from "./components/payment/PaymentBook";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);

ReactDOM.render(<PaymentBook translations={translations}/>,  document.getElementById("payment-book"));
