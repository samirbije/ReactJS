    //external
import React, { Component } from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";

//internal
import Message from '../common/Message';
import SubmitButton from "../common/SubmitButton";

class InboxMessage extends Component {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        const { t } = this.props;

        /**
         * @type {object}
         * @property {string} child app className
         */
        this.state = {
            ajaxLoading: false,
            convId: 0,
            messages: [],
            offset: 0,
            perPage: 100,
            currentLoggedUserId: 0,
            messagebody: "",
            alertMsg: [t("msgFailed")],
            alertType: true,
            alertStyle:"none",
            apiErrorMsg: "",
            sourceUserId: 0,
            targetUserId: 0,
            newTargetUserId: 0,
            newTargetUser:{
                id: 0,
                firstName: "",
                lastName: "",
                profile: {
                    id:0,
                    selfIntroduction: "",
                    address:{
                        country:{
                            id:0,
                            name:"",
                            defaultName:""
                        },
                        state: "",
                        city: ""
                    },
                    picture: {
                        id:0
                     }
                },
            },
            currentUserPicId: 0,
            targetUserPicId: 0,
            currentUserFirstName: ""
        }
    }

    /**
     *
     * @returns {number}
     */
    getConversationId(){
        let currentLocation = window.location.href;
        let lastPart = currentLocation.substr(currentLocation.lastIndexOf('/') + 1);
        var conversationId = 0;
        var regex=/^[0-9]+$/;
        var decoded = base64.decode(lastPart);
        decoded = utf8.decode(decoded)
        if (lastPart == "inbox-msg"){
            conversationId = 0;
        } else if(!decoded.match(regex)) {
            conversationId = 999999999;
        } else {
            conversationId = decoded;
        }

        return conversationId;
    }

    getCurrentLoggedInUserId(){
        //console.log("accessed get current user");
        var url = baseMVacationApiUrl + "/user/0";

        let onSuccessMethod = (data) => {
            this.setState({
                currentLoggedUserId: data.id,
                currentUserPicId: (data.profile && data.profile.picture) ? data.profile.picture.id : 0,
                currentUserFirstName: data.firstName
            });
        }

        let onFailMethod = (err) => {
            console.log("error occurred getting logged user");
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    getNewTargetUser(){
        //console.log("accessed get Target User");
        let newTargetUserId = this.state.newTargetUserId;
        var url = baseMVacationApiUrl + "/user/" + newTargetUserId;

        let onSuccessMethod = (data) => {
            this.setState({
                newTargetUser: data,
                targetUserPicId: (data.profile && data.profile.picture) ? data.profile.picture.id : 0
            })
        }

        let onFailMethod = (err) => {
            console.log("error occurred getting new target user");
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    getNewTargetUserId(){
        //console.log("accessed get new target user");
        let loggedUser = this.state.currentLoggedUserId;
        let oldSourceUser = this.state.sourceUserId;
        let oldTargetUser = this.state.targetUserId;

        if (oldSourceUser == loggedUser){
            this.state.newTargetUserId = oldTargetUser;
        }else {
            this.state.newTargetUserId = oldSourceUser;
        }
    }

    getConversation(){
        //console.log("accessed get conv");

        this.state.convId = this.getConversationId();
        var convId = this.state.convId;
        var url = baseMVacationApiUrl + "/message/" + convId;

        let onSuccessMethod = (data) => {
            let firstMessage = {};
            firstMessage = data.messages[0];
            this.setState({
                messages: data.messages,
                sourceUserId: (firstMessage && firstMessage.sourceUser) ? firstMessage.sourceUser.id : 0,
                targetUserId: (firstMessage && firstMessage.targetUser) ? firstMessage.targetUser.id : 0
            }, function(){
                this.getNewTargetUserId();
                this.getNewTargetUser();
             });
        }

        let onFailMethod = (err) => {
            this.setState({
                apiErrorMsg: "error occurred"
            })
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    storeText(e){
        this.setState({ messagebody: e.target.value });
        //console.log("Text :", e.target.value);
    }

    onSendMsgSuccess(data){
        const { t } = this.props;
        let messages = this.state.messages;
        messages.push(data);
        //console.log("pushed messages :", messages);
        this.setState({
            messages: messages,
            messagebody: "",
            alertMsg: [t("Message has been sent")],
            alertType: false,
            alertStyle: "none",
            ajaxLoading: false
        });
    }

    onSendMsgFail(err){
        const { t } = this.props;
        console.log("accessed error", err);
        this.setState({
            alertMsg: [t("Failed to send the message")],
            alertType: true,
            alertStyle: "block",
            ajaxLoading: false
        });
    }

    handleSendMessage(){
        if(this.state.messagebody.trim() !==  "") {
            //console.log("accessed handle send msg", this.state.messagebody);
            this.setState({
                ajaxLoading: true,
                alertType: false,
                alertMsg: []
            });
            let currentUserId = this.state.currentLoggedUserId;
            let convId = this.state.convId;

            //this.getNewTargetUserId();
            let newTargetUserId = this.state.newTargetUserId;

            let postData = {
                sourceUser : {id : currentUserId },
                targetUser : {id : newTargetUserId },
                subject : "Regarding Room",
                content : this.state.messagebody
            }

            let url = baseMVacationApiUrl + '/message/' + convId;

            let onSuccessMethod = (data) => {
                //console.log("res1 :", data);
                this.onSendMsgSuccess(data);
            }

            let onFailMethod = (err) => {
                //console.log("res2", res);
                this.onSendMsgFail(err);
            }

            ajaxCall(url, "POST", postData, onSuccessMethod, onFailMethod);
        }
    }

    /**
     *Initial call
     *
     */
    componentDidMount() {

        if (userLoggedIn){
            this.getCurrentLoggedInUserId();
            this.getConversation();
        }

    }

    render(){
        const { t } = this.props;
        let messages = Object.assign([], this.state.messages);
        messages.reverse();
        let currentLoggedUserId = this.state.currentLoggedUserId;
        let newTargetUser = this.state.newTargetUser;
        let targetUserPicture = (this.state.targetUserPicId !==0) ? baseMVacationApiUrl +'/media/' + this.state.targetUserPicId +'/data?size=200x200' : baseCmsUrl + "/storage/app/media/default-images/avatar_2x.png";
        let currentUserPicture = (this.state.currentUserPicId !==0) ? baseMVacationApiUrl +'/media/' + this.state.currentUserPicId +'/data?size=200x200' : baseCmsUrl + "/storage/app/media/default-images/avatar_2x.png";

        if(userLoggedIn && this.state.convId !== 0 && this.state.convId !== 999999999){
            return(
            <div className="container">
                <div className="row">
                    <div className="center section-title"><h3>{t("Messages")}</h3> </div>
                    <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                        <div className="panel-body class personal-info">
                            <div className="media-personal">
                                <div className="avatar-md">
                                    <img className="img-responsive img-circle center  center-block" src={targetUserPicture} />
                                </div>
                                <div className="col-md-12">
                                    <h3 className="center">{newTargetUser.firstName} {newTargetUser.lastName}</h3>
                                    <h4 className="center"><small><i className="fa fa-map-marker" aria-hidden="true"></i>{(newTargetUser.profile && newTargetUser.profile.address && newTargetUser.profile.address.country)? newTargetUser.profile.address.country.name : ""} {(newTargetUser.profile && newTargetUser.profile.address) ? newTargetUser.profile.address.state : ""}</small></h4>
                                    <hr/>
                                </div>
                                <div class=" col-md-12 post-content">
                                    <div class="self-description mt-20">
                                        <center><i class="fa fa-user" aria-hidden="true"></i> </center>
                                    </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                    <label> <h3>{t("Check your inbox")}</h3></label>
                    <div className="divider"></div>
                    <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12" style={{"display" :this.state.alertStyle}}>
                        <Message errors={this.state.alertMsg} type={this.state.alertType}>
                        </Message>
                    </div>
                    <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 hidden-xs">
                        <form action="javascript:void(0);">
                        <div className="col-md-12">
                            <div className="form-group">
                                <textarea className="form-control input-lg" id="message-text" rows="5" placeholder="Test message ..." value = {this.state.messagebody} onChange={this.storeText.bind(this)} required>
                                </textarea>
                            </div>
                            <SubmitButton buttonClass="btn square-btn mt-20 mb-20" ajaxLoading={this.state.ajaxLoading} buttonText={t("Send")} onClick={this.handleSendMessage.bind(this)} {...this.props} />
                        </div>
                        </form>
                    </div>
                    <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 visible-xs">
                        <div className="panel-footer">
                            <form action="javascript:void(0);">
                            <div className="input-group no-deco">
                                <input id="btn-input" type="text" className="form-control input-lg no-deco" placeholder="Type your message here..." value = {this.state.messagebody} onChange={this.storeText.bind(this)} required />
                                <span className="input-group-btn">
                                    <SubmitButton buttonClass="btn btn-original btn-lg no-deco-2" ajaxLoading={this.state.ajaxLoading} buttonText="Send" onClick={this.handleSendMessage.bind(this)} {...this.props} />
                                </span>
                            </div>
                            </form>
                        </div>
                     </div>
                    <div className="col-md-12 col-sm-12 col-xs-12 ">
                        {(messages.length) ? messages.map((item, i) => {
                        return(
                        (item.sourceUser.id === currentLoggedUserId) ?
                        <div className="row message-box">
                            <div className="col-md-2 col-sm-2 col-xs-4">
                                <div className="testimonial-desc">
                                    <center>
                                        <img src={currentUserPicture} alt="" />
                                        <div className="name">{this.state.currentUserFirstName}</div>
                                    </center>

                                </div>
                            </div>
                            <div className="col-md-10 col-sm-10 col-xs-8">
                                <div id="tb-testimonial" className="arrow_box testimonial-default">
                                    <pre className="testimonial-section mt-20 message-content-box">
                                        {item.content}
                                    </pre>
                                    <h5 className="pull-right">  <i className="fa fa-clock-o" aria-hidden="true"></i>{item.date} </h5>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="row message-box right">
                            <div className="col-md-10 col-sm-10 col-xs-8">
                                <div id="tb-testimonial" className=" testimonial-default">
                                    <pre className="testimonial-section-right mt-20 message-content-box">
                                        {item.content}
                                    </pre>
                                    <h5>  <i className="fa fa-clock-o" aria-hidden="true"></i>  {item.date} </h5>
                                </div>
                            </div>
                            <div className="col-md-2 col-sm-2 col-xs-4">
                                <div className="testimonial-desc">
                                    <center>
                                        <img src={targetUserPicture} alt="" />
                                        <div className="name">{newTargetUser.firstName}</div>
                                    </center>
                                </div>
                            </div>
                        </div>
                        )})
                        :null
                        }
                    </div>
                </div>

            </div>
            )

        } else {
            return (
                <div className="container" style={{ "marginTop": "6em"}}>
                    <div className="alert alert-info alert-dismissable">
                        <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}} className="glyphicon glyphicon-remove-circle"></span>
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>{t("info")}!</strong> {t("this_page_is_available_only_for_authenticated_user")}.
                    </div>
                </div>
            )
        }
    }
}

export default TranslationWrapper(translate("Inbox")(InboxMessage));