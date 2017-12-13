//external
import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";

// internal
import Message from '../common/Message';
import TextFieldGroup from '../common/TextFieldGroup';
import CreditCardForm from './CreditCardForm';
import SubmitButton from "../common/SubmitButton";

class AddCreditCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            year:0,
            month:0,
            name:"",
            creditCard:"",
            securityCode:"",
            cards: this.props.cards,
            msg: [],
            //alertMsg: "",
            alertType: false,
            alertStyle: "none",
            init: false,
            ajaxLoading: false
        };
        //this.saveCard = this.saveCard.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.cards !== this.props.cards){
            this.setState({
                cards: nextProps.cards
            });
        }
    }

    handleFieldChange(fieldId, value) {
        var newState = {};
        newState[fieldId] = value;
        this.setState(newState);
    }

    removeItem(items, key, value){
        var removeIndex = items.map(function(item) { return item[key]; }).indexOf(value);
        ~removeIndex && items.splice(removeIndex, 1);
        return items;
    }

    saveCard() {
        //console.log("Accessed save card");
        const { t } = this.props;
        this.setState({ajaxLoading: true});

        let self = this;
        let cardInfo = {};
        let defaultCard = true;
        cardInfo = {
            "cardNo":this.state.creditCard,
            "defaultCard":defaultCard,
            "expireDate":this.state.year.toString() + this.state.month.toString(),
            "holderName":this.state.name,
            "securityCode":this.state.securityCode
        }
        let user = 0;
        let url = baseMVacationApiUrl + '/user/' + user + '/card';

        let onSuccessMethod = (data) => {
            //console.log("res1 :", data);
            let alertMsg = t("Operation Success");
            let cards = self.state.cards;
            cards.push(data);
            self.setState({
                ajaxLoading: false,
                cards:cards,
                init: true,
                alertStyle: "block",
                alertType: false,
                msg:[alertMsg]
            })
            self.props.onStateChange("cards", cards);
        }

        let onFailMethod = (err) => {
            //console.log("res2", errorThrown);
            let alertMsg = t("Operation Failed");
            self.setState({
                ajaxLoading: false,
                alertStyle: "block",
                alertType: true,
                msg:[alertMsg]
            })
        }

        ajaxCall(url, "POST", cardInfo, onSuccessMethod, onFailMethod);
    }

    handleDelete(cardId) {
        //console.log("Accessed handle delete");
        const { t } = this.props;
        let self = this;
        let user = 0;
        let url = baseMVacationApiUrl + '/user/' + user + '/card/'+cardId;

        let onSuccessMethod = (data) => {
            //console.log("res1 :", data);
            let alertMsg = t("Operation Success");
            let cards = self.state.cards;
            cards = self.removeItem(cards, "cardId", cardId);
            self.setState({
                cards: cards,
                alertStyle: "block",
                alertType: false,
                msg:[alertMsg]
            })
            self.props.onStateChange("cards", cards);
        }

        let onFailMethod = (err) => {
            let alertMsg = t("Operation Failed");
            self.setState({
                alertStyle: "block",
                alertType: true,
                msg:[alertMsg]
            })
        }

        ajaxCall(url, "DELETE", null, onSuccessMethod, onFailMethod);
    }

    onStart() {
        this.setState({
            alertStyle: "none",
            init: true
        })
    }

    render() {
        const { t } = this.props;
        let cards = this.state.cards;
        return (
            <div>
            <div className="square-button btn btn-default mt-30" data-toggle="modal" data-target="#addCard" onClick={this.onStart.bind(this)}>
                <h6>{t("Add New Card")}<span> <strong>+</strong></span></h6>
            </div>
            <div className="modal fade" id="addCard" role="dialog">
                <div className="modal-dialog" style={{ "maxWidth": "500px"}}>
                    <div className="modal-content">
                        <div className="modal-header" style={{"paddingBottom":"0px"}}>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body" style={{"paddingTop":"0px"}}>
                            <div style={{'display': this.state.alertStyle}}>
                                <Message errors={this.state.msg} type={this.state.alertType}></Message>
                            </div>
                            <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>{t("Credit Card")}</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards.map((card,idx) =>
                                    <tr id={idx}>
                                        <td>{card.cardNo}</td>
                                        <td>
                                            <button type="button" className="square-button btn btn-danger pull-right" style={{"width":"80%"}} onClick={() => this.handleDelete(card.cardId)}> <h6>{t("Delete")}</h6> </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            </table>
                            <div className="divider"/>
                            <label><h4><b>{t("Add Card")}</b></h4></label>
                            <CreditCardForm onChange={this.handleFieldChange} init={this.state.init} {...this.props}/>

                        </div>
                        <div className="modal-footer">
                            <div type="button" className="square-button btn btn-default" data-dismiss="modal"><h6>{t("Close")}</h6></div>
														<div style={{"float" : "left"}}>
																<SubmitButton buttonClass="square-button btn btn-default" ajaxLoading={this.state.ajaxLoading} buttonText="Save Card" onClick={this.saveCard.bind(this)} {...this.props} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default TranslationWrapper(translate("PaymentForm")(AddCreditCard));