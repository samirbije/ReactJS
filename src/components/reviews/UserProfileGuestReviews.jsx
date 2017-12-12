
import React, { Component } from "react";


// internal
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";
import Rating  from 'react-rating';
import base64 from 'base-64';
import utf8 from 'utf8';
import LikeWidget from "../like/LikeWidget";
class UserProfileGuestReviews extends Component {

    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            reviewGuestTotal: 0,
            reservationGuestLists: [],
            sizeGuest: 2,
            reviewGuestCurrentTotalShowing: 0,
            ajaxLoading: true
        };
    }

    componentDidMount() {
        // review
        this.loadReservationListFromServer();
    }



    loadReservationListFromServer(size = null, showAjaxBar = false){
        if(size == null){
            size = this.state.sizeGuest;
        }
        var text = {
            "userId" : getProfileId(),
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;
        if (showAjaxBar) $("#ajax-loader-general").show();

        let url = baseMVacationApiUrl + '/reservation/hostreview?orderBy=id&offset=0&size='+  size  +'&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                reservationGuestLists: data.items,
                reviewGuestTotal: data.total,
                reviewGuestCurrentTotalShowing: data.length,
                ajaxLoading: false
            })
            $("#ajax-loader-general").hide();
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
            $("#ajax-loader-general").hide();
            self.setState({
                ajaxLoading: false
            })
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    seeHostMore(){
        let size = this.state.reviewGuestCurrentTotalShowing + this.state.sizeGuest;
        this.loadReservationListFromServer(size, true);
    }

    render() {
        const { t } = this.props;
        //
        if ( this.state.ajaxLoading == false){
            return (
                <div>

                    {(this.state.reviewGuestTotal > 0) ?
		                    <div className="mb-30">
				                    <h3><b>{t("Host Review")}({this.state.reviewGuestTotal})</b></h3>
				                    <div className="row">
				                        {this.state.reservationGuestLists.map((item, i) => {
				                            if (item.hostReview != null) {
				                                var ownerProfilePictureId = "";
				                                var ownerCity = "";
				                                var ownerCountry = "";
				                                var accommodationAddressCity = "";
				                                var accommodationAddressCountry = "";

				                                if (item.accomodation.owner.profile != null) {
				                                    if (item.accomodation.owner.profile.picture != null && item.accomodation.owner.profile.picture.id != "") {
				                                        ownerProfilePictureId = item.accomodation.owner.profile.picture.id;
				                                    }
				                                }

				                                if (item.accomodation.owner.profile != null && item.accomodation.owner.profile.address != null) {
				                                    ownerCity = item.accomodation.owner.profile.address.city;
				                                    if (item.accomodation.owner.profile.address.country != null) {
				                                        ownerCountry = item.accomodation.owner.profile.address.country.name
				                                    }
				                                }
				                                if (item.accomodation.address != null) {
				                                    accommodationAddressCity = item.accomodation.address.city;

				                                    if (item.accomodation.address.country != null) {
				                                        accommodationAddressCountry = item.accomodation.address.country.name;
				                                    }
				                                }

				                                let hostReview = {};
				                                (item.hostReview) ? hostReview = item.hostReview : null;
				                                return (
				                                    <div key={i}>
				                                        <div className="row review">
				                                            <div
				                                                className="col-lg-3 col-md-3  col-sm-12  col-xs-12 avatar-sm center-block text-center">
				                                                <img
				                                                    src={ownerProfilePictureId != "" ? baseMVacationApiUrl + "/media/" + ownerProfilePictureId + "/data?size=100x100" : baseCmsUrl + "/storage/app/media/default-images/100x100.png"}
				                                                    className="img-responsive img-circle"/>
				                                                <h5 className="author-name"><a
				                                                    href={ baseCmsUrl + "/user-profile/" + item.accomodation.owner.id}> { item.accomodation.owner.firstName } { item.accomodation.owner.lastName }</a>
				                                                </h5>
				                                                <h5><i className="icon-location-pin"></i> {ownerCity} {ownerCountry}
				                                                </h5>
				                                            </div>
				                                            <div className="col-lg-9 col-md-9 col-sm-12  col-xs-12">
				                                                <h5><a
				                                                    href={ baseCmsUrl + "/accommodation/" + item.accomodation.id}><span
				                                                    className="glyphicon glyphicon-home"></span>{item.accomodation.name}
				                                                </a></h5>
				                                                <h5><i
				                                                    className="icon-location-pin"></i> {accommodationAddressCity} {accommodationAddressCountry}
				                                                </h5>
				                                                <div className="personal-sm">
				                                                    <Rating
				                                                        initialRate={hostReview.rating != null ? hostReview.rating : 0}
				                                                        empty="fa fa-star-o" style={{color: '#ff6043'}}
				                                                        full="fa fa-star"
				                                                        fractions={2}
				                                                        readonly
				                                                    />
				                                                </div>
				                                                <div className="review-description">
				                                                    {hostReview.text != null ? hostReview.text : ""}
				                                                </div>
				                                                <h5 className="update-date">{hostReview.date != null ? hostReview.date : ""}</h5>
				                                                {item.hostReview ? <LikeWidget
				                                                        translations={translations}
				                                                        info={{
				                                                            name: "hostreview",
				                                                            id: hostReview.id,
				                                                            nbOfLikes: hostReview.nbOfLikes,
				                                                            likedByCurrentUser: hostReview.likedByCurrentUser

				                                                        }}/> : null}
				                                            </div>
				                                        </div>
				                                        <div className="divider"></div>
				                                    </div>
				                                )
				                            }
				                            })
				                        }
				                        {
				                            this.state.reviewGuestCurrentTotalShowing < this.state.reviewGuestTotal ?
				                                <button type="button" onClick={this.seeHostMore.bind(this)} className="btn btn-warning pull-right" style={{borderRadius: "0px"}}>{t("Show more")}</button>
				                                : null
				                        }

				                    </div>
		                    </div>
                    :null}
                </div>
            )
        } else {
            return (<div></div>)
        }

    }
}
//export default UserAccommodation
export default TranslationWrapper(translate("UserProfileGuestReviews")(UserProfileGuestReviews))