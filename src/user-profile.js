import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

import UserProfile from "./components/UserProfile";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<UserProfile translations={translations} />,  document.getElementById("user-profile"));
