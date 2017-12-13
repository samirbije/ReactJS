import React, { Component } from "react";


// internal
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";
import Rating  from 'react-rating';


class TopPageReview extends Component {

    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            //reviewTopPage: [{'name':'33'},{'name':'33'},{'name':'33'},{'name':'33'}]
            reviewTopPage: []
        };
    }



    loadReviewTopPage(){
        const self = this;

        let url = baseMVacationApiUrl + '/reservation?orderBy=guestreview_likes&offset=0&size=4';

        let onSuccessMethod = (data) => {
            self.setState({
                reviewTopPage: data.items,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *Initial call
     *
     */
    componentDidMount() {
        this.loadReviewTopPage();
    }


    render() {
        const { t } = this.props;
        return (
        <div>
              {this.state.reviewTopPage.map((text, i) => {
                    return (
                        <div className="col-xs-12 col-sm-6 col-md-6  col-lg-3 ">
                            <div className="property-single-review clearfix">
                                <div className="property-photo">
                                    <a href={baseCmsUrl + "/accommodation/" + text.accomodation.id}><img src={ text.accomodation.featuredPicture && text.accomodation.featuredPicture.id ? baseMVacationApiUrl + "/media/" +  text.accomodation.featuredPicture.id  + "/data?size=300x300" :  baseCmsUrl + "/storage/app/media/text.png"}/></a>
                                </div>
                                <div className="property-title">
                                    <b> <a href={baseCmsUrl + "/accommodation/" + text.accomodation.id}>{text.accomodation.name}</a></b>
                                </div>
                                <div className="property-reviews">
                                    <div className="reviews-stars center">
                                        <Rating
                                            initialRate= {text.accomodation.accomodationRating ? text.accomodation.accomodationRating.average :0}
                                            empty = "fa fa-star-o" style={{color:'#ff6043'}}
                                            full = "fa fa-star"
                                            fractions = {2}
                                            readonly
                                        />
                                    </div>
                                    <div className="reviews-number">
                                        {t("Review")}&nbsp;{text.accomodation.accomodationRating ? text.accomodation.accomodationRating.numReviews : 0 }&nbsp;{t("Stars")}
                                    </div>
                                </div>
                                <div className="property-description">
                                    {text.guestReview && text.guestReview.comments != null && text.guestReview.comments.length > 100 ? text.guestReview.comments.substr(0, 100) + "..." : text.guestReview ? text.guestReview.comments : ''}
                                </div>
                            </div>
                        </div>
                    )
            })
            }
        </div>
        )
    }
}
//export default UserAccommodation
export default TranslationWrapper(translate("TopPageReview")(TopPageReview))