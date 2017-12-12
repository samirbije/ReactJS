//external
import React, { Component } from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";

//internal
import InboxContent from "./InboxContent";

class Inbox extends Component {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} child app className
         */
        this.state = {
            conversationList : [],
            offset: 0,
            perPage: 100,
            accommodation:{},
            currentLoggedUserId: 0
        }
    }

    /**
     *Initial call
     *
     */
    componentDidMount() {

        if (userLoggedIn){
            this.getCurrentLoggedInUserId();
            this.getUserConversations(this.state.offset);
        }

    }

    getCurrentLoggedInUserId(){
        var url = baseMVacationApiUrl + "/user/0";
        let self = this;

        let onSuccessMethod = (data) => {
            this.setState({
                currentLoggedUserId: data.id
            })
        }

        let onFailMethod = (err) => {
            console.log("error in getting current user");
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    getUserConversations(offset){
        //console.log("accessed get user conv");
        var self = this;
        var selectorJson = {
            userId: 0
        };

        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);
        var url = baseMVacationApiUrl + "/message/inbox?offset=" + offset + "&size=" + this.state.perPage + "&selector=" + encoded;

        let onSuccessMethod = (data) => {
            this.setState({
                conversationList: data.items
            })
        }

        let onFailMethod = (err) => {
            console.log("error in getting conv");
            console.log(err);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    render(){
        const { t } = this.props;
        let conversationList = this.state.conversationList;
        let currentLoggedUserId = this.state.currentLoggedUserId;
        let self = this;
        let travelMail = [];
        let hostMail = [];
        if (conversationList.length > 0) {
            conversationList.map((item, i) => {
                let accom = {};
                (item.accommodation) ? accom = item.accommodation : null;
                (accom.owner && accom.owner.id !== currentLoggedUserId) ? travelMail.push(item) : null;
                (accom.owner && accom.owner.id == currentLoggedUserId) ? hostMail.push(item) : null;
            });
        }

        if(userLoggedIn){
            return(
                 <div className="container">
                     <div className="center section-title"><h3>{t("Inbox")}</h3></div>
                     <ul className="nav nav-tabs user-profile-nav ">
                         <li className="active sliding-middle-out"><a href="#tab1" data-toggle="tab">{t("Travelling")}</a></li>
                         <li className="sliding-middle-out"><a href="#tab2" data-toggle="tab">{t("Hosting")}</a></li>
                     </ul>
                     <div className="tab-content row">
                         <div className="tab-pane fade in active" id="tab1">
                             <InboxContent items={travelMail} {...this.props}/>
                         </div>

                         <div className="tab-pane fade" id="tab2">
                            <InboxContent items={hostMail} {...this.props}/>
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
                        <strong>{t("Info")}!</strong> {t("This page is available only for authenticated user")}.
                    </div>
                </div>
            )
        }
    }
}

export default TranslationWrapper(translate("Inbox")(Inbox));