import React, { Component } from 'react';
//import { action, extendObservable } from 'mobx'
import { observer } from 'mobx-react';

@observer
class Test extends  Component {

    constructor(props) {
        super(props);
        this.state = {
            status : 0
        }
    }

    onReset() {
        this.setState({
            status: 0,
        })
        this.props.appState.resetTimer('DELETE_FAVOURITE');
    }

    onSet() {
        this.setState({
            status: 1,
        })
        this.props.appState.resetTimer('ADD_FAVOURITE');
    }

    render() {
        return (
        this.state.status == 0 ?
            <button onClick={this.onSet.bind(this)}>
                Click It
            </button>
        :
            <button onClick={this.onReset.bind(this)}>
                Delete It
            </button>
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
export default Test;