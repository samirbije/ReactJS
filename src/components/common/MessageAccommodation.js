import React from 'react';

/**
 *
 * Error and Message Class
 *
 */
class Message extends  React.Component {

    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} AppPost  Apps
         */
        this.state = {
            errors: [],
            type: false
        };
    }

    /**
     * Html render for Error render
     * render
     *  @return {ReactElement} markup
     */
    renderError() {
        return (
         <div className="alert alert-danger center" role="alert" id="errorMessage" style={{textAlign: 'left'}}>
            <dl>
                {this.props.errors.map(function(value,i) {
                    return <dd key={i} >{value}
                    </dd>
                })}
            </dl>
        </div>
        )
    }

    /**
     * Html render for Success render
     *render
     *  @return {ReactElement} markup
     */
    renderSuccess() {
       // console.log("ff" + this.props.errors);
        if(this.props.errors!='') {
            return (
                <div className="alert alert-success center" role="alert" id="successfulSave" style={{textAlign: 'left'}}>
                    {this.props.errors}
                </div>
            );
        }
        else {
            return (
                <span></span>
            );
        }
    }

    /**
     * render
     * @returns {ReactElement}
     */
    render() {
        if(this.props.type) {
            return this.renderError();
        }else {
            return this.renderSuccess();
        }
    }
}
export default Message;