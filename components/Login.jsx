//external
import React from 'react';

// internal

import validateInput from './validation/signin';
import TextFieldGroup from './common/TextFieldGroup';
import Message from "./common/Message";
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: {
                email: '',
                password: '',
                stayLogin: false
            },
            errors: [],
            isLoading: false,
            invalid: false,
            type: false

        }
   }

   isValid() {
        const { errors, isValid } = validateInput(this.state.login);
        console.log("ll" + errors);
        if (!isValid) {
            this.setState({ errors });
        }
        return isValid;
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({type:false, errors:[] });
        this.state.login.stayLogin = $("#stayLogin").prop("checked");
        const self = this;

        let url = baseCmsUrl + "/user/authenticate";
        let ctype = "x-www-form";
        let onSuccessMethod = (data) => {
            location = window.location.href;
        }

        let onFailMethod = (err) => {
           // console.log(error.data.message);
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
            $("#loginModal .alert").show();
            self.setState({type: true});
            self.setState({errors: msgArr});
        }

        ajaxCall(url, "POST", this.state.login, onSuccessMethod, onFailMethod);
    }

    onInputChange(e) {
        this.state.login[e.target.name] = e.target.value;
    }



    render() {
        const { errors } = this.state;
        const {t} = this.props;
        return (

            <div className="modules-login-form">
                <Message errors={this.state.errors} type={this.state.type} />
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 modal-login-left">
                        <form method="POST" name="login-form">
                            <TextFieldGroup
                                error={errors.email}
                                label={t("Email")}
                                onChange={this.onInputChange.bind(this)}
                                value={this.state.email}
                                field="email"
                                placeholder={t("Email")}
                                required="required"
                            />

                            <TextFieldGroup
                                error={errors.password}
                                label={t("Password")}
                                onChange={this.onInputChange.bind(this)}
                                value={this.state.password}
                                field="password"
                                type="password"
                                placeholder={t("Password")}
                                required="required"

                            />
                            <div className="login-box-login-button">
                                <input type="button" id="loginButton" value={t("Login")}  onClick={this.onSubmit.bind(this)}/>
                            </div>
                            <div className="login-box-remember-me checkbox">
                                <label>
                                    <input type="checkbox" id="stayLogin" name="stayLogin"/>
                                    <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                    <span id="stay-login">{t("Stay logged in")}</span>
                                </label>
                            </div>
                            <div className="login-box-password-lost  col-xs-12 " style={{textAlign: 'left' }}>
                                <span>
                                <a data-toggle="modal" data-target="#forgetPasswordModal" data-dismiss="modal" href="#">{t("Did you forget your password?")}</a>
                                </span>
                            </div>
                        </form>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <label>SNS</label>
                        <a href={ baseMOAuthUrl + "/social/facebook?callback=" + encodeURI(baseCmsUrl + "/user/authenticate/sns")} className="btn-login-social btn-login-facebook"><i className="icon-social-facebook"></i>{t("Login with Facebook")}</a>
                        <a href={ baseMOAuthUrl + "/social/twitter?callback=" + encodeURI(baseCmsUrl + "/user/authenticate/sns")} className="btn-login-social btn-login-twitter"><i className="icon-social-twitter"></i>{t("Login with Twitter")}</a>
                        <a href={ baseMOAuthUrl + "/social/google?callback=" + encodeURI(baseCmsUrl + "/user/authenticate/sns")} className="btn-login-social btn-login-google"><i className="icon-social-google"></i>{t("Login with Google")}</a>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center have-account">
                        {t("Do not have an account?")} <a data-toggle="modal" data-target="#signupModal" data-dismiss="modal" href="#">{t("Register")}</a>
                    </div>
                </div>

            </div>
        );
    }
}

export default TranslationWrapper(translate("Login")(Login))