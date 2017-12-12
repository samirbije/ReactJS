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

class BankBalanceDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clearable: false,
            ajaxLoading: true,
            dataList: this.props.detailData,
            fromDate: "",
            toDate: "",
            detailDate: this.props.detailDate
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        this.state.dataList = nextProps.detailData;
    }

    getType(value){
        if (value == "STAY") {
            return "Reservation"
        } else if (value == "REFUND") {
            return "Cancel Charge"
        } else {
            return ""
        }
    }

    render() {
        //console.log(this.state.bankAccount);
        const {t} = this.props;
        let self = this;
        let data = this.state.dataList;
        return (
            <div id="myModal" className="modal fade" role="dialog">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-striped">
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
                                    {data.map((item, idx) => {
                                        return(
                                             <tr key={idx}>
                                                 <td>{idx + 1}</td>
                                                 <td>{item.reservationDate}</td>
                                                 <td>{t(self.getType(item.type))}</td>
                                                 <td>{item.amount}円</td>
                                                 <td><a href={baseCmsUrl + "/reservation-details/" + item.reservationId}><i className="fa fa-external-link" aria-hidden="true"></i></a></td>
                                             </tr>
                                         )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default TranslationWrapper(translate("BankBalanceDetail")(BankBalanceDetail));
