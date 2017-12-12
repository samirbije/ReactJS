//external
import React, { Component } from 'react'
import MapApp from './MapApp';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";

// internal
import MessageAccommodation from "./common/MessageAccommodation";

class ReservationDetails  extends Component {
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
            style:"none",
            flashMsg : null,
            cancellationPolicy:null,
            cancellationPolicyNotice:[],
            latitude:null,
            longitude:null,
            currentLoggedUserId: "",
            reservationDetails: {
                "user": {
                    "id":"",
                    "email": "",
                    "firstName": "",
                    "lastName": "",
                    "profile": {
                        "gender": "",
                        "phoneNumber": "",
                        "picture": {
                            "id": "",
                            "url": ""
                        },
                        "selfIntroduction": ""
                    },
                },
                "accomodation": {
                    "name": "",
                    "address": {
                        "state": "",
                        "city": "",
                    },
                    "cleaningFee":null,
                    "displayPrice":null,
                    "rule": {
                        "checkInTime": null,
                        "checkOutTime": null,
                    },
                    "mediaList": [
                        {
                            "id": "",
                            "url": ""
                        }
                    ],
                    "owner":{
                        "id":'',
                        "firstName":"",
                        "lastName":"",
                    },
                    "cancellationPolicy":{
                        "id":""
                    }
                },
                "startDate": '',
                "endDate": '',
                "numberOfGuest": '',
                "status":'',
                "price":{
                    "total":0.0,
                    "stay":0.0,
                    "cleaningFee":0.0,
                    "serviceFee":0.0
                },
            }
        }
    }

    /**
     *
     * @returns {number}
     */
    getAccommodationId(){
        let currentLocation = window.location.href;
        let lastPart = currentLocation.substr(currentLocation.lastIndexOf('/') + 1);
        var accommodationId = 0;
        var regex=/^[0-9]+$/;
        if (lastPart == "accommodation"){
            accommodationId = 0;
        } else if(!lastPart.match(regex)) {
            accommodationId = 999999999;
        } else {
            accommodationId = lastPart;
        }

        return accommodationId;
    }

    getLatitudeLongitude(state,city,country){
        if(city && state && country) {
            var address = city.replace(/ |,/g, '-') + "+" + state.replace(/ |,/g, '-') + "+" + country.replace(/ |,/g, '-');
        }
        let param = 'sensor=false&address=' + address;
        const self = this;

        let url = 'https://maps.googleapis.com/maps/api/geocode/json?' + param
        let ctype = "google-api";
        let onSuccessMethod = (data) => {
            self.setState({
                longitude: Number(data.results[0].geometry.location.lng)
            });
            self.setState({
                latitude: Number(data.results[0].geometry.location.lat)
            });
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod, ctype);
    }
    /**
     *
     */
    reservationDetails(){
        const self = this;

        let url = baseMVacationApiUrl + '/reservation/' + this.getAccommodationId();

        let onSuccessMethod = (data) => {
            self.getLatitudeLongitude(data.accomodation.address.state,data.accomodation.address.city,data.accomodation.address.country.name);
            self.setState({
                reservationDetails: data,
                //cancellationPolicyNotice:data.notice
            })
            self.getCancellationPolicy(data.accomodation.cancellationPolicy.id);
        }
        let onFailMethod = (err) => {
            console.log(err.responseText);
        }
        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     */
    getCancellationPolicy(id){

        var arr1 ={};
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

    getStatus(status){
        const {t} = this.props;
        let tStatus = '';
        switch(status) {
            case "CREATED":
                tStatus = t("Pending");
                break;
            case "APPROVED":
                tStatus = t("Approved");
                break;
            case "CANCEL_BY_GUEST":
                tStatus = t("Cancel by guest");
                break;
            case "CANCEL_BY_HOST":
                tStatus = t("Cancel by host");
                break;
            case "REJECTED":
                tStatus = t("Rejected");
                break;
            case "CREATED":
                tStatus = t("Pending");
                break;
            default:

        }
        return tStatus;
    }

    componentDidMount() {
        this.reservationDetails();
        this.getCurrentLoggedInUserId();
    }

    getCurrentLoggedInUserId(){
        var url = baseMVacationApiUrl + "/user/0";
        let self = this;

        let onSuccessMethod = (data) => {
            self.setState({
                currentLoggedUserId: data.id
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }
    acceptReservation(){
        const { t } = this.props;
        window.scrollTo(0, 0);
        const self = this;

        let url = baseMVacationApiUrl + '/reservation/'+ this.getAccommodationId() +'/status?status=APPROVED';
        let ctype = "x-www-form";
        let onSuccessMethod = (data) => {
            self.setState({
                reservationDetails: data,
                flashMsg:t("Successfully approved")
            });
            $("#flash").slideDown(500, function(){
                setTimeout(function(){
                    $("#flash").slideUp(500);
                },3000);
            });

        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "POST", "", onSuccessMethod, onFailMethod, ctype);
    }

    cancelReservation(){
        const { t } = this.props;
        window.scrollTo(0, 0);
        var status = 'CANCEL_BY_GUEST';
        if(this.state.reservationDetails.user.id==this.state.reservationDetails.accomodation.owner.id){
            status ='CANCEL_BY_HOST';
        }
        const self = this;

        let url = baseMVacationApiUrl + '/reservation/'+ this.getAccommodationId() +'/status?status='+ status;
        let ctype = "x-www-form";
        let onSuccessMethod = (data) => {
            self.setState({
                reservationDetails: data,
            })
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
                msg: errArr,
                type: true,
                style: "block"
            })
        }

        ajaxCall(url, "POST", "", onSuccessMethod, onFailMethod, ctype);
    }

    rejectReservation(){
        const { t } = this.props;
        const self = this;

        let url = baseMVacationApiUrl + '/reservation/'+ this.getAccommodationId() +'/status?status=REJECTED';
        let ctype = "x-www-form";
        let onSuccessMethod = (data) => {
            self.setState({
                reservationDetails: data,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "POST", "", onSuccessMethod, onFailMethod, ctype);
    }


    render() {
        const { t } = this.props;
        let mode = '' ;
        let currentUser = this.state.currentLoggedUserId;
        let owner = this.state.reservationDetails.accomodation.owner;
        let reservationStatus = this.state.reservationDetails.status;
        //console.log(this.state.currentLoggedUserId);
        if(reservationStatus == 'CREATED' &&  currentUser == owner.id){
            mode = 'hostButton';
        }
        if((reservationStatus == 'CREATED' || reservationStatus =='APPROVED') && currentUser != owner.id){
            mode = 'guestButton';
        }

        if(userLoggedIn){
            const userProfilePage = <a href={baseCmsUrl+ "/user-profile/" +  this.state.reservationDetails.accomodation.owner.id }>
                { this.state.reservationDetails.accomodation.owner.firstName } { this.state.reservationDetails.accomodation.owner.lastName }
            </a>
            return (
                <div>
                    
                    <section className="itinerary-details-guest-responsive hidden-lg">
                        <div className="jumbotron" style={{marginButton:'0px'}}>
                            <center>
                                <img src={this.state.reservationDetails.accomodation.featuredPicture ? baseMVacationApiUrl + '/media/' + this.state.reservationDetails.accomodation.featuredPicture.id + '/data?size=900x900' : baseCmsUrl + "/storage/app/media/default-images/250x250.png" } className="img-responsive" />
                            </center>
                        </div>
                        <div className="col-sm-12" style={{"display": this.state.style}}>
                            <MessageAccommodation errors={this.state.msg} type={this.state.type} />
                        </div>
                        <div className="responsive-content">
                            <div>
                                <div className="sub-navigation col-xs-12 col-md-12 col-sm-12">
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li role="presentation"><a href="#main" aria-controls="main" role="tab" data-toggle="tab">{t("Travel Details")}</a></li>
                                        <li role="presentation"><a href="#price" aria-controls="price" role="tab" data-toggle="tab">{t("Price")}</a></li>
                                        <li role="presentation"><a href="#host" aria-controls="host" role="tab" data-toggle="tab">{t("Host details")}</a></li>
                                        <li role="presentation"><a href="#access" aria-controls="access" role="tab" data-toggle="tab">{t("Access")}</a></li>
                                    </ul>
                                </div>
                                <div className="tab-content col-xs-12 col-md-12 col-sm-12">
                                    <div role="tabpanel" className="tab-pane active" id="main">
                                        <div className="col-xs-12 col-md-12 itinerary-details-guest-content">
                                            <div className="col-xs-12 col-md-6 col-lg-4 ">
                                                <div className="start">
                                                    <span className="line">{t("Start Date")}</span>&nbsp;
                                                    <li className="list-unstyled">
                                                        <span className="line-2 list-unstyled">{moment(this.state.reservationDetails.startDate).isValid() ?  moment(this.state.reservationDetails.startDate).format('YYYY'):"" } </span>&nbsp;
                                                        <span className="monthly">{moment(this.state.reservationDetails.startDate).isValid() ?  moment(this.state.reservationDetails.startDate).format('MMM'):"" } </span>&nbsp;
                                                        <span className="day">{moment(this.state.reservationDetails.startDate).isValid()  ?  moment(this.state.reservationDetails.startDate).format('DD') :"" }</span>&nbsp;
                                                        <span className="week">{moment(this.state.reservationDetails.startDate).isValid() ? moment(this.state.reservationDetails.startDate).format('ddd'):"" }</span>
                                                    </li>
                                                </div>
                                            </div>
                                            <div className="col-xs-12 col-md-6 col-lg-4">
                                                <div className="end">
                                                    <span className="line">{t("End Date")}</span>&nbsp;
                                                    <li className="list-unstyled">
                                                        <span className="line-2 list-unstyled">{moment(this.state.reservationDetails.endDate).isValid() ? moment(this.state.reservationDetails.endDate).format('YYYY'):"" }</span>&nbsp;
                                                        <span className="monthly">{moment(this.state.reservationDetails.endDate).isValid() ?  moment(this.state.reservationDetails.endDate).format('MMM'):"" }</span>&nbsp;
                                                        <span className="day">{moment(this.state.reservationDetails.endDate).isValid() ?  moment(this.state.reservationDetails.endDate).format('DD') : "" }</span>&nbsp;
                                                        <span className="week">{moment(this.state.reservationDetails.endDate).isValid() ?  moment(this.state.reservationDetails.endDate).format('ddd'):"" }</span>
                                                    </li>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 col-xs-12 col-lg-8">
                                            <div className="col-md-12 col-xs-12">
                                                <div className="page header">
                                                    <h3 className="page-header">{t("Guest Info")}</h3>
                                                </div>
                                                <div className="col-md-4 col-xs-12">
                                                    <div className="img-responsive" data-slide-number="0">
                                                        <img src={this.state.reservationDetails.user.profile ? baseMVacationApiUrl + '/media/' + this.state.reservationDetails.user.profile.picture.id + '/data?size=225x225':baseCmsUrl + "/storage/app/media/default-images/218x218.png" } />
                                                    </div>
                                                </div>
                                                <div className="col-md-8 col-xs-12">
                                                    <ul className="detail">
                                                        <li>{this.state.reservationDetails.user.firstName } {this.state.reservationDetails.user.lastName }</li>
                                                        <br/>
                                                        <li>{this.state.reservationDetails.user.email }</li>
                                                        <br/>
                                                        <li>{this.state.reservationDetails.user.profile ? this.state.reservationDetails.user.profile.phoneNumber :'' }</li>
                                                        <br/>
                                                        <li>{this.state.reservationDetails.user.profile ? this.state.reservationDetails.user.profile.gender :''}</li>
                                                        <br/>
                                                        <br/>
                                                        <li> <pre className="testimonial-section message-content-box" style={{border: "none", background: "none", fontFamily: "inherit", paddingLeft: "0px", lineHeight: "inherit"}}>{this.state.reservationDetails.user.profile ? this.state.reservationDetails.user.profile.selfIntroduction:'' }</pre></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div role="tabpanel" className="tab-pane" id="price">
                                        <div className="col-xs-12 col-md-12 col-lg-8 mb-100">
                                            <div className="col-md-12 col-xs-12">
                                                <table className="detail col-md-12 col-xs-12">
                                                    <tr>
                                                        <td className="text-left">{t("Per Night")}</td>
                                                        <td className="text-right">{ currencyCode == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.stay)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left">{t("Number of Guest")}</td>
                                                        <td className="text-right">{this.state.reservationDetails.numberOfGuest } {t("People")}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left">{t("Price")}</td>
                                                        <td className="text-right">{ currencyCode == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.stay)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left">{t("Service Fee")}</td>
                                                        <td className="text-right">{ currencyCode == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.serviceFee)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left">{t("Cleaning Fee")}</td>
                                                        <td className="text-right">{ currencyCode == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.cleaningFee)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-left">
                                                            <label>{t("Total")}</label>
                                                        </td>
                                                        <td className="text-right">{ currencyCode == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.total)}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                            {this.state.cancellationPolicy!=null?
                                                <div className="col-md-12 col-xs-12">
                                                    <h3>{t("Cancellation")} </h3>
                                                    <table className="detail col-md-12 col-xs-12 cancel-day">
                                                        <tr>
                                                            <td className="text-left">{ this.state.cancellationPolicy.name }</td>
                                                            <td className="text-right">({this.state.cancellationPolicy.description})</td>
                                                        </tr>
                                                        { this.state.cancellationPolicyNotice.map((text, j) => { return (
                                                            <tr>
                                                                <td className="text-left">{text.days} {text.days > 1 ? t("Days ago") : t("Day ago")}</td>
                                                                <td className="text-right">{t("Total accommodation fee")} {text.refund}%</td>
                                                            </tr>
                                                        ) }) }
                                                    </table>
                                                </div>:null}
                                        </div>
                                    </div>
                                    <div role="tabpanel" className="tab-pane" id="host">
                                        <div className="col-xs-12 col-md-12 ">
                                            <div className="col-md-3 col-xs-12">
                                                <ul className="itineray-host-details text-justify-sm">
                                                    <li className="center">
                                                        <img className="img-circle" src={owner.profile ? baseMVacationApiUrl + '/media/' + owner.profile.picture.id + '/data?size=128x128':baseCmsUrl + "/storage/app/media/default-images/218x218.png" } />
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-8 col-xs-12 text-justify-sm">
                                                <label htmlFor="name">{t("Name")}</label>
                                                <p className="detail border-btn">{owner.firstName } {owner.lastName }</p>
                                                <label htmlFor="email border-bottom">{t("Email")}</label>
                                                <p className="detail border-btn">{owner.email }</p>
                                                <label htmlFor="phone">{t("Phone Number")}</label>
                                                <p className="detail border-btn">{owner.profile ? owner.profile.phoneNumber :'' }</p>
                                                <label htmlFor="phone">{t("Self-Introduction")}</label>
                                                <p className="detail border-btn">{owner.profile ? owner.profile.selfIntroduction:'' }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div role="tabpanel" className="tab-pane" id="access">
                                        <div className="col-md-12 col-xs-12 ">
                                            {this.state.longitude && this.state.latitude ?
                                                <MapApp translations={translations} line1={this.state.reservationDetails.accomodation.address.line1} city={this.state.reservationDetails.accomodation.address.city} state={this.state.reservationDetails.accomodation.address.state} longitude={this.state.longitude} latitude={this.state.latitude} postcode={this.state.reservationDetails.accomodation.address.postcode} height={ '500px'} />:null }
                                        </div>
                                    </div>
                                </div>
                                { (mode=='hostButton') ?
                                    <div className="col-md-12 mb-20">
                                        <button type="button" className="btn btn-lg button-medium" onClick={this.acceptReservation.bind(this)} style={{width: '42%',marginRight: '5px'}}>{t("Accept")}</button>
                                        <button type="button" className="btn btn-lg button-medium second pull-right" onClick={this.rejectReservation.bind(this)} style={{width: '42%'}}>{t("Reject")}</button>
                                    </div>
                                    :  (mode=='guestButton') ?
                                        <div className="col-md-12 mb-20 center">
                                            <button type="button" className="room-property-cancel-button" onClick={this.cancelReservation.bind(this)}>{t("Cancel")}</button>
                                        </div>
                                        : null }
                            </div>
                        </div>
                    </section>
                    <section className="guest-action-board">
                        <div className="container">
                            <div className="row visible-lg">
                                <div className="center page-section-title">
                                    <h3 className="tm-font-en"> {t("Booking details")}</h3></div>
                                <div className="col-sm-12 col-md-8" style={{"display": this.state.style}}>
                                    <MessageAccommodation errors={this.state.msg} type={this.state.type} />
                                </div>
                                <div id="flash" className={this.state.flashMsg ? "alert alert-success alert-dismissable" : "" } style={{marginTop: "1em"}}>
                                    <dd>{this.state.flashMsg}</dd>
                                </div>
                                <div className="row room-property-sidebar-display col-md-4 nopadding visible-lg">
                                    <div className="room-property-sidebar-top">
                                        <img src={this.state.reservationDetails.accomodation.featuredPicture ? baseMVacationApiUrl + '/media/' + this.state.reservationDetails.accomodation.featuredPicture.id + '/data?size=700x500' : baseCmsUrl + "/storage/app/media/default-images/250x250.png" } className="img-responsive z-depth-2" />
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-10">
                                        <h5>{t("Check In")}</h5>
                                        <div className="content-date">{this.state.reservationDetails.startDate ? moment(this.state.reservationDetails.startDate).format('MM'):null}月{this.state.reservationDetails.startDate ? moment(this.state.reservationDetails.startDate).format('DD'):null}{t("Day")}</div>
                                        <div className="content-time">{ this.state.reservationDetails.accomodation.rule.checkInTime == null ? null:this.state.reservationDetails.accomodation.rule.checkInTime}</div>
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-10">
                                        <h5>{t("Check Out")}</h5>
                                        <div className="content-date">{moment(this.state.reservationDetails.endDate).format('MM')}月{moment(this.state.reservationDetails.endDate).format('DD')}{t("Day")}</div>
                                        <div className="content-time">{ this.state.reservationDetails.accomodation.rule.checkOutTime == null ? null:this.state.reservationDetails.accomodation.rule.checkOutTime }</div>
                                    </div>
                                    <div className="room-property-sidebar-kaike " style={{marginTop: '20px'}}>
                                        <h5>&nbsp;</h5>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Per Night")}</span>
                                            <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.stay)}</span>
                                        </div>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Number of Guest")}</span>
                                            <span className="room-property-sidebar-kaike-price">{this.state.reservationDetails.numberOfGuest }名</span>
                                        </div>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Price")}</span>
                                            <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.stay)}</span>
                                        </div>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Service Fee")}</span>
                                            <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.serviceFee)}</span>
                                        </div>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Cleaning Fee")}</span>
                                            <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.cleaningFee)}</span>
                                        </div>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Total")}</span>
                                            <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.reservationDetails.price.total)}</span>
                                        </div>
                                    </div>
                                    <div className="room-property-sidebar-kaike mt-30">
                                        <h5>{t("Other Information")}</h5>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Host Name")}</span>
                                            <span className="room-property-sidebar-kaike-price">
								                                    {userProfilePage}
								                                </span>
                                        </div>
                                        <div className="room-property-sidebar-kaike-line">
                                            <span className="room-property-sidebar-kaike-type">{t("Receipt Status")}</span>
                                            <span className="room-property-sidebar-kaike-price" style={{ "color":this.state.reservationDetails.status=='APPROVED' ? "green": "red"}}>
								                        <i className={this.state.reservationDetails.status=='APPROVED'?"fa fa-check-circle":"fa fa-close"} aria-hidden="true" color="green"> &nbsp;</i>{t("Payment")}</span>
                                        </div>
                                        <div className="room-property-sidebar-kaike-line" style={{marginBottom: '30px'}}>
                                            <span className="room-property-sidebar-kaike-type">{t("Reservation Status")}</span>
                                            <span className="room-property-sidebar-kaike-price" style={{ "color":this.state.reservationDetails.status=='APPROVED' ? "green": "red"}}><span className={this.state.reservationDetails.status}><strong>{this.getStatus(this.state.reservationDetails.status)}</strong></span></span>
                                        </div>
                                    </div>
                                    { (mode=='hostButton') ?
                                        <div className="col-md-12 mb-20">
                                            <button type="button" className="btn btn-lg button-medium" onClick={this.acceptReservation.bind(this)} style={{width: '42%',marginRight: '5px'}}>{t("Accept")}</button>
                                            <button type="button" className="btn btn-lg button-medium second pull-right" onClick={this.rejectReservation.bind(this)} style={{width: '42%'}}>{t("Reject")}</button>
                                        </div>
                                        : (mode=='guestButton') ?
                                            <div className="room-property-sidebar-button">
                                                <button className="button" onClick={this.cancelReservation.bind(this)}>{t("Cancel")}</button>
                                            </div>
                                            : null }
                                </div>
                            </div>
                        </div>
                        <div className="container mb-50 visible-lg">
                            <div className="row">
                                <div className="col-xs-12 col-md-12  itinerary-details-guest-content  mb-50">
                                    <div className="col-md-12 col-xs-12 mb-50">
                                        <h3>{this.state.reservationDetails.accomodation.name}</h3>
                                        <i className="fa fa-map-marker subtext"></i><span>{this.state.reservationDetails.accomodation.address.city}・{this.state.reservationDetails.accomodation.address.state}</span>
                                    </div>
                                    <div className="col-xs-6 col-md-6 col-lg-4 ">
                                        <div className="start">
                                            <span className="line">{t("Start Date")}</span>
                                            <li>
                                                <span className="line-2 list-unstyled">{this.state.reservationDetails.startDate ? moment(this.state.reservationDetails.startDate).format('YYYY'):null }</span>
                                                <span className="monthly">{this.state.reservationDetails.startDate ? moment(this.state.reservationDetails.startDate).format('MMM'):null }</span>
                                                <span className="day">{this.state.reservationDetails.startDate ?  moment(this.state.reservationDetails.startDate).format('DD'):null }</span>&nbsp;
                                                <span className="week">{this.state.reservationDetails.startDate ? moment(this.state.reservationDetails.startDate).format('ddd'):null }</span>
                                            </li>
                                        </div>
                                    </div>
                                    <div className="col-xs-6 col-md-6 col-lg-4">
                                        <div className="end">
                                            <span className="line">{t("End Date")}</span>
                                            <li>
                                                <span className="line-2 list-unstyled">{moment(this.state.reservationDetails.endDate).isValid() ? moment(this.state.reservationDetails.endDate).format('YYYY'):"" }</span>
                                                <span className="monthly">{moment(this.state.reservationDetails.endDate).isValid() ? moment(this.state.reservationDetails.endDate).format('MMM'):"" }</span>
                                                <span className="day">{moment(this.state.reservationDetails.endDate).isValid() ?  moment(this.state.reservationDetails.endDate).format('DD'):"" }</span>&nbsp;
                                                <span className="week">{ moment(this.state.reservationDetails.endDate).isValid()? moment(this.state.reservationDetails.endDate).format('ddd'):"" }</span>
                                            </li>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 col-xs-12 col-lg-8">
                                    <div className="col-md-12 col-xs-12 itinary-body">
                                        <div className="page header">
                                            <h3 className="page-header">{t("Booking details")}</h3>
                                        </div>
                                        <div className="col-md-4 col-xs-12">
                                            <div className="img-responsive" data-slide-number="0">
                                                <img src={this.state.reservationDetails.user.profile ? baseMVacationApiUrl + '/media/' + this.state.reservationDetails.user.profile.picture.id + '/data?size=225x225':baseCmsUrl + "/storage/app/media/default-images/218x218.png" } />
                                            </div>
                                        </div>
                                        <div className="col-md-8 col-xs-12">
                                            <ul className="detail">
                                                <li>{this.state.reservationDetails.user.firstName } {this.state.reservationDetails.user.lastName }</li>
                                                <br/>
                                                <li>{this.state.reservationDetails.user.email }</li>
                                                <br/>
                                                <li>{this.state.reservationDetails.user.profile ? this.state.reservationDetails.user.profile.phoneNumber :'' }</li>
                                                <br/>
                                                <li>{this.state.reservationDetails.user.profile ? this.state.reservationDetails.user.profile.gender :''}</li>
                                                <br/>
                                                <br/>
                                                <li> <pre className="testimonial-section message-content-box" style={{border: "none", background: "none", fontFamily: "inherit", paddingLeft: "0px", lineHeight: "inherit"}}>{this.state.reservationDetails.user.profile ? this.state.reservationDetails.user.profile.selfIntroduction:'' }</pre></li>
                                            </ul>
                                        </div>
                                        {(this.state.cancellationPolicy) ?
                                            <div className="page header col-md-12">
                                                <h3 className="page-header">{t("Cancellation")}</h3>
                                                <p className="detail">
                                                    <h4>{ this.state.cancellationPolicy.name }</h4>
                                                    <h5>({this.state.cancellationPolicy.description})</h5>
                                                    <ul>
                                                        { this.state.cancellationPolicyNotice.map((text, j) => { return (
                                                            <li style={{display: "block"}}> {text.days} {text.days > 1 ? t("Days ago") : t("Day ago")} : {t("Total accommodation fee")} {text.refund} %</li>
                                                        ) }) }
                                                    </ul>
                                                </p>
                                            </div>
                                            :null}
                                    </div>
                                </div>
                                <div className="page header col-md-12 col-lg-12">
                                    {this.state.longitude && this.state.latitude ?
                                        <MapApp translations={translations} line1={this.state.reservationDetails.accomodation.address.line1} city={this.state.reservationDetails.accomodation.address.city} state={this.state.reservationDetails.accomodation.address.state} longitude={this.state.longitude} latitude={this.state.latitude} postcode={this.state.reservationDetails.accomodation.address.postcode} height={ '400px'} />:null }
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )
        } else {
            return (
                <div className="container" style={{marginTop: "6em"}}>
                    <div className="alert alert-danger alert-dismissable">
                        <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}} className="glyphicon glyphicon-remove-circle"></span>
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>{t("info")}!</strong> {t("This page is available only for authenticated user")}
                    </div>
                </div>
            )
        }
    }
}
export default TranslationWrapper(translate("ReservationDetails")(ReservationDetails))
//export default ReservationDetails;