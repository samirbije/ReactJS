
import React, { Component } from "react"
import { translate } from "react-translate";
import { Carousel } from 'react-responsive-carousel';

import TranslationWrapper from "../i18n/TranslationWrapper";
import BankAccountFormModal from "./BankAccountFormModal";


class BankAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ajaxLoading: true,
            account: {},
            componentState: null,
            identificationDocList: [],
            userIdentDocList: []
        }
    }

    componentDidMount() {
        this.getBankAccountDetails();
    }

    getBankAccountDetails(){
        var self = this;

        let url = baseMVacationApiUrl + "/user/0/bank";

        let onSuccessMethod = (data) => {
            self.setState({
                account: data,
                ajaxLoading: false,
                componentState: 1,
                identificationDocList : data.bankIdentDocList,
                userIdentDocList: data.userIdentDocList
            });
        }

        let onFailMethod = (err) => {
            console.log("error");
            self.setState({
                componentState: 0,
                ajaxLoading: false
            });
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    handleSubmitClick(){
        this.setState({
            componentState: 2
        })
    }

    getType(value){
        if(value == "SUBMITTED") {
            return "Confirming";
        } else if (value == "REJECTED") {
            return "Rejected";
        } else if (value == "VERIFIED"){
            return "Verified";
        } else {
            return "";
        }
    }

    render() {
        //console.log(this.state.account);
        const {t} = this.props;
        self = this;
        let bankInfo = this.state.account;
        let state = this.state.componentState;
        let imgList = this.state.identificationDocList;
        let userIdenList = this.state.userIdentDocList;
        let imgUrlList =[];
        let userIdenUrlList = [];

        let bankName = (bankInfo.bank && bankInfo.bank.name) ? bankInfo.bank.name +　"（"　+ bankInfo.bank.phonetic.trim() + "）" : "";
        let branchName = (bankInfo.branch && bankInfo.branch.name) ? bankInfo.branch.name + "（"　+ bankInfo.branch.phonetic.trim() + "）" : "";

        if (imgList.length) {
            imgList.map((item,i) => {
                let src = baseMVacationApiUrl + "/media/" + item.id + "/data";
                imgUrlList.push(src);
            })
        }

        if (userIdenList.length) {
            userIdenList.map((item,i) => {
                let src = baseMVacationApiUrl + "/media/" + item.id + "/data";
                userIdenUrlList.push(src);
            })
        }

            return (
                    <div className="tab-content container">
                        <div className="hidden-xs mb-50 space-50"></div>
                        <div className="row mb-100">
                            { (state === 1) ?
                                <div>
                                    <div className="col-sm-3 hidden-xs center">{t('Account Information')}</div>
                                    <div className="col-sm-9 col-xs-12 border-left">
                                        <h4>{t("Bank Account Information")}</h4>
																				<div className="form-group col-xs-12">
                                            <label>{t("Holder Name")}</label>
                                            <div>{bankInfo.holderName}</div>
                                        </div>
                                        <div className="form-group col-sm-6 col-xs-12">
                                            <label>{t('Bank Name')}</label>
                                            <div>{bankName}</div>
                                        </div>
                                        <div className="form-group col-sm-6 col-xs-12">
                                            <label>{t('Bank Branch')}</label>
                                            <div>{branchName}</div>
                                        </div>
                                        <div className="form-group col-sm-6 col-xs-12">
                                            <label>{t('Account Type')}</label>
                                            <div>{t(bankInfo.accountType)}</div>
                                        </div>
                                        <div className="form-group col-sm-6 col-xs-12">
                                            <label>{t("Account Number")}</label>
                                            <div>{bankInfo.accountNumber}</div>
                                        </div>
                                        <div className="form-group col-sm-12 col-xs-12">
                                            <label>{t("Account Status")}</label>
                                            <div>{t(self.getType(bankInfo.status))}</div>
                                        </div>
                                        <h4>{t("Bank Account Image")}</h4>
                                        <div className="form-group col-xs-12">
                                            <div className="carousel-inner" style={{"maxWidth":"650px"}}>
                                            {(imgUrlList.length) ?
                                                <Carousel showThumbs={true} showArrows={true} >
                                                    {
                                                        imgUrlList.map((item, i) => {
                                                            return(
                                                                <div  key={i}>
                                                                    <img src= {item}/>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Carousel>
                                                :null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 mb-50 space-50"></div>
                                    <div className="col-sm-3 hidden-xs center">{t('User Identification Information')}</div>
                                    <div className="col-sm-9 col-xs-12 border-left">
                                        <h4>{t("User Identification Image")}</h4>
                                        <div className="form-group col-xs-12">
                                            <div className="carousel-inner" style={{"maxWidth":"650px"}}>
                                            {(userIdenUrlList.length) ?
                                                <Carousel showThumbs={true} showArrows={true} >
                                                    {
                                                        userIdenUrlList.map((item, i) => {
                                                            return(
                                                                <div  key={i}>
                                                                    <img src= {item}/>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Carousel>
                                                :null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group col-xs-12 mb-100  center">
                                        <button onClick={this.handleSubmitClick.bind(this)} type="button" className="btn button-medium">{t("Edit")}</button>
                                    </div>
                                </div>
                                : (state === 2) ?
                                <div>
                                    <BankAccountFormModal bankInfo={this.state.account} {...this.props} />
                                </div>
                                : (state === 0) ?
                                <div>
                                    <BankAccountFormModal bankInfo={{}} {...this.props} />
                                </div>
                                : null
                                }

                        </div>
                    </div>

            );

    }
}

export default TranslationWrapper(translate("BankAccount")(BankAccount));
