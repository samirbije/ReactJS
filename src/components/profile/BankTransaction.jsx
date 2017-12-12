//external
import React, { Component } from "react"
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";
import Select from 'react-select';

//internal
import Message from "../common/Message";
import TextFieldGroup from '../common/TextFieldGroup';
import BankTransactionHost from "./BankTransactionHost";
import BankTransactionGuest from "./BankTransactionGuest";

class BankTransaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clearable: false,
            ajaxLoading: true,
            balanceList: [],
            fromDate: "",
            toDate: ""
        }
    }

    componentDidMount() {
        this.getBankBalance();
    }

    getBankBalance(){
        var self = this;

        let url = baseMVacationApiUrl + "/user/0/balance";

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

    render() {
        //console.log(this.state.bankAccount);
        const {t} = this.props;

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

        let balance = this.state.balanceList;

        return (
            <div className="tab-content container">
                <div className="hidden-xs mb-50 space-50"></div>
                <div className="row mb-100">
                <BankTransactionGuest {...this.props} />
                <BankTransactionHost {...this.props} />
                </div>
            </div>

        );

    }
}

export default TranslationWrapper(translate("BankTransaction")(BankTransaction));
