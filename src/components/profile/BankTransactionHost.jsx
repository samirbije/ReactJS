//external
import React, { Component } from "react"
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";
import BankAccountFormModal from "./BankAccountFormModal";
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';

//internal
import Message from "../common/Message";
import TextFieldGroup from '../common/TextFieldGroup';
import BankBalanceDetail from "./BankBalanceDetail";

class BankTransactionHost extends Component {

    constructor(props) {
        super(props);
        let date = new Date();
        let fromDate = moment(date).format("YYYY-MM");
        let toDate = moment(date).format("YYYY-MM");
        this.state = {
            clearable: false,
            ajaxLoading: true,
            balanceList: [],
            fromDate: fromDate,
            toDate: toDate,
            longFromDate: "",
            longToDate: "",
            detailData: [],
            status: null
        }
    }

    componentDidMount() {
        this.getBankBalance();
    }

    setDates(){
        let fromDate = this.state.fromDate;
        let fromYear = parseInt(fromDate.slice(0,5));
        let fromMonth = parseInt(fromDate.slice(5,7)-1);

        let toDate = this.state.toDate;
        let toYear = parseInt(toDate.slice(0,5));
        let toMonth = parseInt(toDate.slice(5,7)-1);

        fromDate = new Date(fromYear, fromMonth, 1 );
        toDate = new Date (toYear, toMonth + 1, 0);

        this.state.longFromDate = moment(fromDate).format("YYYY-MM-DD");
        this.state.longToDate = moment(toDate).format("YYYY-MM-DD");
    }

    getBankBalance(){
        var self = this;

        this.setDates();

        let selectorJson = {};

        if(this.state.status){
            selectorJson = {
                "paidFrom": this.state.longFromDate,
                "paidTo": this.state.longToDate,
                "status": this.state.status
            }
        } else {
            selectorJson = {
                "paidFrom": this.state.longFromDate,
                "paidTo": this.state.longToDate
            }
        }
        let bytes = utf8.encode(JSON.stringify(selectorJson));
        let encoded = base64.encode(bytes);

        let url = baseMVacationApiUrl + "/user/0/balance?offset=0&size=-1&selector=" + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                balanceList: data.items,
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

    switchSortBy(e){
        this.setState({
            status: e.target.value
        });
    }

    switchFromDate(value){
        this.setState({
            fromDate: value
        })
    }

    switchToDate(value){
        this.setState({
            toDate: value
        })
    }

    handleBalanceDetail(value){
        this.setState({
            detailData: value
        })
    }

    handleSearch(){
        this.getBankBalance();
    }

    getStatus(value){
        if (value == "SCHEDULED") {
            return "Scheduled"
        } else if (value == "PAID") {
            return "Paid"
        } else {
            return ""
        }
    }

    render() {
        //console.log(this.state.bankAccount);
        const {t} = this.props;
        let self = this;
        let monthList = [];
        let monthOptions = [];
        let date = new Date();
        let year = date.getFullYear();

        for(var x=2; x>=1; x--){
            for(var i=12; i>=1; i--){
                let mon = i.toString();
                (mon.length == 1) ? mon = "0" + mon : null;
                monthOptions.push({value: year + "-" + mon  ,label: year + "-" + mon});
            }
            year--;
        }

        let balance = this.state.balanceList;

        return (
            <div className="row mb-100">
                <div className="col-xs-12">
                    <div className="col-sm-3 hidden-xs center">{t('Transaction as Host')}</div>
                    <div className="col-sm-9 col-xs-12 border-left mb-50">
                        <div className="col-sm-12 visible-xs mb-30" style={{"borderBottom": "2px solid #eee"}}>
                            <h4> <b>{t('Transaction as Host')}</b></h4>
                        </div>
                        <div className="col-sm-3 col-xs-6 nopadding-l">
                            <label>From:</label>
                            <Select placeholder={t("Select")} options={monthOptions} simpleValue clearable={this.state.clearable} name="from-date"  value={this.state.fromDate} onChange={this.switchFromDate.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="col-sm-3 col-xs-6 nopadding-l">
                            <label>To:</label>
                            <Select placeholder={t("Select")} options={monthOptions} simpleValue clearable={this.state.clearable} name="to-date"  value={this.state.toDate} onChange={this.switchToDate.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="col-sm-3 col-xs-12 nopadding-l">
                            <label>{t("Status")}</label>
                            <select className="form-control" onChange={this.switchSortBy.bind(this)} id="acco-list-sort-by">
                                <option value="">{t("All")}</option>
                                <option value="SCHEDULED">{t("Scheduled")}</option>
                                <option value="PAID">{t("Paid")}</option>
                            </select>
                        </div>
                        <div className="col-sm-3 col-xs-12 nopadding-l">
                            <label></label>
                            <button onClick={this.handleSearch.bind(this)} type="button" className="btn button-medium pull-right button-inline-search">{t("Search")}</button>
                        </div>
                        <br />
                        <br />
                        <div className="col-xs-12 nopadding-l">
		                        <table className="col-xs-12 table table-striped host-transaction mt-30" style={{"backgroundColor": "white"}}>
		                            <thead>
		                                <tr>
		                                    <th>{t("Id")}</th>
		                                    <th>{t("Date")}</th>
		                                    <th>{t("Status")}</th>
		                                    <th>{t("Amount")}</th>
		                                    <th>{t("Details")}</th>
		                                </tr>
		                            </thead>
		                            <tbody >
		                                {balance.map((item, idx) => {
		                                    return(
		                                         <tr key={idx}>
		                                             <td>{idx + 1}</td>
		                                             <td>{item.scheduledPayment}</td>
		                                             <td>{t(self.getStatus(item.status))}</td>
		                                             <td>{item.amount}円</td>
		                                             <td><a data-toggle="modal" data-target="#myModal" onClick={this.handleBalanceDetail.bind(this, item.details)}><i className="fa fa-external-link" aria-hidden="true"></i></a></td>
		                                         </tr>
		                                     )
		                                })}
		                            </tbody>
		                        </table>
		                    </div>
                    </div>
                </div>
                <BankBalanceDetail detailData={this.state.detailData} {...this.props}/>
            </div>
        );

    }
}

export default TranslationWrapper(translate("BankTransaction")(BankTransactionHost));
