import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
// internal
import Review from "./components/Review";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<Review translations={translations} />, document.getElementById("review"))
