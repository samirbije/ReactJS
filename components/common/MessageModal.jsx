//external
import React, { Component } from "react"
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';

// internal
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"



class MessageModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: this.props.msg,
            id: this.props.id
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        (this.props.onClick) ? this.props.onClick() : null;
    }

    render() {
        const {t} = this.props;
        let msg = this.state.msg;
        let id = this.state.id
        return (
            <div className="modal fade" id={id} role="dialog" data-keyboard="false" data-backdrop="static">
                <div className="modal-dialog modal-md">
                    <div className="modal-content" style={{"wordBreak": "break-all"}}>
                        <div className="modal-body">
                            <div className="text-center">
                                <p>{msg}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="text-center">
                                <button type="button" className="square-button btn btn-default" data-dismiss="modal" onClick={this.onClick}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}

export default TranslationWrapper(translate("MessageModal")(MessageModal));
