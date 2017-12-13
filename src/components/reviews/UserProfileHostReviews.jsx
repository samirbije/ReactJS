
import React, { Component } from "react";


// internal
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";
import Rating  from 'react-rating';
import base64 from 'base-64';
import utf8 from 'utf8';
import LikeWidget from "../like/LikeWidget";
class UserProfileHostReviews extends Component {

    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            reviewHostTotal: 0,
            reservationHostLists: [],
            sizeHost: 2,
            reviewHostCurrentTotalShowing: 0,
            ajaxLoading: true
        };
    }

    componentDidMount() {
        // review
        this.loadReservationHostListFromServer();
    }



    loadReservationHostListFromServer(size = null, showAjaxBar = false){

        if(size == null){
            size = this.state.sizeHost;
        }

        var text = {
            "ownerId" : getProfileId(),
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;
        if (showAjaxBar == true) $("#ajax-loader-general").show();

        let url = baseMVacationApiUrl + '/reservation/guestreview?orderBy=id&offset=0&size=' + size  + '&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                reservationHostLists: data.items,
                reviewHostTotal: data.total,
                reviewHostCurrentTotalShowing: data.length,
                ajaxLoading: false
            })
            $("#ajax-loader-general").hide();
        }

        let onFailMethod = (err) => {
            //console.log(err.responseText);
            $("#ajax-loader-general").hide();
            self.setState({
                ajaxLoading: false
            })
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    seeGuestMore(){
        let size = this.state.reviewHostCurrentTotalShowing + this.state.sizeHost;
        this.loadReservationHostListFromServer(size, true);
    }

    render() {
        const { t } = this.props;
        if ( this.state.ajaxLoading == false) {
            return (
                <div>
                    {(this.state.reviewHostTotal > 0) ?
                    <div className="mb-30">
		                    <h3><b>{t("Guest review")} ({this.state.reviewHostTotal})</b></h3>
		                    <div className="row">
		                        { this.state.reservationHostLists.map((review, i) => {
		                            if (review.guestReview != null) {
		                                var totalReview = 0;
		                                var avgReview = 0;
		                                if (review.guestReview != null) {
		                                    totalReview = review.guestReview.accuracy + review.guestReview.communitaction + review.guestReview.cleanliness + review.guestReview.location + review.guestReview.checkin + review.guestReview.host;
		                                    avgReview = totalReview / 6;
		                                }
		                                var userAddressCity = "";
		                                var userAddressCountry = "";
		                                var accommodationAddressCity = "";
		                                var accommodationAddressCountry = "";
		                                var userProfilePictureId = "";

		                                if (review.user.profile != null) {
		                                    if (review.user.profile.picture != null && review.user.profile.picture.id != "") {
		                                        userProfilePictureId = review.user.profile.picture.id
		                                    }

		                                    if (review.user.profile.address != null) {
		                                        userAddressCity = review.user.profile.address.city;

		                                        if (review.user.profile.address.country != null) {
		                                            userAddressCountry = review.user.profile.address.country.name
		                                        }
		                                    }
		                                }

		                                if (review.accomodation.address != null) {
		                                    accommodationAddressCity = review.accomodation.address.city;

		                                    if (review.accomodation.address.country != null) {
		                                        accommodationAddressCountry = review.accomodation.address.country.name;
		                                    }
		                                }

		                                return (
		                                    <div key={i}>
		                                        <div className="row review">
		                                            <div
		                                                className="col-lg-3 col-md-3  col-sm-12  col-xs-12 avatar-sm center-block text-center">
		                                                <img
		                                                    src={userProfilePictureId != "" ? baseMVacationApiUrl + "/media/" + userProfilePictureId + "/data?size=100x100" : baseCmsUrl + "/storage/app/media/default-images/100x100.png"}
		                                                    className="img-responsive img-circle"/>
		                                                <h5 className="author-name"><a
		                                                    href={ baseCmsUrl + "/user-profile/" + review.user.id}> {review.user.firstName} {review.user.lastName}</a>
		                                                </h5>
		                                                <h5><i
		                                                    className="icon-location-pin"></i> {userAddressCity} {userAddressCountry}
		                                                </h5>
		                                            </div>
		                                            <div className="col-lg-9 col-md-9 col-sm-12  col-xs-12">
		                                                <h5><a
		                                                    href={ baseCmsUrl + "/accommodation/" + review.accomodation.id}><span
		                                                    className="glyphicon glyphicon-home"></span>{review.accomodation.name}
		                                                </a></h5>
		                                                <h5><i
		                                                    className="icon-location-pin"></i> {accommodationAddressCity} {accommodationAddressCountry}
		                                                </h5>
		                                                <div className="personal-sm">
		                                                    <Rating
		                                                        initialRate={avgReview}
		                                                        empty="fa fa-star-o" style={{color: '#ff6043'}}
		                                                        full="fa fa-star"
		                                                        fractions={2}
		                                                        readonly
		                                                    />
		                                                </div>
		                                                <div className="review-description">
		                                                    {review.guestReview != null && review.guestReview.comments != null ? review.guestReview.comments : ""}
		                                                </div>
		                                                <h5 className="update-date">{review.guestReview != null && review.guestReview.date != null ? review.guestReview.date : ""}</h5>
		                                                <LikeWidget translations={translations} info={{
		                                                    name: "guestreview",
		                                                    id: review.guestReview.id,
		                                                    nbOfLikes: review.guestReview.nbOfLikes,
		                                                    likedByCurrentUser: review.guestReview.likedByCurrentUser
		                                                }}/>
		                                            </div>
		                                        </div>
		                                        <div className="divider"></div>
		                                    </div>
		                                )
		                            }
		                        })
		                        }
		                        {
		                            this.state.reviewHostCurrentTotalShowing < this.state.reviewHostTotal ?
		                                <button type="button" onClick={this.seeGuestMore.bind(this)}
		                                        className="btn btn-warning pull-right"
		                                        style={{borderRadius: "0px"}}>{t("Show more")}</button>
		                                : null
		                        }
		                    </div>
                    </div>
                    : null}
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}
//export default UserAccommodation
export default TranslationWrapper(translate("UserProfileHostReviews")(UserProfileHostReviews))