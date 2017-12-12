import React,{ Component } from 'react';

class App extends Component{
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} child app class
         */
        this.state = {
            counter : 0,
            counter1 : 0
        }
    }

    clickIt(){
         let { counter } = this.state;
         counter += 1;
         this.setState({
             counter
         });
    }


    render() {
        let  { counter  }= this.state;
        return (
            <div>
                <h1>Testing compo </h1>
                <h2>Counter : { counter }</h2>
                <button onClick={this.clickIt.bind(this)}> Increment </button>
            </div>
        );
    }
}
export default App;
