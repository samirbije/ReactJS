//external
import React, { Component } from "react"
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate";
import Select from 'react-select';

//internal
import TranslationWrapper from "../i18n/TranslationWrapper";
import BankAccountFormModal from "./BankAccountFormModal";
import Message from "../common/Message";
import TextFieldGroup from '../common/TextFieldGroup';


class BankTransactionGuest extends Component {

    constructor(props) {
        super(props);
        let date = new Date();
        let fromDate = moment(date).format("YYYY-MM");
        let toDate = moment(date).format("YYYY-MM");
        this.state = {
            clearable: false,
            ajaxLoading: true,
            transactionList: [],
            fromDate: fromDate,
            toDate: toDate,
            longFromDate: "",
            longToDate: ""
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

        this.setDates();

        var text = {
            "userId" : 0,
            "startDate": this.state.longFromDate,
            "endDate": this.state.longToDate
        };

        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/reservation?orderBy=id&offset=0&size=-1&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                transactionList: data.items,
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
            sortBy: e.target.value
        });
        this.getBankBalance();
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

    handleSearch(){
        this.getBankBalance();
    }

    getType(value) {
        //console.log("getType :", value);
        if (value == "RESERVATION_PAYMENT") {
            return "Reservation"
        } else if (value == "RESERVATION_REFUND") {
            return "Cancel Charge"
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
        //monthList = moment.months();
        for(var x=2; x>=1; x--){
            for(var i=12; i>=1; i--){
                let mon = i.toString();
                (mon.length == 1) ? mon = "0" + mon : null;
                monthOptions.push({value: year + "-" + mon  ,label: year + "-" + mon});
            }
            year--;
        }

        let balance = this.state.transactionList;
        return (
            <div className="row mb-100">
                <div className="col-xs-12">
                    <div className="col-sm-3 hidden-xs center">{t('Transaction as Guest')}</div>
                    <div className="col-sm-9 col-xs-12 border-left mb-50">
                        <div className="col-sm-12 visible-xs mb-30" style={{"borderBottom": "2px solid #eee"}}>
                            <h4> <b>{t('Transaction as Guest')} </b></h4>
                        </div>
                        <div className="col-sm-4 col-xs-6 nopadding-l">
                            <label>From:</label>
                            <Select placeholder={t("Select")} options={monthOptions} simpleValue clearable={this.state.clearable} name="from-date"  value={this.state.fromDate} onChange={this.switchFromDate.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="col-sm-4 col-xs-6 nopadding-l">
                            <label>To:</label>
                            <Select placeholder={t("Select")} options={monthOptions} simpleValue clearable={this.state.clearable} name="to-date"  value={this.state.toDate} onChange={this.switchToDate.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="col-sm-4 col-xs-12 nopadding-l">
                            <label></label>
                            <button onClick={this.handleSearch.bind(this)} type="button" className="btn button-medium pull-right button-inline-search">{t("Search")}</button>
                        </div>
                        <br />
                        <br />
                        <div className="col-xs-12 nopadding-l">
		                        <table className="table table-striped guest-transaction mt-30" style={{"backgroundColor":"white"}}>
		                            <thead>
		                                <tr>
		                                    <th>{t("Id")}</th>
		                                    <th>{t("Date")}</th>
		                                    <th>{t("Type")}</th>
		                                    <th>{t("Amount")}</th>
		                                    <th>{t("Details")}</th>
		                                </tr>
		                            </thead>
		                            <tbody>
		                            {balance.map((item, idx) => {
		                                let tranTypeIndex = item.paymentList.length -1;
		                                let tranType = (item.paymentList.length) ? item.paymentList[tranTypeIndex]["transactionType"] :"";
		                                let amount = (item.paymentList.length) ? item.paymentList[tranTypeIndex]["amount"] :"";
		                                return(
		                                    <tr>
		                                        <td>{idx + 1}</td>
		                                        <td>{item.startDate}</td>
		                                        <td>{t(self.getType(tranType))}</td>
		                                        <td>{amount}円</td>
		                                        <td><a href={baseCmsUrl + "/reservation-details/" + item.id}><i className="fa fa-external-link" aria-hidden="true"></i></a></td>
		                                    </tr>
		                                    )
		                            })}
		                            </tbody>
		                        </table>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default TranslationWrapper(translate("BankTransaction")(BankTransactionGuest));
