//external
import React, { Component } from "react"
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';

// internal
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"



class InboxMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inbox: [],
            perPage:100,
            offset:0
        }

    }


    componentWillMount() {
        this.getInbox();
    }
/*
    componentDidMount() {
        this.getItineraries();
    }
*/

    getInbox(){
        var selectorJson = {
            "userId": 0,
            "unread":true
        };
        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);

        var url = baseMVacationApiUrl + "/message/inbox?offset=" + this.state.offset + "&size=" + this.state.perPage + "&selector=" + encoded;
        var self = this;

        let onSuccessMethod = (data) => {
            self.setState({
                inbox: data.items
            });
        }

        let onFailMethod = (err) => {
            console.log("error in getting inbox");
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    render() {
        const {t} = this.props;

        return (
            <div className="my-inbox-container">
                <div className="item-title" style={{"borderBottom": "none"}}>
                    <a className="nohover" href={ baseCmsUrl + "/inbox" }><h5>{t("Inbox")} ({(this.state.inbox.length)})<span className="pull-right"> {t("Mails")}</span></h5></a>
                    <div className="divider"/>
                </div>
            </div>
        )

    }
}

export default TranslationWrapper(translate("InboxMenu")(InboxMenu));
