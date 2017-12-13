//external
import React, { Component } from 'react';
import { translate } from "react-translate";
import Select from 'react-select';
import { Carousel } from 'react-responsive-carousel';

//internal
import TranslationWrapper from "../i18n/TranslationWrapper";
import TextFieldGroup from '../common/TextFieldGroup';
import MultipleImageUploader from './MultipleImageUploader';
import MessageAccommodation from "../common/MessageAccommodation";


class BankAccountFormModal extends Component {

    constructor(props) {
        super(props);
        let bankInfo = this.props.bankInfo;
        this.state = {
            validationMessage: "",
            validationType: false,
            clearable: false,
            searchable: true,
            selectedBank: (bankInfo.bank) ? bankInfo.bank.code : 0,
            selectedBankCode: (bankInfo.bank) ? bankInfo.bank.code : 0,
            selectedBranch: (bankInfo.branch) ? bankInfo.branch.code : 0,
            selectedBranchCode: (bankInfo.branch) ? bankInfo.branch.code : 0,
            bankList: [],
            branchList: [],
            accountNumber: bankInfo.accountNumber,
            disable:0,
            accountType: bankInfo.accountType,
            identificationDocList: (bankInfo.bankIdentDocList) ? bankInfo.bankIdentDocList : [],
            userIdentificationDocList: (bankInfo.userIdentDocList) ? bankInfo.userIdentDocList : [],
            holderName: bankInfo.holderName

        };
    }

    componentDidMount(){
        this.getAllBank();
        if(this.state.selectedBankCode > 0) {
            this.getBankBranch(this.state.selectedBankCode);
        }
    }

    getAllBank(){
        var self = this;

        let url = baseMVacationApiUrl + "/bank";

        let onSuccessMethod = (data) => {
            self.setState({
                bankList: data.items,
                ajaxLoading: false
            });
        }

        let onFailMethod = (err) => {
            console.log("error");
            self.setState({
                ajaxLoading: false
            });
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    getBankBranch( code ) {
        var self = this;

        let url = baseMVacationApiUrl + "/bank/" + code + "/branch";

        let onSuccessMethod = (data) => {
            self.setState({
                branchList: data.items,
                ajaxLoading: false
            });
        }

        let onFailMethod = (err) => {
            console.log("error");
            self.setState({
                ajaxLoading: false
            });
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    switchBank(newValue){
        console.log("value: ",newValue);
        let banks = this.state.bankList;
        this.setState({
            selectedBank: newValue,
            selectedBankCode: newValue,
            clearable: false
        });
        (newValue) ? this.getBankBranch(newValue) : null;
    }

    switchBranch(newValue){
        let branches = this.state.branchList;
        this.setState({
            selectedBranch: newValue,
            selectedBranchCode: newValue,
            clearable: false
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});

    }

    handleTypeChange(e) {
        const isPublished = e.target.value;
        this.setState({
            accountType: isPublished
        });
    }

    handleBankDocUpload(value) {
        //console.log("handleBankDocUpload",value);
        let imgList = value
        this.setState({
            identificationDocList: imgList
        });
    }

    handleUserDocUpload(value){
        let imgList = value
        this.setState({
            userIdentificationDocList: imgList
        });
    }

    handleSubmitClick(e){
        e.preventDefault;
        let self = this;
        let account = {};
        let bank = {"code": this.state.selectedBankCode};
        let branch = {"code": this.state.selectedBranchCode};
        account = {
          "bank": bank,
          "branch": branch,
          "accountNumber": this.state.accountNumber,
          "accountType": this.state.accountType,
          "holderName": this.state.holderName,
          "bankIdentDocList": this.state.identificationDocList,
          "userIdentDocList": this.state.userIdentificationDocList
        }

        let url = baseMVacationApiUrl + "/user/0/bank";

        let onSuccessMethod = (data) => {
            //console.log("Success");
            location = baseCmsUrl + "/user-profile";
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
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
                validationMessage: errArr,
                validationType: true
            })
        }

        ajaxCall(url, "POST", account, onSuccessMethod, onFailMethod);
    }

    render() {
        const { t } = this.props;
        let banks = this.state.bankList;
        let bankOptions = [];
        let bankCodeOptions = [];
        let branches = this.state.branchList;
        let branchOptions = [];
        let branchCodeOptions = [];

        let bankImgList = this.state.identificationDocList;
        let userImgList = this.state.userIdentificationDocList;

        if (banks.length){
            banks.map((item, i) => {
                bankOptions.push({value: item.code, label: item.name +　"（"　+ item.phonetic.trim() + "）" });
                bankCodeOptions.push({value: item.code, label: item.code});
            }
        )}

        if (branches.length){
            branches.map((item, i) => {
                branchOptions.push({value: item.code, label: item.name +　"（"　+ item.phonetic.trim() + "）" });
                branchCodeOptions.push({value: item.code, label: item.code});
            }
        )}

        return (
            <div className="row">
                <form>
                    <div className="col-sm-3 hidden-xs center">{t('Bank Account Information')}</div>
                    <div className="col-sm-9 col-xs-12 border-left">
                        <MessageAccommodation errors={this.state.validationMessage} type={this.state.validationType} msgTypeTitle={this.state.msgTypeTitle} />
                        <div className="col-xs-12 mb-10"><h4>{t("Bank Account Input")}</h4></div>
                        <div className="form-group col-sm-12">
                            <TextFieldGroup
                                label={t("Holder Name")}
                                onChange={this.handleChange.bind(this)}
                                value={this.state.holderName}
                                field="holderName"
                                placeholder={t("Holder Name")}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group col-sm-6">
                            <label>{t('Bank Name')}</label>
                            <Select  placeholder={t("Select")} options={bankOptions} simpleValue clearable={this.state.clearable} name="selected-bank"  value={this.state.selectedBank} onChange={this.switchBank.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="form-group col-sm-6">
                            <label>{t('Bank Code')}</label>
                            <Select  placeholder={t("Select")} options={bankCodeOptions} simpleValue clearable={this.state.clearable} name="selected-bank"  value={this.state.selectedBankCode} onChange={this.switchBank.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="form-group col-sm-6">
                            <label>{t('Bank Branch')}</label>
                            <Select  placeholder={t("Select")} options={branchOptions} simpleValue clearable={this.state.clearable} name="selected-branch"  value={this.state.selectedBranch} onChange={this.switchBranch.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="form-group col-sm-6">
                            <label>{t('Branch Code')}</label>
                            <Select  placeholder={t("Select")} options={branchCodeOptions} simpleValue clearable={this.state.clearable} name="selected-branch"  value={this.state.selectedBranchCode} onChange={this.switchBranch.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="form-group col-sm-6">
                            <div>
                                <label>{t('Account Type')}</label>
                            </div>
                            <div className="col-xs-4">
                                <input type="radio" id="s-option" name="general" value="General"
                                       checked={this.state.accountType === "General"}
                                       onChange={this.handleTypeChange.bind(this)}/>
                                    <label>{t("General")}</label>
                            </div>
                            <div className="col-xs-4">
                                <input type="radio" id="s-option" name="current" value="Current"
                                       checked={this.state.accountType === "Current"}
                                       onChange={this.handleTypeChange.bind(this)}/>
                                    <label>{t("Current")}</label>
                            </div>
                            <div className="col-xs-4">
                                <input type="radio" id="s-option" name="saving" value="Saving"
                                       checked={this.state.accountType === "Saving"}
                                       onChange={this.handleTypeChange.bind(this)}/>
                                    <label>{t("Saving")}</label>
                            </div>
                        </div>
                        <div className="form-group col-sm-6">
                            <TextFieldGroup
                                label={t("Account Number")}
                                onChange={this.handleChange.bind(this)}
                                    value={this.state.accountNumber}
                                field="accountNumber"
                                placeholder={t("Account Number")}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group col-xs-12">
                            <h4>{t("Bank Account Image Upload")}</h4>
                            <div className="user-info-image clearfix">
                                <div className="user-info-note">
                                    <ul className="a">
                                        <label>{t("About Upload Document")}</label>
                                        <li>{t("Registered bank account information (One of the following is required)")}</li>
                                        <li style={{"textIndent": "10px"}}>{t("A. Passbook (Both the front cover and the opposite side of the front cover are necessary)")}</li>
                                        <li style={{"textIndent": "10px"}}>{t("B. Cashcard or internet banking (One of the following is required)")}</li>
                                        <li style={{"textIndent": "20px"}}>{t("1. Cashcard (Opposite side)")}</li>
                                        <li style={{"textIndent": "20px"}}>{t("2. Internet banking (Balance certificate)")}</li>
                                        <li style={{"textIndent": "20px"}}>{t("3. Internet banking (Images that can confirm the deposit name and account number)")}</li>
                                    </ul>
                                </div>
                                <MultipleImageUploader images={bankImgList} thumbTag={"bank"} callback={this.handleBankDocUpload.bind(this)} {...this.props}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 mb-50 space-50"></div>
                    <div className="col-sm-3 hidden-xs center">{t('User Identification Information')}</div>
                    <div className="col-sm-9 col-xs-12 border-left">
                        <div className="form-group col-xs-12">
                            <h4>{t("User Identification Image Upload")}</h4>
                            <div className="user-info-image clearfix">
                                <div className="user-info-note">
                                    <ul className="a">
                                        <label>{t("About Upload Document")}</label>
                                        <li>{t("Personal Varification Identification (One of the following is required)")}</li>
                                        <li style={{"textIndent": "10px"}}>{t("A. Driver License (Need both sides)")}</li>
                                        <li style={{"textIndent": "10px"}}>{t("B. Passport (Need both holder photo page and address page)")}</li>
                                        <li style={{"textIndent": "10px"}}>{t("※ If the address in personal identification certificate does not match currently residing certificate, please submit the picture of current receipt of utility fee.")}</li>
                                    </ul>
                                </div>
                                <MultipleImageUploader images={userImgList} thumbTag={"user"} callback={this.handleUserDocUpload.bind(this)} {...this.props}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 mb-100  center">
                        <button onClick={this.handleSubmitClick.bind(this)} type="button" className="btn button-medium">{t("Submit")}</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default TranslationWrapper(translate("BankAccountFormModal")(BankAccountFormModal));
