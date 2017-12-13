import React, { Component } from "react";
import base64 from 'base-64';
import utf8 from 'utf8';

// internal
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";
import Rating  from 'react-rating';

import LikeWidget from "../like/LikeWidget";

class AccomodationReviewComments extends Component {

    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            reviewGuestCommentsTotal: 0,
            reviewGuestComments:[],
            sizeComments: 1,
            reviewGuestCommentsCurrentTotal: 0,

        };
    }

    /**
     * id from URL params
     *
     */
    getUrlId() {
        var id = location.href.substr(location.href.lastIndexOf('/') + 1);
        return id;
    }

    loadReviewComments(size = null, showAjaxBar = false){
        if(size == null){
            size = this.state.sizeComments;
        }
        var text = {
            "accommodationId" : this.getUrlId()
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        //console.log(encoded);
        const self = this;
        if (showAjaxBar) $("#ajax-loader-general").show();

        let url = baseMVacationApiUrl + '/reservation/guestreview?orderBy=id&offset=0&size='+  size  +'&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                reviewGuestComments: data.items,
                reviewGuestCommentsTotal: data.total,
                reviewGuestCommentsCurrentTotal: data.length
            })
            $("#ajax-loader-general").hide();
        }

        let onFailMethod = (err) => {
            $("#ajax-loader-general").hide();
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *Initial call
     *
     */
    componentDidMount() {
        this.loadReviewComments();
    }


    seeGuestCommentsMore(){
        let size = this.state.reviewGuestCommentsCurrentTotal + this.state.sizeComments;
        this.loadReviewComments(size, true);
    }

    render() {
        const { t } = this.props;
        //
        return (
        <div>
            {this.state.reviewGuestComments.map((text, i) => {
                    if(text.guestReview!=null) {
                    const totalReview =  text.guestReview.accuracy + text.guestReview.communitaction + text.guestReview.cleanliness+ text.guestReview.location + text.guestReview.checkin +text.guestReview.host;
                    const avgReview = totalReview/6;
                    return (
                        <div className="row review">
                            <div className="col-lg-3 col-md-3  col-sm-12  col-xs-12 avatar-sm center-block text-center">
                                <img src={ text.user.profile ? baseMVacationApiUrl +'/media/' + text.user.profile.picture.id +'/data?size=100x100': baseCmsUrl + "/storage/app/media/default-images/avatar_2x.png"} width={100} height={100}   className="img-responsive img-circle" />
                                    <h5 className="author-name">{text.user.firstName} {text.user.lastName}</h5>
                                    <h5><i className="icon-location-pin"></i> { text.user.profile && text.user.profile.address && text.user.profile.address.country && text.user.profile.address.country.name != null ? text.user.profile.address.country.name : ''} { text.user.profile ? text.user.profile.address.city: ''}</h5>

                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12  col-xs-12">
                                <div className="personal-sm ">
                                    <div className="col-md-3  star nopadding">
                                        <Rating
                                            initialRate={avgReview}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="review-description col-md-9">
                                {text.guestReview ? text.guestReview.comments : ''}
                                <div className="update-date">{text.guestReview ? moment(text.guestReview.date).format('YYYY-MM-DD') : ''}</div>
                                <div className="col-md-3 icon-wrapper">
                                    <LikeWidget translations={translations} info={{name: "guestreview", id: text.guestReview.id,nbOfLikes:text.guestReview.nbOfLikes ,likedByCurrentUser: text.guestReview.likedByCurrentUser}} />
                                </div>
                            </div>
                        </div>
                    )
                }
            })
            }
            <div className="accordion-group col-md-12 review" style={{borderBottom: "none"}}>
                <div className="accordion-heading mt-40">
                    {
                        this.state.reviewGuestCommentsCurrentTotal < this.state.reviewGuestCommentsTotal ?
                            <span  className="btn btn-warning pull-right" data-toggle="collapse" data-parent="#faq" href="#faqpost_1"  onClick={this.seeGuestCommentsMore.bind(this)} style={{borderRadius: "0px"}}> {t("View more")}</span>
                            : null
                    }
                </div>
            </div>
        </div>
        )
    }
}
//export default UserAccommodation
export default TranslationWrapper(translate("AccomodationReviewComments")(AccomodationReviewComments))