//external
import React, { Component } from "react"

// internal
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"



class SubmitButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
					buttonClass: (this.props.buttonClass) ? this.props.buttonClass : "btn square-small-btn",
					buttonText: (this.props.buttonText) ? this.props.buttonText : "Submit",
					ajaxLoading: (this.props.ajaxLoading) ? this.props.ajaxLoading : false
        }

    }

		componentWillReceiveProps(nextProps){
				//console.log("submit will receive", nextProps.ajaxLoading);
				this.state.ajaxLoading = nextProps.ajaxLoading;
		}

    render() {
        const {t} = this.props;

        let onClick = this.props.onClick;
        let buttonText = this.state.buttonText;
				let buttonClass = this.state.buttonClass;

        let buttonState;
        let spinnerState;
        if(this.state.ajaxLoading){
            buttonState = true;
            spinnerState =  true;
        }else{
            buttonState = false;
            spinnerState = false;
        }

        return (
						<button type="button" className={buttonClass} disabled={buttonState} onClick={onClick}>
                {(spinnerState) ? <i className="fa fa-spinner fa-spin"></i> : null}&nbsp;
                {t(buttonText)}
            </button>
        )

    }
}

export default TranslationWrapper(translate("SubmitButton")(SubmitButton));
