//external
import React, { Component } from "react"
import Select from 'react-select';

// internal


import UserAccommodation from "./UserAccommodation"
import validateInput from './validation/signup';
import TextFieldGroup from './common/TextFieldGroup';
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"
import Message from "./common/Message"



class ProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateValue: '',
            states: [],
            clearable:false,
            errors: [],
            day: '',
            month: '',
            year: '',
            countries: [],
            languages: [],

            profileImageId: "",
            profileImageUrl: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            dob: "",
            gender: "",
            language: "",
            selfIntroduction: "",
            country: "",
            postcode: "",
            state: "",
            city: "",
            countryCode: "",
            streetAddress: "",
            buildingName: "",
            validationMessage: [],
            validationType: false,
            msgTypeTitle: ''
        }

        this.uploadImg = this.uploadImg.bind(this);
    }

    componentDidMount() {
        this.loadCountries();
        this.loadLanguages();

        this.loadUserProfile();

    }

    loadCountries(){
        var url = baseMVacationApiUrl + "/country?offset=0&size=300";
        var self = this;
        axios.get(url, {crossDomain: true, withCredentials: true})
            .then(function (response) {
                self.setState({
                    countries: response.data.items
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    loadLanguages(){
        var url = baseMVacationApiUrl + "/language?offset=0&size=300";
        var self = this;
        axios.get(url)
            .then(function (response) {
                self.setState({
                    languages: response.data.items
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    loadUserProfile() {
        let url = baseMVacationApiUrl + "/user/0";
        let self = this;

        $.ajax({
            url : baseMVacationApiUrl + "/user/0",
            type: "GET",
            //data : userP.toJsonString(),
            dataType : 'json',
            contentType: 'application/json',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success : function(data) {
                console.log(data);
                let datetime, day, month, year;
                if(data.profile && data.profile.dateOfBirth){
                    datetime = new Date(data.profile.dateOfBirth);
                    day = datetime.getDate();
                    month = datetime.getMonth() + 1; //month: 0-11
                    year = datetime.getFullYear();
                }
                self.setState({
                    email: data.email,
                    lastName: data.lastName,
                    firstName: data.firstName,

                    phoneNumber: data.profile ? data.profile.phoneNumber : "",
                    gender: data.profile ? data.profile.gender: "",
                    //language: data,
                    selfIntroduction: data.profile ? data.profile.selfIntroduction : "",
                    //country: data.profile.address.country.countryCode,
                    postcode: data.profile ? data.profile.address.postcode : "",
                    state: data.profile ? data.profile.address.state : "",
                    city: data.profile ? data.profile.address.city : "",
                    countryCode: data.profile ? data.profile.address.country.countryCode : "",
                    streetAddress: data.profile ? data.profile.address.line1 : "",
                    buildingName: data.profile ? data.profile.address.line2 : "",
                    profileImageId: data.profile ? data.profile.picture.id : "",
                    profileImageUrl: data.profile ? data.profile.picture.url : "",
                    language: data.settings && data.settings.preferredLanguage ?  data.settings.preferredLanguage.id : "",
                    day: day,
                    month: month,
                    year: year
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error");
            }
        });

    }

    isValid() {
        const { errors, isValid } = validateInput(this.state.signup);
        console.log("ll" + errors);
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

    switchCountry(newValue) {
       // var newValue = e.target.value;
        this.setState({
            countryCode: newValue
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

    handleSubmit(e) {
        e.preventDefault();
      //  if (this.isValid()) {
       // this.setState({ errors: {}, isLoading: true });

            var userProfile = {
                email: this.state.email,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
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
                            //id: 1,
                            countryCode: this.state.countryCode
                        }
                    },
                    gender: this.state.gender,
                    dateOfBirth: this.state.year + "-" + this.state.month + "-" + this.state.day,
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



            console.log(userProfile);
            var self = this;


            axios.put(baseMVacationApiUrl + "/user/0", userProfile, {
                    crossDomain: true,
                    withCredentials: true
                })
                .then(function (response) {
                    let { t } = self.props
                    let msgArr = [];
                    msgArr.push(t('Successfully updated!'));

                    self.setState({
                            validationType: false,
                            msgTypeTitle: t("Success"),
                            validationMessage:  msgArr
                        });
                })
                .catch(function (res) {
                    //console.log("ERROR: " + res);
                    if(res instanceof Error) {
                        let msgArr = [];
                        if (res.response != null) {
                            msgArr.push(res.response.data.message);
                            res.response.data.details.forEach(function (item) {
                                msgArr.push(item.message);
                            });

                        }
                      //  self.setState({validationType: true});
                      //  self.setState({validationMessage: msgArr});

                        self.setState({
                            validationType: true,
                            msgTypeTitle: t("Error"),
                            validationMessage:  msgArr
                        });
                    }
                });

       // }

	/*
        $.ajax({
            url : baseMVacationApiUrl + "/user/0",
            type: "PUT",
            data : JSON.stringify(userProfile),
            dataType : 'json',
            contentType: 'application/json',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success : function(data) {
                //console.log("yeeeii")
                let msgArr = [];
                msgArr.push('Successfully updated!');

                self.setState({validationType: false});
                self.setState({validationMessage:  msgArr});

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error");
            }
        });

        */
    }
    onInputChange(e) {
        //this.state.[e.target.name] = e.target.value;
        this.setState({[e.target.name]: e.target.value});
    }

    handleChangeTextArea(event) {
        this.setState({selfIntroduction: event.target.value});
        console.log(event.target.value);
    }

    uploadImg(e) {
        e.preventDefault();
        let image = e.target.files[0];
        let data = new FormData();
        data.append('file', image);
        var self = this;

        $.ajax({
            url : baseMVacationApiUrl + "/mediaform",
            type: "POST",
            data : data,
            processData: false,
            contentType: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success : function(data) {
                self.setState({
                    profileImageId: data.id,
                    profileImageUrl: data.url
                })

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(error);
            }
        });
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
        for(var i = 1900; i <= currentYear; i++){
            year.push({value: i, label: i})
        }

        const { errors } = this.state;
        const { t } = this.props

        gender.push({value: "MALE", label: t("male")});
        gender.push({value: "FEMALE", label: t("female")});



        let profileImageUrl = this.state.profileImageUrl;
        let $imagePreview = (<img src="http://placehold.jp/300x300.png" />);

        if (profileImageUrl) {
            $imagePreview = (<img src={profileImageUrl} />);
        }

        return (
            <div className="container">
                <div className="row btn-margin">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="center section-title"><h3>ユーザー情報登録</h3></div>
                    <Message errors={this.state.validationMessage} type={this.state.validationType} msgTypeTitle={this.state.msgTypeTitle}/>
                        <div className="row btn-margin">
                            <div className="col-sm-3">{ t("basic_information")}<span className="hrlong hidden-xs"></span></div>
                            <div className="col-sm-9">
                                <div className="col-sm-4">
                                    <div className="carousel-inner">
                                        <div className="active item" data-slide-number="0">
                                            {$imagePreview}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-8 btn-margin">
                                    <div className="col-sm-6 form-group">
                                        <TextFieldGroup
                                            error={errors.firstName}
                                            label={t("firstName")}
                                            onChange={this.onInputChange.bind(this)}
                                            value={this.state.firstName}
                                            field="firstName"
                                            placeholder={t("first_name")}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-sm-6 form-group">
                                        <TextFieldGroup
                                            error={errors.lastName}
                                            label={t("lastName")}
                                            onChange={this.onInputChange.bind(this)}
                                            value={this.state.lastName}
                                            field="lastName"
                                            placeholder={t("last_name")}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-sm-6 form-group">
                                        <TextFieldGroup
                                            error={errors.email}
                                            label={t("email_address")}
                                            onChange={this.onInputChange.bind(this)}
                                            value={this.state.email}
                                            field="email"
                                            placeholder={t("email")}
                                            required="required"
                                            type="email"
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-sm-6 form-group">
                                        <TextFieldGroup
                                                error={errors.phoneNumber}
                                                label={t("phone_number")}
                                                onChange={this.onInputChange.bind(this)}
                                                value={this.state.phoneNumber}
                                                field="phoneNumber"
                                                placeholder={t("phoneNumber")}
                                                required="required"
                                                type="text"
                                                className="form-control"
                                        />
                                    </div>

                                    <br /><br />
                                        <div className="col-sm-12">
                                            <h5 style={{float: "left"}}><small>ファイルをアップデート (最大３MBまで)</small></h5>
                                        </div>
                                        <div className="col-sm-6">
                                            <small> <input type="file" id="file"  onChange={this.uploadImg}/> </small>
                                        </div>
                                </div>
                            </div>
                        </div>





                <div className="row btn-margin">
                    <div className="col-sm-3" alt="Accomodation Details">個人情報<span className="hrlong hidden-xs"></span></div>
                    <div className="col-sm-9 form-acm">
                        <div className="col-sm-3 form-group">

                            <label>{t('day')}</label>
                            <Select ref="daySelect" placeholder={t("select")} options={day} simpleValue clearable={this.state.clearable}  name="selected-day"  value={this.state.day} onChange={this.switchDay.bind(this)} searchable={this.state.searchable} required="required"/>
                        </div>
                        <div className="col-sm-3 form-group">
                            <label>{t('month')}</label>
                            <Select ref="monthSelect"  placeholder={t("select")} options={month} simpleValue clearable={this.state.clearable} name="selected-month"  value={this.state.month} onChange={this.switchMonth.bind(this)} searchable={this.state.searchable} required="required"/>

                        </div>
                        <div className="col-sm-3 form-group">
                            <label>{t('christian_era')}</label>
                            <Select ref="monthSelect" placeholder={t("select")} options={year} simpleValue clearable={this.state.clearable}  name="selected-year"  value={this.state.year} onChange={this.switchYear.bind(this)} searchable={this.state.searchable} required="required" />
                        </div>

                        <div className="col-sm-4 form-group">
                            <label>{t("gender")}</label>
                            <Select ref="gender" placeholder={t("select")} options={gender} simpleValue clearable={this.state.clearable}  name="selected-gender"  value={this.state.gender} onChange={this.switchGender.bind(this)} searchable={this.state.searchable} required="required"/>
                        </div>
                        <div className="col-sm-4 form-group">
                            <label>{t('language')}</label>
                            <Select ref="languageCode" placeholder={t("select")} options={this.state.languages} simpleValue clearable={this.state.clearable}  name="selected-language"  value={this.state.language} onChange={this.switchLanguage.bind(this)} searchable={this.state.searchable} labelKey="languageName" valueKey="id" />
                        </div>


                        <div className="col-sm-11 form-group">
                            <label>{t("self_introduction")}</label>
                            <textarea type="text" placeholder={t("self_introduction_")} rows="5" className="form-control" value={this.state.selfIntroduction} onChange={this.handleChangeTextArea.bind(this)} />
                        </div>
                    </div>
                </div>



                <div className="row btn-margin">
                    <div className="col-sm-3" style={{marginTop: '40px'}} alt="Accomodation Details">住所<span className="hrlong hidden-xs"></span></div>
                    <div className="col-sm-9 form-acm">
                        <div className="col-sm-6 form-group">
                            <label>{t("country")}</label>
                            <Select ref="countryCode"  options={this.state.countries} simpleValue clearable={this.state.clearable} name="selected-country"  value={this.state.countryCode} onChange={this.switchCountry.bind(this)} searchable={this.state.searchable} labelKey="name"
                                    valueKey="countryCode" />
                        </div>
                        <div className="col-sm-6 form-group">
                            <TextFieldGroup
                                error={errors.postCode}
                                label={t("post_code")}
                                onChange={this.onInputChange.bind(this)}
                                value={this.state.postcode}
                                field="postcode"
                                placeholder={t("Enter Zip Code Here..")}
                                type="text"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-6 form-group">
                            <TextFieldGroup
                                error={errors.prefecture}
                                label={t("state")}
                                onChange={this.onInputChange.bind(this)}
                                value={this.state.state}
                                field="state"
                                placeholder={t("Enter State Name Here.. ")}
                                type="text"
                                className="form-control"
                            />

                        </div>
                        <div className="col-sm-6 form-group ">
                            <TextFieldGroup
                                error={errors.city}
                                label={t("city")}
                                onChange={this.onInputChange.bind(this)}
                                value={this.state.city}
                                field="city"
                                placeholder={t("city")}
                                required="required"
                                type="text"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-12 form-group">
                            <TextFieldGroup
                                error={errors.streetAddress}
                                label={t("streetAddress")}
                                onChange={this.onInputChange.bind(this)}
                                value={this.state.streetAddress}
                                field="streetAddress"
                                placeholder={t("Enter street address here...")}
                                type="text"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-12 form-group">
                           <TextFieldGroup
                                error={errors.buildingName}
                                label={t("buildingName")}
                                onChange={this.onInputChange.bind(this)}
                                value={this.state.buildingName}
                                field="buildingName"
                                placeholder={t("Enter building name here..")}
                                type="text"
                                className="form-control"
                            />
                        </div>

                    </div>
                </div>

                <div className="row btn-margin modules-signup-form">
                    <div className="col-sm-3">SNSアカウント<span className="hrshort hidden-xs"></span></div>
                    <div className=" col-sm-9 module-signup-form-social-media">

                        <div className="col-sm-6">
                            <strong>Facebook</strong>
                            <h4><small>Facebookを使ってログインして、お気に入りの物件をシェアしましょう</small></h4>
                        </div>
                        <div className="col-sm-6">
                            <button  href="#" className="btn-login-social btn-login-facebook"><i className="icon-social-facebook"></i>Facebookでサインアップ</button>
                        </div>

                        <div className="col-sm-6">
                            <strong>Twitter</strong>
                            <h4><small>Facebookを使ってログインして、お気に入りの物件をシェアしましょう</small></h4>
                        </div>
                        <div className="col-sm-6">
                            <button  href="#" className="btn-login-social btn-login-twitter"><i className="icon-social-twitter"></i>Twitterでサインアップ</button>
                        </div>

                        <div className="col-sm-6">
                            <strong>Google</strong>
                            <h4><small>Facebookを使ってログインして、お気に入りの物件をシェアしましょう</small></h4>
                        </div>
                        <div className="col-sm-6">
                            <button  href="#" className="btn-login-social btn-login-google"><i className="icon-social-google"></i>Googleでサインアップ</button>
                        </div>
                    </div>
                </div>

                <div className="row btn-margin">
                    <div className="col-sm-3">レビュー<span className="hrshort hidden-xs"></span></div>
                    <div className="col-sm-9 ">
                        <div className="col-sm-6">
                            <strong>自分のレビューを確認する</strong>
                            <h4><small>ここから他の人からのレビューを確認することができます。</small></h4>
                        </div>
                        <div className="col-sm-6">
                            <button type="button" className="btn btn-primary btn-lg btn-block button-style">自分のレビューを確認</button>
                        </div>
                        <div className="col-sm-6">
                            <strong>自分のレビューを確認する</strong>
                            <h4><small>ここから他の人からのレビューを確認することができます。</small></h4>
                        </div>
                        <div className="col-sm-6">
                            <button type="button" className="btn btn-primary btn-lg btn-block button-style">物件のレビューを確認</button>
                        </div>
                    </div>
                </div>


                <div className="row btn-margin center">
                    <button type="submit" className="btn btn-primary btn-lg profile-btn button-style">{t('publish')}</button>
                    <button type="submit" className="btn btn-secondary btn-lg button-style">{t("save_as_draft")}</button>
                </div>

                </form>

            </div>
            </div>
        );
    }
}

export default TranslationWrapper(translate("ProfileForm")(ProfileForm))
//export default SignupForm;