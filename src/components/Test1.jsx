import React, { Component } from 'react';
//import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react';

@observer
class Test1 extends  Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        return (
            <div>    Seconds passed: {this.props.appState.timer} </div>
        );
    }
}

/*
var Test = observer(React.createClass({
    render: function() {
        return (<button onClick={this.onReset}>
            Seconds passed: {this.props.appState.timer}
        </button>);
    },
    onReset: function() {
        this.props.appState.resetTimer();
    }
}));
*/
export default Test1;