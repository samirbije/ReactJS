//external
import React, { Component } from "react"
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";
import BankAccountFormModal from "./BankAccountFormModal";
import Select from 'react-select';

//internal
import Message from "../common/Message";
import TextFieldGroup from '../common/TextFieldGroup';

class PasswordChange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            currentPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
            user: {},
            msg: [],
            type: false
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        this.setState({
            email: newProps.email
        })
    }

    checkPasswordMatch(){
        window.scrollTo(0, 0);
        const { t } = this.props;
        let currentPassword = this.state.currentPassword;
        let newPassword = this.state.newPassword;
        let newPasswordConfirm = this.state.newPasswordConfirm;

        if(currentPassword === "" || newPassword === "" || newPasswordConfirm === "") {
            var msgArr = [];
            var message = t("Please fill all the input box");
            // this.setState({ errors });
            msgArr.push(message);
            this.setState({
                msg: msgArr,
                type: true
                });
            return false;
        } else if (newPassword !== newPasswordConfirm){
            var msgArr = [];
            var message = t("New Password and Confirm New Password is not matching");
            // this.setState({ errors });
            msgArr.push(message);
            this.setState({
                msg: msgArr,
                type: true
                });
            return false;
        }else{
            return true;
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});

    }

    handleSubmitClick(e){
        e.preventDefault();
        let self = this;
        const {t} = this.props;

        if (this.checkPasswordMatch()){
            let url = baseMOAuthUrl + "/user/password";

            let user = {};
            user.oldPassword = this.state.currentPassword;
            user.password = this.state.newPasswordConfirm;

            let onSuccessMethod = (data) => {
                console.log("success");
                let errArr = [];
                errArr.push(t("Password changed successfully"));
                self.setState({
                    msg: errArr,
                    type: false,
				            currentPassword: "",
				            newPassword: "",
				            newPasswordConfirm: ""
                });
            }

            let onFailMethod = (err) => {
                console.log("error");
                let errArr = [];
                if(err.responseJSON && err.responseJSON.details) {
                    err.responseJSON.details.forEach(function (item) {
                        errArr.push(item.message);
                    });
                }else if(err.responseJSON){
                    errArr.push(err.responseJSON.message);
                }else {
                    errArr.push(err.responseText);
                }
                self.setState({
                    msg: errArr,
                    type: true
                });
            }

            ajaxCall(url, "PUT", user, onSuccessMethod, onFailMethod);
        }
    }

    render() {
        //console.log(this.state.bankAccount);
        const {t} = this.props;

        return (
            <div className="tab-content">
            <div className="hidden-xs mb-50 space-50"></div>
                <div className="row">
                <form>
                    <div className="col-sm-3 hidden-xs center">{t('Password Change')}<span className="hrlong hidden-xs"></span></div>
                    <div className="col-sm-9 col-xs-12 mb-100">
                        <Message errors={this.state.msg} type={this.state.type}/>
                        <div className="form-group col-sm-8">
                            <label>{t('Email')}</label>
                            <div>{this.state.email}</div>
                        </div>
                        <div className="form-group col-sm-8">
                            <TextFieldGroup
                                label={t("Current Password")}
                                onChange={this.handleChange.bind(this)}
                                value={this.state.currentPassword}
                                field="currentPassword"
                                type="password"
                                placeholder={t("Current Password")}
                                className="form-control"

                            />
                        </div>
                        <div className="form-group col-sm-8">
                            <TextFieldGroup
                                label={t("New Password")}
                                onChange={this.handleChange.bind(this)}
                                value={this.state.newPassword}
                                field="newPassword"
                                type="password"
                                placeholder={t("New Password")}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group col-sm-8">
                            <TextFieldGroup
                                label={t("Confirm New Password")}
                                onChange={this.handleChange.bind(this)}
                                value={this.state.newPasswordConfirm}
                                field="newPasswordConfirm"
                                type="password"
                                placeholder={t("Confirm New Password")}
                                className="form-control"
                                required
                            />
                        </div>
		                    <div className="col-xs-12 col-sm-8">
		                        <button onClick={this.handleSubmitClick.bind(this)} type="button" className="btn btn-primary">{t("Submit")}</button>
		                    </div>
                    </div>
                 </form>
                </div>
            </div>

        );

    }
}

export default TranslationWrapper(translate("PasswordChange")(PasswordChange));
