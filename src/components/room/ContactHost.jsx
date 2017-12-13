//external
import React, { Component } from "react"
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";

//internal
import Message from "../common/Message";
import SubmitButton from "../common/SubmitButton";

class ContactHost extends Component {

    constructor(props) {
        super(props);
        const { t } = this.props;
        this.state = {
            ajaxLoading: false,
            message:"",
            alertType:false,
            alertType2: true,
            alertStyle:"none",
            alertStyle2:"none",
            alertMsg:[t("Message has been sent")],
            alertMsg2:[t("Failed to send the message")],
        }
    }

    componentDidMount() {

    }

    handleMsgBoxOpen(){
        //console.log("Msg Open:");
        if(Boolean(userLoggedIn)){
            this.setState({
                message: "",
                alertStyle: "none",
                alertStyle2: "none"
                });
            $('#msg-box').modal('show');
        } else {
            $("#loginModal").modal("show");
        }
    }

    handleSendMessage(e){
        if(this.state.message.trim() !== ""){
            //console.log("send message :", this.state.message);
            //console.log("room owner id :", this.props.accommOwnerId);
            //console.log("current user id :", this.props.currentUserId);
						this.setState({ajaxLoading: true});
            const self = this;
            let roomOwnerId = this.props.owner.id;
            let currentUserId = this.props.currentUserId;
            let accomodationId = this.props.accomodationId;

            let postData = {
                sourceUser : {id : currentUserId},
                targetUser : {id : roomOwnerId},
                subject : "Regarding Room",
                content : this.state.message
            }

            let url = baseMVacationApiUrl + '/message?' + 'accId=' + accomodationId;

            let onSuccessMethod = (data) => {
                //console.log("res1 :", res);
                self.setState({
                    alertStyle: "block",
                    message: "",
                    ajaxLoading: false
                });
                $('#msg-box').modal('hide');
            }

            let onFailMethod = (err) => {
                //console.log("res2", res);
                self.setState({
                    alertStyle2: "block",
                    ajaxLoading: false
                });
                console.log(err.responseText);
            }

            ajaxCall(url, "POST", postData, onSuccessMethod, onFailMethod);
        }
    }

    handleMsgCancel(){
        //console.log("handle cancel");
        this.setState({ message: "" });
    }

    storeText(e){
        this.setState({ message: e.target.value });
        //console.log("Text :", e.target.value);
    }

    render() {
				const { t } = this.props;

				let owner = this.props.owner;
		    return (
		        <div>
                <div className="col-md-4 nopadding-l-f mt-20">
                    <button type="button" data-toggle="modal" className="btn square-small-btn second" onClick={this.handleMsgBoxOpen.bind(this)}>{t("Contact Host")}</button>
                </div>
                <div className="col-xs-12 nopadding-l-f" id="msg-box-alert1" style={ { "display" :this.state.alertStyle}}>
                    <Message errors={this.state.alertMsg} type={this.state.alertType}>
                    </Message>
                </div>
                <div className="modal fade bs-example-modal-lg mt-100" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="msg-box">
                    <div className="modal-dialog modal-lg " role="document">
                        <div className="modal-content">
                            <form>
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h3 className="modal-title"><small>{t("Contact To")} <b>{owner.firstName} {owner.lastName}</b></small></h3>
                            </div>
                            <div id="msg-box-alert2" style={{ "display" :this.state.alertStyle2}}>
                                <Message errors={this.state.alertMsg2} type={this.state.alertType2}>
                                </Message>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <ul>
                                            <li><b>{t("What To Say to Host? For example")}</b></li>
                                            <li>・　{t("A little about yourself")}</li>
                                            <li>・　{t("What brings you to Barcelona? Who’s joining you")}</li>
                                            <li>・　{t("What do you love about this listing? Mention it")}</li>
                                        </ul>
                                    </div>
                                    <div className="col-md-12">
                                        <h4><small><b>{t("Message to Host")}</b></small></h4>
                                        <textarea placeholder={t( "Hello, This is")} rows="6" className="form-control no-deco" style={{"resize" : "none"}} value={ this.state.message} onChange={this.storeText.bind(this)}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <center>
                                    <div className="col-md-6">
                                        <button type="button" className="btn btn-default square-small-btn second" data-dismiss="modal" onClick={this.handleMsgCancel.bind(this)}>{t("Cancel")}</button>
                                    </div>
                                    <div className="col-md-6">
                                        <SubmitButton buttonClass="btn square-small-btn" ajaxLoading={this.state.ajaxLoading} buttonText="Send" onClick={this.handleSendMessage.bind(this)} {...this.props} />
                                    </div>
                                </center>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
		        </div>

		    );

    }
}

export default TranslationWrapper(translate("RoomDescription")(ContactHost));
