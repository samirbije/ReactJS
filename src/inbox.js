import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import Inbox from "./components/inbox/Inbox";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<Inbox translations={translations} />,  document.getElementById("inbox-page"));