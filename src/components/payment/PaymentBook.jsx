//external
import React, { Component } from 'react';
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";

// internal
import Message from '../common/Message';
import TextFieldGroup from '../common/TextFieldGroup';
import MessageModal from '../common/MessageModal';
import CreditCardForm from './CreditCardForm';
import AddCreditCard from './AddCreditCard';
import SubmitButton from "../common/SubmitButton";

class PaymentBook  extends Component {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} child app class
         */
        this.state = {
            accommodationInfo: {
                "owner":{
                    "email":null,
                    "firstName":null,
                    "lastName":null,
                    "profile":{
                        "phoneNumber":null
                    }
                },
                "name": null,
                "address": {
                    "state": null,
                    "city": null
                },
                "capacity":-1,
                "rule":{
                    "checkInTime":null,
                    "checkOutTime":null,
                    "isSmokingAllowed":false,
                    "isPetsAllowed":false,
                    "isInfantsAllowed":false,
                    "text":""
                },
                featuredPicture:{
                    "id":0
                },
                "status":''
            },
            roomPrice:{
                "total": null,
                "stay": null,
                "cleaningFee": null,
                "totalDays":null
            },
            guest:-1,
            children: 0,
            startDate:null,
            endDate:null,
            display:false,
            type:false,
            msg:[],
            year:0,
            month:0,
            name:"",
            creditCard:"",
            securityCode:"",
            cards: [],
            cardId : 0,
            successId: 0,
            ajaxLoading: false,
            cancellationPolicy: null,
            cancellationPolicyNotice: []
        }
    }

    componentDidMount() {
        if(userLoggedIn){
            this.getAccommodationInfo();
            this.bookDetails();
            this.getUserCards();
        }
    }

    /**
     *
     * @returns {number}
     */
    urlState(){
        let currentLocation = window.location.href;
        let lastPart = currentLocation.substr(currentLocation.lastIndexOf('/') + 1);
        let urlState = false;

        if(lastPart.includes("payment") && lastPart.includes("accommodation_id") && lastPart.includes("code")){
            urlState = true;
        }
        return urlState;
    }

    /**
     * id from URL params
     *
     */
    getQueryParams() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");

        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }

    /**
     * create json for edit json
     *
     */
    getAccommodationInfo(){

						var id = this.getQueryParams().accommodation_id;

            const self = this;

            let url = baseMVacationApiUrl + '/accomodation/' + id;

            let onSuccessMethod = (data) => {
                let policyId = (data.cancellationPolicy) ? data.cancellationPolicy.id : null;

                if(policyId) {
                    self.getCancellationPolicy(policyId)
                    };

                self.setState({
                    accommodationInfo: data,
                    ajaxLoading: false
                })
            }

            let onFailMethod = (err) => {
                console.log(err.responseText);
            }

            ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);

    }
    /**
     *
     */
    bookDetails(){

        var decoded = base64.decode(this.getQueryParams().code);

        try {
            const self = this;

            let url = baseMVacationApiUrl + '/accomodation/' + this.getQueryParams().accommodation_id + '/price?startDate=' + JSON.parse(decoded).startDate + '&endDate=' + JSON.parse(decoded).endDate;

            let onSuccessMethod = (data) => {
                self.setState({
                    roomPrice: data,
                    startDate:JSON.parse(decoded).startDate,
                    endDate:JSON.parse(decoded).endDate,
                    guest:JSON.parse(decoded).numberOfGuest,
                    children:JSON.parse(decoded).numberOfChild
                });
                self.setState({
                    type:false,
                    msg:''
                    });
            }

            let onFailMethod = (err) => {
                var errArr = [];

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
                // self.setState({msg:error.response.data});
            }
            ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
        }
        catch(x) {
            var errArr = [];
            errArr.push("Decoding Json worng");
            this.setState({msg: errArr});
            this.setState({type: true});
        }
    }

    getUserCards(){
        let userId = 0;
        let url = baseMVacationApiUrl + '/user/' + userId + '/card';
        let self = this;

        let onSuccessMethod = (data) => {
            let cards = data;
            let cardId;
            for(var i=0; i<cards.length; i++){
                if (cards[i].defaultCard == true) cardId = cards[i].cardId;
            }
            self.setState({
                cards: cards,
                cardId: cardId
            })
        }

        let onFailMethod = (err) => {
            console.log("error in getting cards");
            console.log(err);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     * @param newValue
     */
    switchCard(newValue) {
        this.setState({
            cardId: newValue
        });
    }


    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    clickNext(){
        this.setState({
            display: true
        });
    }

    onReservationSuccess(){
        var self = this;
        window.location.assign(baseCmsUrl + '/reservation-details/' + self.state.successId);
    }

    handleFieldChange(fieldId, value) {
        var newState = {};
        newState[fieldId] = value;

        this.setState(newState);
    }

    handleSubmit(){
        //console.log("year :", this.state.year);
        //console.log("month :", this.state.month);
        this.setState({ajaxLoading: true});
        var cardInfo = {};

        if (this.state.cards.length) {
            cardInfo = {
                "cardId": this.state.cardId,
                "securityCode": this.state.securityCode
            }
        } else {
            cardInfo = {
                "cardNo":this.state.creditCard,
                "defaultCard":true,
                "expireDate":this.state.year.toString() + this.state.month.toString(),
                "holderName":this.state.name,
                "securityCode":this.state.securityCode
            }
        }
         var data = {
             "startDate": this.state.startDate,
             "endDate": this.state.endDate,
             "numberOfGuest": this.state.guest,
             "numberOfChild": this.state.children,
             "accomodation": {"id":this.getQueryParams().accommodation_id},
             "cardInfo": cardInfo,
         };

         this.setState({
            type:false,
            msg:[]
         });
         const self = this;

        let url = baseMVacationApiUrl + '/reservation';

        let onSuccessMethod = (data) => {
            self.setState({ajaxLoading: false});
            self.state.successId = data.id;
            $("#reservationSuccess").modal("show");
        }

        let onFailMethod = (err) => {
            window.scrollTo(0, 0);
            var errArr = [];
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
                ajaxLoading: false,
                type:true,
                msg:errArr
            })
        }

        ajaxCall(url, "POST", data, onSuccessMethod, onFailMethod);
    }

    /**
     *
     */
    getCancellationPolicy(id){
        const self = this;
        let url = baseMVacationApiUrl + '/cancellation-policy/' +id;
        let onSuccessMethod = (data) => {
            self.setState({
                cancellationPolicy: data,
                cancellationPolicyNotice:data.notice
            })
        }
        let onFailMethod = (err) => {
            console.log(err.responseText);
        }
        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
     }

    render() {
        const { t } = this.props;

        var cards = this.state.cards;
        var cardList = [];
        var cardLength = cards.length;
        if (cardLength){
            for (var i = 0; i < cardLength; i++){
                cardList.push({value: cards[i].cardId, label: cards[i].cardNo});
            }
        }

        if(userLoggedIn && this.urlState()){
            const userProfilePage ='';
            return (
                <div className="container">
                    <div className="center page-section-title">{t("Payment Page")}　</div>
                    <div className="row">
														<Message errors={this.state.msg} type={this.state.type}></Message>
						                <div className="section-1 col-md-12">
                                <h4>{t("Reservation Confirmation")} </h4>
                                <h4><small> {this.state.accommodationInfo.name}</small></h4>
                                <legend></legend>
						                    <div className="msg-line clearfix ">
						                        <div className="itinerary-details-guest-content">
						                            <div className="Itinerary-date">
						                                <div className="col-xs-12 col-md-4 col-lg-4 mb-10">
						                                    <div className="start-date">
						                                        <span className="line">{t("Check In")}</span>
						                                        <div className="list-unstyled" >
						                                            <span className="line-2 list-unstyled">{moment(this.state.startDate).format('YYYY')}</span>
						                                            <span className="monthly">{moment(this.state.startDate).format('MMM')}</span>
						                                            <span className="day">{moment(this.state.startDate).format('DD')}</span>&nbsp;
						                                            <span className="week">{moment(this.state.startDate).format('ddd')}</span>
						                                        </div>
						                                    </div>
						                                </div>
						                                <div className="col-xs-12 col-md-4 col-lg-4 mb-10">
						                                    <div className="end-date">
						                                        <span className="line">{t("Check Out")}</span>
						                                        <div className="list-unstyled">
						                                            <span className="line-2 list-unstyled">{moment(this.state.endDate).format('YYYY')}</span>
						                                            <span className="monthly">{moment(this.state.endDate).format('MMM')}</span>
						                                            <span className="day">{moment(this.state.endDate).format('DD')}</span>&nbsp;
						                                            <span className="week">{moment(this.state.endDate).format('ddd')}</span>
						                                        </div>
						                                    </div>
						                                </div>
						                            </div>
						                        </div>
						                    </div>
			                          <div className="space-30"></div>
			                          <legend></legend>
						                </div>
						                <div className="section-2 col-md-6 col-xs-12">
						                       <h4>{t("Total Cost")}</h4>
						                    <table className="detail-cost">
						                         <tr className="color-list">
						                            <td className="text-left">{t("Price per night")}</td>
						                            <td className="text-right">
																						{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.stay)}
						                            </td>
						                        </tr>
						                        <tr>
						                            <td className="text-left">{t("Number of adult")}</td>
						                            <td className="text-right">
																						{this.state.guest }{(locale=="jp") ? "名" :""}
						                            </td>
						                        </tr>
						                        <tr className="color-list">
						                            <td className="text-left">{t("Number of child")}</td>
						                            <td className="text-right">
																						{this.state.children }{(locale=="jp") ? "名" :""}
						                            </td>
						                        </tr>
						                         <tr>
						                            <td className="text-left">{t("Service Fee")}</td>
						                            <td className="text-right">
																						{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.serviceFee)}
						                            </td>
						                        </tr>
						                         <tr className="color-list">
						                            <td className="text-left">{t("Cleaning Fee")}</td>
						                            <td className="text-right">
																						{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.cleaningFee)}
						                            </td>
						                        </tr>
						                         <tr>
						                            <td className="text-left">
						                                <label>{t("Total")}</label>
						                            </td>
						                            <td className="text-right">
																						{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.total)}
						                            </td>
						                        </tr>
						                    </table>
								                <div className="space-30"></div>
		                            <legend></legend>
						                </div>
		                        {(this.state.cancellationPolicy) ?
		                            <div className=" section-3 col-md-12">
				                        <h4>{t("Cancellation Policy")} </h4>
                                    <h5>{ this.state.cancellationPolicy.name }</h5> <h5>({this.state.cancellationPolicy.description})</h5>
                                    <ul>
                                        {
                                            this.state.cancellationPolicyNotice.map((text, j) => {
                                                return (
                                                    <li style={{display: "block"}}> {text.days} {text.days > 1 ? t("Days ago") : t("Day ago")} : {t("Total accommodation fee")} {text.refund} %</li>
                                                )
                                            })
                                        }
                                    </ul>
                                <div className="space-30"></div>
                                <legend></legend>
                                </div>
		                        :null}
                            <div className="section-4 col-md-12">
                                <h4>{t("House Rules")}</h4>
                                <div>
                                    <ul>
                                        <li style={{display: "block"}}>{t("Pets")} : {this.state.accommodationInfo.rule.isPetsAllowed ? 'OK' :'NG'}</li>
                                        <li style={{display: "block"}}>{t("Smoking")} : {this.state.accommodationInfo.rule.isSmokingAllowed ? 'OK' :'NG'}</li>
                                        <li style={{display: "block"}}>{t("Infants")} : {this.state.accommodationInfo.rule.isInfantsAllowed ? 'OK' :'NG'}</li>
                                        <li style={{display: "block"}}>※{t("Check in time")} : {this.state.accommodationInfo.rule.checkInTime} </li>
                                        <li style={{display: "block"}}>※{t("Check out time")} : {this.state.accommodationInfo.rule.checkOutTime} </li>
                                        {(this.state.accommodationInfo.rule.text) ?
                                        <li style={{display: "block"}}>{t("Others")} : {this.state.accommodationInfo.rule.text} </li>
                                        :null
                                        }
                                        <li style={{display: "block"}}>{t("Please do not leave any belongings, we will not keep forgotten items once you leave the house.")}</li>
                                    </ul>
                                </div>
                                <div className="space-30"></div>
                                <legend></legend>
                            </div>

                            <div className="section-5 col-md-12">
                                <h4>{t("Host Details")}</h4>
                                <div>
                                    <ul>
                                        <li style={{display: "block"}}>{t("Name")} : {this.state.accommodationInfo.owner.firstName} {this.state.accommodationInfo.owner.lastName}</li>
                                        <li style={{display: "block"}}>{t("Email")} : {this.state.accommodationInfo.owner.email}</li>
                                        {(this.state.accommodationInfo.owner.profile && this.state.accommodationInfo.owner.phoneNumber) ?
                                        <li style={{display: "block"}}>{t("Phone Number")} : {this.state.accommodationInfo.owner.profile ? this.state.accommodationInfo.owner.phoneNumber:''}</li>
		                                    :null
		                                    }
                                    </ul>
                                </div>
                                <div className="space-30"></div>
                                <legend></legend>
                            </div>

                            <div className="section-6 mt-50 col-md-12">
                                <div className="panel-group">
                                    <div className="panel">
                                        <div className="panel-heading">
                                            <h4 className="panel-title">
                                                           <a data-toggle="collapse" href="#collapse1">{t("Next")}</a>
                                                       </h4>
                                        </div>
                                        <div id="collapse1" className="panel-collapse collapse no-border">
                                            <div className="no-border">
                                                <div className="msg-line clearfix">
						                                        <div className="col-md-3">
						                                            <h4>{t("Credit Card Information")}</h4>
						                                        </div>
						                                        <div className="col-md-9">
		                                                    {(cardLength) ?
		                                                        <div>

		                                                            <label>{t("Credit Card")}</label>
		                                                            <Select autofocus options={cardList} placeholder={"Select"}  simpleValue clearable={this.state.clearable} name="month"  value={this.state.cardId} onChange={this.switchCard.bind(this)} searchable={this.state.searchable} />
		                                                            <TextFieldGroup
		                                                                label={t("Security Card")}
		                                                                onChange={this.handleChange.bind(this)}
		                                                                value={this.state.securityCode}
		                                                                field="securityCode"
		                                                                placeholder={"XXX or XXXX"}
		                                                                className="form-control"
		                                                            />
		                                                        </div>
		                                                        :
		                                                        <CreditCardForm onChange={this.handleFieldChange.bind(this)} {...this.props}/>
		                                                    }
		                                                    <AddCreditCard onStateChange={this.handleFieldChange.bind(this)} cards={cards} {...this.props}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="msg-line no-border clearfix mt-50">
                                                <div className="col-md-3">
                                                    <h4>{t("Service Policy")}</h4>
                                                </div>
                                                <div className="col-md-9 agreement mb-30">
                                                    <ul>
                                                        <li><a href="#">{t("Service Agreement")}</a></li>
                                                        <li>
                                                            ※{t("Please confirm the above conditions and confirm the reservation.")} <br />
                                                            {t("Confirming to agree the terms will be considered as agreeing to the above written document.")}
                                                        </li>
                                                        <li>

                                                        <SubmitButton buttonClass="cta-button" ajaxLoading={this.state.ajaxLoading} buttonText="Make Reservation" onClick={this.handleSubmit.bind(this)} {...this.props} />
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    </div>
                    <MessageModal msg={t("Reservation has been successfully created")} onClick={this.onReservationSuccess.bind(this)} id="reservationSuccess" {...this.props} />
                </div>

            )
        } else {
            return (
                <div className="container" style={{marginTop: "6em"}}>
                    <div className="alert alert-danger alert-dismissable">
                        <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}} className="glyphicon glyphicon-remove-circle"></span>
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>{t("info")}!</strong>
                        {(userLoggedIn) ?
                        t("Wrong Url")
                        :
                        t("Please login to the system")
                        }
                    </div>
                </div>
            )
        }
    }
}
export default TranslationWrapper(translate("PaymentBook")(PaymentBook))
//export default ReservationDetails;