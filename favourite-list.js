import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';


import MyFavouritesList from "./components/favourites/MyFavouritesList";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';




var store = createStore(containerApp);
CommonRenderer.render(store);


ReactDOM.render(<MyFavouritesList translations={translations} store={store} />,  document.getElementById("favourite-list"));





