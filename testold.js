import React from 'react';
import ReactDOM from 'react-dom';
import {observable} from 'mobx';
import Test from "./components/Test";
import Test1 from "./components/Test1";
import appState from "./mobx/mobx1";

ReactDOM.render(<Test1 appState={appState} />,document.getElementById("test1"));
ReactDOM.render(<Test appState={appState} />,document.getElementById("test"));