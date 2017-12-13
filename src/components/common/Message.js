import React, { Component } from "react"
/**
 *
 * Error and Message Class
 *
 */
class Message extends  Component {

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
            type: false,
            msgTypeTitle: ''
        };
    }

    /**
     * Html render for Error render
     * render
     *  @return {ReactElement} markup
     */
    renderError() {
        return (
            <div style={{textAlign: 'left'}}><div className="alert alert-danger alert-dismissable" style={{"marginTop": "1em"}}>
                <a href="#" className="close" data-dismiss="alert" aria-label="close">×</a>
                <span style={{float: "left", marginTop: "0.125em"}} className="glyphicon glyphicon glyphicon-remove-circle"></span>
                {this.props.msgTypeTitle != null ? (<strong style={{"float": "left"}}>{this.props.msgTypeTitle}!</strong>) : null }
                <ul style={{"padding": "0 1.25em", textAlign: 'left'}}>
                    {this.props.errors.map(function(value, i) {
                        return <li style={{padding: "0px"}}>{value}</li>
                    })}
                </ul>
            </div></div>
        )
    }

    /**
     * Html render for Success render
     *render
     *  @return {ReactElement} markup
     */
    renderSuccess() {
        if(this.props.errors!='') {
            return (
                <div style={{textAlign: 'left'}}><div className="alert alert-success alert-dismissable" style={{marginTop: "1em"}}>
                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                    <strong style={{"float": "left"}}>{this.props.msgTypeTitle}!</strong>
                    <dd>{this.props.errors}</dd>
                </div></div>
            );
        } else {
            return (
                <dd></dd>
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