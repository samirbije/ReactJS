import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import SearchResult from "./components/SearchResult";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';


var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<SearchResult translations={translations} store={store}/>,  document.getElementById("search-result"));