//external
import React, { Component } from "react"

// internal

import validateInput from './validation/signup';
import TextFieldGroup from './common/TextFieldGroup';
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"
import Message from "./common/Message";


class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '' ,
            signup: {
                // username: '',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                passwordConfirmation: '',
                // isDeveloper:false
            },
            errors: {},
            type: false,
            msg:[],
            invalid: false,
            isLoading: false
        }
    }

    isValid() {
        const { errors, isValid } = validateInput(this.state.signup);
        console.log("ll" + errors);
        if (!isValid) {
            this.setState({ errors });
        }
        return isValid;
    }

    validatePassword(){
        window.scrollTo(0, 0);
        const { t } = this.props;
        if(($("#password").val() == "") || ($("#password").val() != $("#confirm_password").val())) {
            var msgArr = [];
            var message = t("Password and confirm password must be same");
            // this.setState({ errors });
            msgArr.push(message);
            this.setState({type: true});
            this.setState({msg: msgArr});
            $("#signupModal div.alert").show();
            return false;
        } else {
            //confirm_password.setCustomValidity('');
            return true;
        }
    }

    checkTermsAndConditionChecked(){
        window.scrollTo(0, 0);
        const { t } = this.props;
            if (!$("#tac-agreement").is(":checked")){
                var msgArr = [];
                var message = t("Please click checkbox to agree on terms and condition");
                // this.setState({ errors });
                msgArr.push(message);
                this.setState({msg: msgArr});
                this.setState({type: true});
                $("#signupModal div.alert").show();
                return false
            } else {
                return true
            }
    }

    handleSubmit(e) {
        e.preventDefault();
        window.scrollTo(0, 0);
        this.setState({type:false, msg:[] });
        if (!this.validatePassword()) return;
        if (!this.checkTermsAndConditionChecked()) return;
            //this.setState({errors: {}, isLoading: true});
            let signup = this.state.signup;
            const self = this;
            delete signup.passwordConfirmation;

            let url = baseMOAuthUrl + "/user";

            let onSuccessMethod = (data) => {
                delete signup.firstName;
                delete signup.lastName;
                self.setState({email:'',
                    password:'',
                    passwordConfirmation:'',
                    firstName:'',
                    lastName:''});
                $('#sign-up-form')[0].reset();
                $('#signupModal').modal('hide');
                $('#signupMessageModal').modal('show');
            }

            let onFailMethod = (err) => {
                window.scrollTo(0, 0);
                var msgArr = [];
                if(err.responseJSON && err.responseJSON.details) {
                    err.responseJSON.details.forEach(function (item) {
                        msgArr.push(item.message);
                    });
                }else if(err.responseJSON){
                    msgArr.push(err.responseJSON.message);
                }else {
                    msgArr.push(err.responseText);
                }
                self.setState({type: true});
                self.setState({msg: msgArr});
            }
			
            ajaxCall(url, "POST", signup, onSuccessMethod, onFailMethod, "sign-up");

        //}
    }
    onInputChange(e) {
        this.state.signup[e.target.name] = e.target.value;
    }



    render() {
        const { errors } = this.state;
        const { t } = this.props
        return (
            <div className="modules-signup-form">
                <form onSubmit={this.handleSubmit.bind(this)} name="sign-up-form" id="sign-up-form" >
                    <Message errors={this.state.msg} type={this.state.type} id="msdsdsds"></Message>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 modal-signup-form-left">
                            <div className="modal-signup-form-left-input">
                                <input type="firstName"  name="firstName" className="form-control" id="examplePrice" placeholder={t("First Name")} onChange={this.onInputChange.bind(this)} />
                            </div>
                            <div className="modal-signup-form-left-input">
                                <TextFieldGroup
                                    error={errors.lastName}
                                    label={t("Last Name")}
                                    onChange={this.onInputChange.bind(this)}
                                    value={this.state.lastName}
                                    field="lastName"
                                    placeholder={t("Last Name")}
                                />
                            </div>

                            <div className="modal-signup-form-left-input">
                                <TextFieldGroup
                                    error={errors.email}
                                    label={t("Email")}
                                    onChange={this.onInputChange.bind(this)}
                                    value={this.state.email}
                                    field="email"
                                    placeholder={t("Email")}
                                    required="required"
                                    type="email"
                                />
                            </div>
                            <div className="modal-signup-form-left-input">
                                <TextFieldGroup
                                    error={errors.password}
                                    label={t("Password")}
                                    onChange={this.onInputChange.bind(this)}
                                    value={this.state.password}
                                    field="password"
                                    type="password"
                                    id="password"
                                    placeholder={t("Password")}
                                    required="required"
                                />
                            </div>
                            <div className="modal-signup-form-left-input">
                                <TextFieldGroup
                                    error={errors.passwordConfirmation}
                                    label={t("Password Confirmation")}
                                    onChange={this.onInputChange.bind(this)}
                                    value={this.state.passwordConfirmation}
                                    field="passwordConfirmation"
                                    type="password"
                                    id="confirm_password"
                                    placeholder={t("Password Confirmation")}
                                    required="required"
                                />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="module-signup-form-social-media">
                                <span>{t("Signup with SNS")}</span>
                                <a href={ baseMOAuthUrl + "/social/facebook?callback=" + encodeURI(baseCmsUrl + "/user/authenticate/sns")} className="btn-login-social btn-login-facebook"><i className="icon-social-facebook"></i>{t("Facebook")}</a>
                                <a href={ baseMOAuthUrl + "/social/twitter?callback=" + encodeURI(baseCmsUrl + "/user/authenticate/sns")} className="btn-login-social btn-login-twitter"><i className="icon-social-twitter"></i>{t("Twitter")}</a>
                                <a href={ baseMOAuthUrl + "/social/google?callback=" + encodeURI(baseCmsUrl + "/user/authenticate/sns")} className="btn-login-social btn-login-google"><i className="icon-social-google"></i>{t("Google")}</a>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 modal-signup-form-left mt-20">
                            <div className="modal-signup-form-left-terms checkbox">
                                <label>
                                    <input type="checkbox" name="signup-agreement-receive-notification" />
                                    <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                    {t("I would like to receive SMS · mobile · email delivery of m-vacation promotion information filled with plenty of discounts, questionnaires, travel ideas, and love.")}
                                </label>
                            </div>

                            <div className="modal-signup-form-left-terms checkbox">
                                <label>
                                    <input type="checkbox" name="tac-agreement" id ="tac-agreement"/>
                                    <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                    {t("By signing up, I agree to mVacation")}&nbsp;<a target="_blank" href={baseCmsUrl + "/terms"}>{t("Terms and conditions")}</a>
                                </label>

                            </div>

                            <div className="modal-signup-form-left-input signup-box-button">
                                <input type="submit" id="signupButton" value={t("Signup")}/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default TranslationWrapper(translate("SignupForm")(SignupForm))
//export default SignupForm;