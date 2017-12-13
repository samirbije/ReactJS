//external
import React, { Component } from "react"
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';

// internal


import validateInput from './validation/signup';
import TextFieldGroup from './common/TextFieldGroup';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
import Message from "./common/Message";
import Rating from 'react-rating';

import UserAccommodation from "./UserAccommodation";
import MyFavouritesListSlider from "./favourites/MyFavouritesListSlider";
import UserProfileHostReviews from "./reviews/UserProfileHostReviews";
import UserProfileGuestReviews from "./reviews/UserProfileGuestReviews";
import ProfileImageUpload from "./profile/ProfileImageUpload";
import BankAccount from "./profile/BankAccount";
import BankTransaction from "./profile/BankTransaction";
import PasswordChange from "./profile/PasswordChange";

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            owner: true,
            profileId: 0,
            stateValue: '',
            states: [],
            clearable: false,
            errors: [],
            day: null,
            month: null,
            year: 1965,
            countries: [],
            languages: [],

            profileImageId: null,
            profileImageUrl: null,
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: null,
            dob: null,
            gender: null,
            language: null,
            selfIntroduction:null,
            country: null,
            postcode: null,
            state: null,
            city: null,
            countryCode: null,
            streetAddress: null,
            buildingName: null,
            validationMessage: [],
            validationType: false,
            msgTypeTitle: '',
            countryName: '',
            accommodations: [],
            userNotFound: false,
            currentLoggedInUserId: 0,
            successfullyUpdated: false,
            rating: "",
            reviewHostTotal:null,
            userProfileReviewTotal:0,

            reservationHostLists:[],
            sizeGuest:1,
            page:1,
            profileStatus: ""

        }
        this.uploadImg = this.uploadImg.bind(this);
    }


    loadReservationListFromServer(size=null){
        if(size==null){
            size = this.state.sizeGuest;
        }
        var text = {
            "userId" : 0,
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/reservation?orderBy=id&offset=0&size='+  size  +'&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                reservationGuestLists: data.items,
                reviewGuestTotal: data.total
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }



    componentDidMount() {
        if (localStorage.getItem("status")){
            this.setState({
                successfullyUpdated: true
            })
            localStorage.removeItem("status");
        }

        this.loadCountries();
        this.loadLanguages();
        this.loadUserProfile();
        //this.loadUserAccommodations();
        this.getCurrentLoggedInUserId();
        // review
        this.loadReservationListFromServer();
        //this.loadReservationHostListFromServer();
    }

    loadCountries(){
        var url = baseMVacationApiUrl + "/country?offset=0&size=300";
        var self = this;

        let onSuccessMethod = (data) => {
            self.setState({
                countries: data.items
            });
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    loadLanguages(){
        var url = baseMVacationApiUrl + "/language?offset=0&size=300";
        var self = this;

        let onSuccessMethod = (data) => {
            self.setState({
                languages: data.items
            });
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    getProfileId(){
        let currentLocation = window.location.href;
        let lastPart = currentLocation.substr(currentLocation.lastIndexOf('/') + 1);

        var profileId = 0;
        var regex=/^[0-9]+$/;
        if(lastPart == "" || lastPart == null){
            profileId = 0;
        } else if (lastPart == "user-profile"){
            profileId = 0;
        } else if(!lastPart.match(regex)) {
            profileId = 99999;
        } else {
            profileId = lastPart;
        }

        return profileId;
    }

    getCurrentLoggedInUserId(){
        var url = baseMVacationApiUrl + "/user/0";
        let self = this;

        let onSuccessMethod = (data) => {
            self.setState({
                currentLoggedInUserId: data.id
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    loadUserProfile() {
        var url = baseMVacationApiUrl + "/user/"+ this.getProfileId();
        let self = this;

        let onSuccessMethod = (data) => {
             let datetime, day=null, month=null, year=null;
             if(data.profile && data.profile.dateOfBirth){
                 datetime = new Date(data.profile.dateOfBirth);
                 day = datetime.getDate();
                 month = datetime.getMonth() + 1; //month: 0-11
                 year = datetime.getFullYear();
             }
             self.setState({
                 userId: data.id,
                 email: data.email,
                 lastName: data.lastName,
                 firstName: data.firstName,
                 phoneNumber: data.profile ? data.profile.phoneNumber : null,
                 gender: data.profile ? data.profile.gender: null,
                 //language: data,
                 selfIntroduction: data.profile ? data.profile.selfIntroduction : null,
                 //country: data.profile.address.country.countryCode,
                 postcode: data.profile ? data.profile.address.postcode : null,
                 state: data.profile ? data.profile.address.state : null,
                 city: data.profile ? data.profile.address.city : null,
                 countryCode: data.profile && data.profile.address != null && data.profile.address.country != null ? data.profile.address.country.id : 'JP',
                 countryName:  data.profile && data.profile.address != null && data.profile.address.country != null ? data.profile.address.country.name: null,
                 streetAddress: data.profile && data.profile.address != null ? data.profile.address.line1 : null,
                 buildingName: data.profile ? data.profile.address.line2 : null,
                 profileImageId: data.profile != null && data.profile.picture != null ? data.profile.picture.id : null,
                 profileImageUrl: data.profile != null && data.profile.picture != null ? data.profile.picture.url : null,
                 language: data.settings && data.settings.preferredLanguage ?  data.settings.preferredLanguage.id : null,
                 userProfileReviewTotal: data.numReviews,
                 day: day,
                 month: month,
                 year: year,
                 rating: data.rating != null ? data.rating : "0.0"
             });
        }

        let onFailMethod = (err) => {
            console.log("error not found:"+err.responseText);
            self.setState({
                userNotFound: true
            })
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);

    }

    loadUserAccommodations(){
        var self = this;

        let url = baseMVacationApiUrl + "/user/"+ this.getProfileId() +"/accommodation?offset=0&size=-1";

        let onSuccessMethod = (data) => {
            self.setState({
                accommodations: data.items
            });
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    isValid() {
        const { errors, isValid } = validateInput(this.state.signup);
        if (!isValid) {
            this.setState({ errors });
        }
        return isValid;
    }

    validatePassword(){
        if(this.state.signup.password != this.state.signup.passwordConfirmation) {
            this.setState({ errors });
        } else {
            confirm_password.setCustomValidity('');
        }
    }

    switchCountry(e) {
        console.log(e.target.value);
        this.setState({
            countryCode: e.target.value
        });
    }

    switchDay(newValue) {
        this.setState({
            day: newValue
        });
    }

    switchMonth(newValue) {
        this.setState({
            month: newValue
        });
    }

    switchYear(newValue) {
        this.setState({
            year: newValue
        });
    }

    switchGender(newValue){
        this.setState({
            gender: newValue
        });
    }

    switchLanguage(newValue){
        this.setState({
            language: newValue
        });
    }

    handleSubmitClick(button){
        console.log(button.target.value);
        //console.log(button.value);
        this.state.profileStatus = button.target.value;
    }

    handleSubmit(e) {
        e.preventDefault();
        //console.log(e); return false;
        var userProfile = {
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            status: this.state.profileStatus,
            profile: {
                firstNamePhonetic: this.state.firstName,
                lastNamePhonetic: this.state.lastName,
                selfIntroduction: this.state.selfIntroduction,
                address: {
                    line1: this.state.streetAddress,
                    line2: this.state.buildingName,
                    state: this.state.state,
                    city: this.state.city,
                    postcode: this.state.postcode,
                    country: {
                        id: this.state.countryCode
                    }
                },
                gender: this.state.gender,
                dateOfBirth: this.state.year && this.state.month && this.state.day ? this.state.year + "-" + this.state.month + "-" + this.state.day :null,
                phoneNumber: this.state.phoneNumber,
                picture: {
                    id: this.state.profileImageId,
                    url: this.state.profileImageUrl
                }
            },
            settings: {
                preferredLanguage: {
                    id: this.state.language
                }
            }
        }


        var self = this;

        let url = baseMVacationApiUrl + "/user/0"

        let onSuccessMethod = (data) => {
            let { t } = self.props;
            localStorage.setItem("status", t('successfully_updated') + "!")
            window.location = window.location.href;
        }

        let onFailMethod = (err) => {
            window.scrollTo(0, 0);
            let { t } = self.props;
            var msgArr = [];
            if(err.responseJSON && err.responseJSON.details) {
                err.responseJSON.details.forEach(function (item) {
                    msgArr.push(item.message);
                });
            }else if(err.responseJSON){
                msgArr.push(err.responseJSON.message);
            }else {
                msgArr.push(err.responseText);
            }

            self.setState({validationType:true});
            self.setState({validationMessage:msgArr});
            self.setState({msgTypeTitle: t("error")});
        }

        ajaxCall(url, "PUT", userProfile, onSuccessMethod, onFailMethod);

    }
    onInputChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleChangeTextArea(event) {
        this.setState({selfIntroduction: event.target.value});
    }

    uploadImg(file) {
        let image = file;
        let data = new FormData();
        data.append('file', image);
        var self = this;

        let url = baseMVacationApiUrl + "/mediaform";
        let ctype = "media";
        let onSuccessMethod = (data) => {
            self.setState({
                profileImageId: data.id,
                profileImageUrl: data.url
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "POST", data, onSuccessMethod, onFailMethod, ctype);
    }

    getTabsForOwner(t){
        return (
            <ul className="nav nav-tabs user-profile-tab">
                <li className="sliding-middle-out active"><a href="#tab1" data-toggle="tab">{t('View')}</a></li>
                <li className="sliding-middle-out"><a href="#tab2" data-toggle="tab">{t('Edit')}</a></li>
                <li className="sliding-middle-out"><a href="#tab3" data-toggle="tab">{t('Account')}</a></li>
                <li className="sliding-middle-out"><a href="#tab4" data-toggle="tab">{t('Transaction')}</a></li>
                <li className="sliding-middle-out"><a href="#tab5" data-toggle="tab">{t('Password')}</a></li>
            </ul>
        )

    }
    getTabsForVisitor(t){
        return (
            <ul className="nav nav-tabs">
                <li className="sliding-middle-out active"><a href="#tab1" data-toggle="tab">{t('View')}</a></li>
            </ul>
        )
    }

    render() {
        var day = [];
        var month = [];
        var year = [];
        var gender = [];
        for(var i = 1; i <= 31; i++){
            day.push({value: i, label: i})
        }

        for(var i = 1; i <= 12; i++){
            month.push({value: i, label: i})
        }

        var now = new Date();
        var currentYear = parseInt(now.getFullYear());
        for(var i = 1900; i <= currentYear; i++) {
            year.push({value: i, label: i})
        }

        const { errors } = this.state;
        const { t } = this.props

        gender.push({value: "MALE", label: t("Male")});
        gender.push({value: "FEMALE", label: t("Female")});
        gender.push({value: "OTHER", label: t("Other")});


        let profileImageUrl = this.state.profileImageUrl;
        let profileImageId = this.state.profileImageId
        let $imagePreview = (baseCmsUrl + "/storage/app/media/default-images/250x250.png");

        var currentCarouselSlot = 1;

        if (profileImageId) {
            $imagePreview = (baseMVacationApiUrl + "/media/"+ profileImageId + "/data?size=250x250");

        }
        var owner = true;
        var pId = this.getProfileId();
        var userId = (this.state.currentLoggedInUserId);


        if(parseInt(pId) > 0 && (parseInt(userId) != parseInt(pId))){
            owner  = false;
        }


        if (this.state.userNotFound == false){
            return (
                <div className="container">
                    <div className="center page-section-title"><h3>{t('User Profile')}</h3></div>
                    { this.state.successfullyUpdated ?
                        <div className="alert alert-success alert-dismissable" id="user-profile-update-success-message-container">
                            <a href="#" className="close" data-dismiss="alert" aria-label="close">×</a>
                            <span className="glyphicon glyphicon-ok-circle" style={{"float": "left", margin: "0.15em 0.15em 0 0"}}> </span>
                            <strong>{t("Success")}!</strong> <span id="user-profile-update-success-message">{t("Successfully Updated")}</span>
                        </div> : null
                    }

                    { owner ? this.getTabsForOwner(t) : this.getTabsForVisitor(t)}



                    <div className="tab-content">
                        <div className="tab-pane fade in active" id="tab1">
                            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                <div className="panel-body class personal-info">
                                    <div className="media-personal">
                                        <div className="avatar-md">
                                            <img className="img-responsive img-circle center  center-block" src={$imagePreview} />
                                        </div>
                                        <div className="col-md-12">
                                            <h3 className="center">{this.state.firstName} {this.state.lastName}</h3>
                                            <h4 className="center"><small><i className="fa fa-map-marker" aria-hidden="true"></i>{this.state.city}.{this.state.countryName}</small></h4>
                                        </div>
                                        <div className=" col-md-12 post-content">
                                            <div className="self-description">
                                                <pre className="testimonial-section mt-20 message-content-box" style={{border: "none", background: "none", fontFamily: "inherit", paddingLeft: "0px", lineHeight: "inherit"}}>{this.state.selfIntroduction}</pre>
                                            </div>

                                            <div className="divider-md"></div>
                                            <div className="container-fluid">
                                                <div className="row centered">
                                                    <ul className="personal-info">
                                                        <li><i className="fa fa-envelope" aria-hidden="true"></i>{this.state.email}</li>
                                                        <li><i className="fa fa-phone" aria-hidden="true"></i>{this.state.phoneNumber}</li>
                                                        <li><i className="fa fa-birthday-cake" aria-hidden="true"></i>{this.state.day}.{this.state.month}.{this.state.year}</li>
                                                        <li><i className="fa fa-check" aria-hidden="true"></i>{t('Approved')}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
                                { owner ? <MyFavouritesListSlider {...this.props} /> : null }
                                <UserProfileHostReviews {...this.props} />
                                <UserProfileGuestReviews {...this.props} />
                                <UserAccommodation currentLoggedInUserId ={this.state.currentLoggedInUserId}{...this.props} />
                            </div>

                        </div>

                        <div className="tab-pane fade" id="tab2">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <Message errors={this.state.validationMessage} type={this.state.validationType} msgTypeTitle={this.state.msgTypeTitle} />
                                <div className="hidden-xs mb-50 space-50">

                                </div>
                                <div className="row mb-50">
                                    <div className="col-sm-3 hidden-xs center">{t('Basic Information')}<span className="hrlong hidden-xs"></span></div>
                                    <div className="col-sm-9">
                                        <div className="col-sm-4">
                                            <div className="carousel-inner">
                                                <div className="active item mt-20 img-sm" data-slide-number="0">
                                                    <img src={$imagePreview} width="250" height="250" className="img-circle img-sm card-block shadow "/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-sm-8 nopadding-l-f">
                                            <div className="col-sm-6 form-group">
                                                <TextFieldGroup
                                                    error={errors.firstName}
                                                    label={t("First Name")}
                                                    onChange={this.onInputChange.bind(this)}
                                                    value={this.state.firstName}
                                                    field="firstName"
                                                    placeholder={t("Enter first name here...")}
                                                    className="form-control input-lg"
                                                />
                                            </div>
                                            <div className="col-sm-6 form-group">
                                                <TextFieldGroup
                                                    error={errors.lastName}
                                                    label={t("Last Name")}
                                                    onChange={this.onInputChange.bind(this)}
                                                    value={this.state.lastName}
                                                    field="lastName"
                                                    placeholder={t("Enter last name here...")}
                                                    className="form-control input-lg"
                                                />
                                            </div>
                                            <div className="col-sm-12 form-group">
                                                <label>{t("Email")}</label>
                                                <div  className="form-control  input-lg " style={{backgroundColor: '#eee'}}>{this.state.email}</div>
                                            </div>
                                            <div className="col-sm-12 form-group">
                                                <TextFieldGroup
                                                    error={errors.phoneNumber}
                                                    label={t("Phone Number")}
                                                    onChange={this.onInputChange.bind(this)}
                                                    value={this.state.phoneNumber}
                                                    field="phoneNumber"
                                                    placeholder={t("Enter phone number here...")}
                                                    type="text"
                                                    className="form-control input-lg "
                                                />
                                            </div>

                                            <ProfileImageUpload uploadImg={this.uploadImg} {...this.props} />

                                            <div className="col-sm-12 mt-10">
                                                <h5>※ {t("Maximum 3(MB) file can be uploaded")}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="row mb-100　mt-20 ">
                                    <div className="col-sm-3 hidden-xs   mb-100 center">{t('Personal Information')}<span className="hr hidden-xs"></span></div>
                                    <div className="col-sm-9 ">
                                        <div className="col-sm-9">
                                            <label>{t('Your Birthday')}</label>
                                        </div>
                                        <div className="col-md-4 col-12  form-group">
                                            <label>{t('Day')}</label>
                                            <Select ref="daySelect" placeholder={t("Select")} options={day} simpleValue clearable={this.state.clearable}  name="selected-day" value={this.state.day} onChange={this.switchDay.bind(this)} searchable={this.state.searchable} />
                                        </div>
                                        <div className="col-md-4 col-12  form-group">
                                            <label>{t('Month')}</label>
                                            <Select ref="monthSelect" placeholder={t("Select")} options={month} simpleValue clearable={this.state.clearable} name="selected-month"  value={this.state.month} onChange={this.switchMonth.bind(this)} searchable={this.state.searchable} />
                                        </div>
                                        <div className="col-md-4 col-12  form-group">
                                            <label>{t('Year')}</label>
                                            <Select ref="monthSelect"  placeholder={t("Select")} options={year} simpleValue clearable={this.state.clearable}  name="selected-year"  value={this.state.year} onChange={this.switchYear.bind(this)} searchable={this.state.searchable}  />
                                        </div>
                                        <div className="col-md-4 col-12  form-group">
                                            <label>{t("Gender")}</label>
                                            <Select ref="gender"  placeholder={t("Select")} options={gender} simpleValue clearable={this.state.clearable}  name="selected-gender"  value={this.state.gender} onChange={this.switchGender.bind(this)} searchable={this.state.searchable} />
                                        </div>
                                        <div className="col-md-4 col-12  form-group">
                                            <label>{t('Language')}</label>
                                            <Select ref="languageCode" placeholder={t("Select")} options={this.state.languages} simpleValue clearable={this.state.clearable}  name="selected-language"  value={this.state.language} onChange={this.switchLanguage.bind(this)} searchable={this.state.searchable} labelKey="name" valueKey="id" />
                                        </div>
                                        <div className="col-md-4 col-12  form-group hidden">
                                            <label>{t('Language')}</label>
                                            { this.state.accommodations != null ? this.state.accommodations : ""}
                                            <Select ref="languageCode" placeholder={t("Select")} options={this.state.languages} simpleValue clearable={this.state.clearable}  name="selected-language"  value={this.state.language} onChange={this.switchLanguage.bind(this)} searchable={this.state.searchable} labelKey="name" valueKey="id" />
                                        </div>
                                        <div className="col-md-12 col-12  form-group form-group">
                                            <label>{t("Self Introduction")}</label>
                                            <textarea type="text" placeholder={t("Enter self introduction here...")} rows="3" className="form-control input-lg　no-deco" value={this.state.selfIntroduction} onChange={this.handleChangeTextArea.bind(this)} />
                                        </div>
                                    </div>
                                </div>


                                <div className="row mb-100　mt-20 ">
                                    <div className="col-sm-3 mt-20 center">{t("Street Address")}<span className="hr hidden-xs"></span></div>
                                    <div className="divider hidden-lg hidden-md"></div>

                                    <div className="col-sm-9 ">
                                        <div className="col-sm-6 form-group">
                                            <label>{t("Country")}</label>

                                            <select className="form-control" onChange={this.switchCountry.bind(this)}>
                                                {
                                                    this.state.countries.map((item, i) => {
                                                        return (
                                                            item.id != this.state.countryCode ?
                                                                <option key={i} value={item.id}>{item.name}</option>
                                                                : <option key={i} value={item.id} selected>{item.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.postCode}
                                                label={t("Postcode")}
                                                onChange={this.onInputChange.bind(this)}
                                                value={this.state.postcode}
                                                field="postcode"
                                                placeholder={t("Enter Post Code Here...")}
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.prefecture}
                                                label={t("State")}
                                                onChange={this.onInputChange.bind(this)}
                                                value={this.state.state}
                                                field="state"
                                                placeholder={t("Enter State Name Here...")}
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.city}
                                                label={t("City")}
                                                onChange={this.onInputChange.bind(this)}
                                                value={this.state.city}
                                                field="city"
                                                placeholder={t("Enter City Name Here...")}
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-sm-12 form-group">
                                            <TextFieldGroup
                                                error={errors.streetAddress}
                                                label={t("Street Address")}
                                                onChange={this.onInputChange.bind(this)}
                                                value={this.state.streetAddress}
                                                field="streetAddress"
                                                placeholder={t("Enter street address here...")}
                                                type="text"
                                                className="form-control no-deco"
                                            />
                                        </div>
                                        <div className="col-sm-12 form-group">
                                            <TextFieldGroup
                                                error={errors.buildingName}
                                                label={t("Building Name")}
                                                onChange={this.onInputChange.bind(this)}
                                                value={this.state.buildingName}
                                                field="buildingName"
                                                placeholder={t("Enter building name here..")}
                                                type="text"
                                                className="form-control no-deco"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-50">
                                    <div className="col-sm-3 hidden-xs  mb-100 center">{t("SNS Account")}<span className="hrlong hidden-xs"></span></div>
                                    <div className="modules-signup-form-np nopadding">
                                        <div className=" col-sm-9 module-signup-form-social-media">
                                            <div className="col-sm-12 sns-cta">
                                                <div className="col-sm-6">
                                                    <strong>{t("Facebook")}</strong>
                                                    <h4><small>{t("Connect to Facebook and share your favorite accommodation")}</small></h4>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button href="#" className="btn-login-social btn-login-facebook"><i className="icon-social-facebook"></i>{t("Sign up on Facebook")}</button>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 sns-cta">
                                                <div className="col-sm-6">
                                                    <strong>{t("Twitter")}</strong>
                                                    <h4><small>{t("Connect to Twitter and share your favorite accommodation")}</small></h4>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button href="#" className="btn-login-social btn-login-twitter"><i className="icon-social-twitter"></i>{t("Sign up on Twitter")}</button>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 sns-cta">
                                                <div className="col-sm-6">
                                                    <strong>{t("Google")}</strong>
                                                    <h4><small>{t("Connect to Google and share your favorite accommodation")}</small></h4>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button href="#" className="btn-login-social btn-login-google"><i className="icon-social-google"></i>{t("Sign up on Google")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-50">
                                    <div className="col-sm-3 hidden-xs center">{t("Review")}<span className="hrshort hidden-xs"></span></div>
                                    <div className="col-sm-9 ">
                                        <div className="col-sm-12 review-cta">
                                            <div className="col-sm-6">
                                                <strong>{t("Check your own review")}</strong>
                                                <h4><small>{t("You can check your review")}</small></h4>
                                            </div>

                                            <div className="col-sm-6">
                                                <button type="button" className="btn-primary btn-block button-style">
                                                    <a  className ="text-white" href={baseCmsUrl+"/review/#tab2"}>{t("Check your own review Noun")}</a>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-sm-12 review-cta">
                                            <div className="col-sm-6">
                                                <strong>{t("Check your accommodation review")}</strong>
                                                <h4><small>{t("You can check your accommodation review")}</small></h4>
                                            </div>
                                            <div className="col-sm-6">
                                                <button type="button" className=" btn-primary btn-block button-style">
                                                    <a  className ="text-white" href={baseCmsUrl+"/review/#tab1"}>{t("Check your accommodation review noun")}</a>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="divider"></div>
                                <div className="col-xs-12  mb-50  center">
                                    <button onClick={this.handleSubmitClick.bind(this)} type="submit" className="btn button-medium" value="PUBLISHED">{t('Submit')}</button>
                                    <button onClick={this.handleSubmitClick.bind(this)} type="submit" className="btn button-medium second" value="DRAFT">{t("Draft")}</button>
                                </div>
                            </form>
                        </div>


                        <div className="tab-pane fade" id="tab3">
                            <BankAccount {...this.props}/>
                        </div>
                        <div className="tab-pane fade" id="tab4">
                            <BankTransaction {...this.props}/>
                        </div>
                        <div className="tab-pane fade" id="tab5">
                            <PasswordChange email={this.state.email} {...this.props}/>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <div className="alert alert-warning alert-dismissable" style={{marginTop: "6em"}}>
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>{t('Info')}!</strong>{t('No Such User')}
                    </div>
                </div>
            )

        }

    }
}

export default TranslationWrapper(translate("UserProfile")(UserProfile));