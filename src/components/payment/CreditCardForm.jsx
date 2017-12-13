//external
import React, { Component } from 'react';
import Select from 'react-select';
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"

// internal
import Message from '../common/Message';
import TextFieldGroup from '../common/TextFieldGroup';

class CreditCardForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg:[],
            year:0,
            month:0,
            name:"",
            creditCard:"",
            securityCode:""
        };
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        //console.log("nextProps ", nextProps.init);
        if(nextProps.init == true){
            this.setState({
                msg:[],
                year:0,
                month:0,
                name:"",
                creditCard:"",
                securityCode:""
            });
            this.handleStateChange("init", false);
        }
    }

    handleStateChange(fieldId, value) {
        this.props.onChange(fieldId, value);
    }

    /**
     *
     * @param newValue
     */
    switchYear(newValue) {
        this.setState({
            year: newValue
        });
    this.handleStateChange("year", newValue);
    }

    /**
     *
     * @param newValue
     */
    switchMonth(newValue) {
        this.setState({
            month: newValue
        });
    this.handleStateChange("month", newValue);
    }

    /**
     *
     * @param e
     */
    handleChange(e) {
        //window.testNash = e.target;
        this.setState({[e.target.name]: e.target.value});
        this.handleStateChange(e.target.name, e.target.value);
    }

    render() {
        const { t } = this.props;

        var months = [];
        for(var i =1; i<=12; i++){
            let ix = i.toString();
            if(ix.length<2) ix = "0" + ix;
            months.push({value: ix, label: ix});
        }

        var years = [];
        var d = new Date();
        var currYear = d.getFullYear().toString().substring(2);
        for(var i=1; i<=10; i++){
            years.push({value: currYear, label: currYear});
            currYear++;
        }

        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="form-group">
                            <div className="credit-form  col-sm-8">
                                <TextFieldGroup
                                    label={t("Credit Card Number")}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.creditCard}
                                    field="creditCard"
                                    placeholder={"XXXX XXXX XXXX"}
                                    className="form-control"
                                />
                            </div>
                            <div className="credit-form  col-sm-4">
                                <TextFieldGroup
                                    label={t("Security Code")}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.securityCode}
                                    field="securityCode"
                                    placeholder={"XXX or XXXX"}
                                    className="form-control"
                                />
                            </div>
                            <div className="credit-form  col-xs-12">
                                <div className="card-items">
                                    <img src={baseCmsUrl + "/storage/app/media/default-images/Visa-icon.png" } width="70" height="70" />
                                    <img src={baseCmsUrl + "/storage/app/media/default-images/Master-Card-icon.png" } width="70" height="70" />
                                </div>
                            </div>
                            <div className="credit-form  col-xs-12">
                                <label>{t("Expiry Date")}</label>
                            </div>
                            <div className="credit-form col-xs-6">
                                <Select autofocus options={years} placeholder={"YY"} simpleValue clearable={this.state.clearable} name="year" value={this.state.year} onChange={this.switchYear.bind(this)} searchable={this.state.searchable} />
                            </div>
                            <div className="credit-form col-xs-6">
                                <Select autofocus options={months} placeholder={"MM"}  simpleValue clearable={this.state.clearable} name="month"  value={this.state.month} onChange={this.switchMonth.bind(this)} searchable={this.state.searchable} />
                            </div>
                            <div className="credit-form col-xs-12">
                                <TextFieldGroup
                                    label={t("Cardholder Name")}
                                    onChange={this.handleChange.bind(this)}
                                    value={this.state.name}
                                    field="name"
                                    placeholder={t("Cardholder Name")}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TranslationWrapper(translate("PaymentForm")(CreditCardForm));
