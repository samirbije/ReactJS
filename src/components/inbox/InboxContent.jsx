//external
import React, { Component } from "react"
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';

// internal
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"



class InboxContent extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        const { t } = this.props;
        let mailList = [];
        let unreadList = [];
        mailList = this.props.items;

        mailList.map((itm, idx) => {
            (itm.unread) ? unreadList.push(mailList.splice(idx,1)[0]) : null;
        });
        mailList = unreadList.concat(mailList);
        //console.log("mailList", mailList);
        return (
            <div>
            {(mailList.length > 0) ? mailList.map( (item, i) => {
             let accommodation = {};
             (item.accommodation) ? accommodation = item.accommodation : null;
             let reservation = {};
             (item.reservation) ? reservation = item.reservation : null;

             var bytes = utf8.encode(JSON.stringify(item.id));
             var encoded = base64.encode(bytes);
             var media = (item.pictureId) ? baseMVacationApiUrl +'/media/' + item.pictureId +'/data?size=100x100' : baseCmsUrl + "/storage/app/media/default-images/avatar_2x.png";

             return(
             <div className="tab-content">
                 <div className="tab-pane active" id="1a">
                     <div className="col-md-12">
                         <div className="mt-30"> </div>

                         <div className="row review">
                             <div className="col-lg-3 col-md-3  col-sm-12  col-xs-12 avatar-sm center-block text-center">
                                 <a href={ baseCmsUrl + "/user-profile/" + item.userId} className="nohover"><img src={media}  className="img-responsive img-circle"/></a>
                             </div>
                             <a href={ baseCmsUrl + "/inbox-msg/" + encoded} className="nohover">
                             <div className="col-lg-9 col-md-9 col-sm-12  col-xs-12">
                                 <h4 className="author-name">{item.userName}</h4>
                                 <h5><i className="icon-location-pin"></i> {(accommodation.address && accommodation.address.country) ? accommodation.address.country.name : ""} {(accommodation.address) ? accommodation.address.state : ""}</h5>
                                 <div className="review-description">
                                    {(item.unread) ? <b>{item.messageExtract}</b> : item.messageExtract}
                                 </div>
                                 <h5 className="update-date">{item.date}</h5>
                                 <h4  className=" status accept"> {(reservation.status) ? reservation.status : ""} </h4>
                                 {/*<ul className="pull-right">
                                     <i className=" star fa fa-star fa-star-o" aria-hidden="true"></i>
                                     <i className=" Archive glyphicon glyphicon-bookmark"></i>
                                 </ul>*/}
                             </div>
                             </a>
                         </div>
                         <div className="divider"></div>
                     </div>

                 </div>
             </div>
             )})
             :
             <div className="tab-content">
                <h5> {t("No message in the Inbox")}</h5>
             </div>
             }
            </div>
        )
    }
}

export default TranslationWrapper(translate("Inbox")(InboxContent));
