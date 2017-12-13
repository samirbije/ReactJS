import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

import PopularCity from "./components/PopularCity";
import PopularAccommodation from './components/homepage/PopularAccommodation';
import TopPageReview from "./components/reviews/TopPageReview";
import CommonRenderer from "./common/common-renderer";
import containerApp from './reducers/reducers';

var store = createStore(containerApp);
CommonRenderer.render(store);

ReactDOM.render(<PopularCity />, document.getElementById('popular-cities'));
ReactDOM.render(<TopPageReview translations={translations} />, document.getElementById('popular-review'));

ReactDOM.render(<PopularAccommodation translations={translations} store={store}/>, document.getElementById('popular-property-list'));


