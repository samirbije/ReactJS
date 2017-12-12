//external
import React, { Component } from "react";
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
import base64 from 'base-64';
import utf8 from 'utf8';
import Rating  from 'react-rating';


class UserAccommodation extends Component{

    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            accommodations: [],
            ajaxLoading: true,
            totalRecord: 0
        };
    }

    componentDidMount() {
        this.loadUserAccommodations();
    }

    loadUserAccommodations(){
        var self = this;

        var selectorJson = {
            ownerId: getProfileId()
        };

        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);
        var url = baseMVacationApiUrl + "/accomodation?offset=0&size=3&selector=" + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                accommodations: data.items,
                ajaxLoading: false,
                totalRecord: data.total
            });
            //console.log(response.data.items);
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
            self.setState({
                ajaxLoading: false
            });
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    render() {
        const { t } = this.props;

        let owner = true;
        let pId = getProfileId();

        if(parseInt(pId) > 0 && (parseInt(this.props.currentLoggedInUserId) != parseInt(pId))){
            owner  = false;
        }


        return (
            <div>
                { this.state.ajaxLoading == false ?
                    (
                        <div>
                            <h3><b>{t("Accommodations")}({this.state.totalRecord})</b></h3>
                            { owner == true  ?
                            <div className="space-30"><label className="pull-right"><a href={ baseCmsUrl + "/accommodation-list" }>{t("View More")}</a></label></div>
                                : null }
                        </div>
                    ) : null }

                <div className="row gutter-4">
                    { this.state.ajaxLoading == false ?
                        this.state.accommodations.length > 0 ?
                            this.state.accommodations.map((item, i) => {
                                let image = getFeaturedImage(item);
                                let aminity ="No wifi";
                                if( item.amenityList !=null && item.amenityList.length > 0 ) {
                                    for(var j = 0; j < item.amenityList.length; j++) {
                                        if (item.amenityList[j].id == 1) {
                                            aminity ="Wifi";
                                        }
                                    }
                                }
                                return (
                                <div key={i} className="col-xs-12 col-sm-6 col-md-6  col-lg-4 property-list-parent">
                                    <div className="property-single clearfix">
                                        <div className="property-photo">
                                            <div className="card-img-box">
                                                <img src={image} />
                                            </div>
                                            <div className="property-price-tag">
                                                { currencyCode  == "USD" ? "$" : "¥"}{item.displayPrice != null ? convertCurrency(zformat(item.displayPrice)) : 0.0} -
                                            </div>
                                        </div>
                                        <div className="property-title card-title">
                                            <a href={baseCmsUrl + "/accommodation/" + item.id}>  {item.name.length > 15 ? item.name.substr(0, 15) + "..." : item.name}</a>
                                        </div>
                                        <span className="location"><i className="icon-location-pin"></i>{item.address != null ? item.address.city : ""}.{item.address != null && item.address.country != null ? item.address.country.name : ""}</span>
                                        <div className="property-reviews">
                                            <div className="reviews-stars">
                                                <Rating
                                                    initialRate={item.accomodationRating != null ? zformat(item.accomodationRating.average) : 0}
                                                    empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                    full="fa fa-star"
                                                    fractions={10}
                                                    readonly
                                                />
                                            </div>
                                            <div className="reviews-number">
                                                {t("Review")} {item.accomodationRating != null ? item.accomodationRating.numReviews : 0}
                                            </div>
                                        </div>
                                        <div className="property-description">
                                            {(item.description != null && item.description.length > 60) ? (item.description).substring(0, 60)+"..." : item.description }
                                        </div>
                                        <ul className="property-tags clearfix">
                                            <li className="property-tags-single">{item.capacity} {t("People")}</li>
                                            <li className="property-tags-single">{item.propertyType != null ? item.propertyType.name : ""}</li>
                                            <li className="property-tags-single">{item.roomType}</li>
                                            <li className="property-tags-single">{aminity}</li>
                                        </ul>
                                    </div>
                                </div>
                                )
                            }) : (<div className="col-md-9 pull-left">
                                <div className="alert alert-info alert-dismissable">
                                    <strong>{t("Info")}!</strong> {t("Nothing in Accommodation list so far")}.
                                </div>
                            </div>): (<div className="col-md-9 pull-left ajax-loading" ></div>)
                    }
                </div>
            </div>
        )
    }
}
//export default UserAccommodation
export default TranslationWrapper(translate("UserAccommodation")(UserAccommodation))