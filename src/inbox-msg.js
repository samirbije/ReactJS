import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import InboxMessage from "./components/inbox/InboxMessage";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<InboxMessage translations={translations} />,  document.getElementById("inbox-msg-page"));