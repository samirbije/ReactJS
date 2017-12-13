//external
import React, { Component } from "react"
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"
import Rating  from 'react-rating';

// internal
import FavouriteWidget from "../favourites/FavouriteWidget";

class PopularAccommodationContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accommodations: []
        }
    }

    render() {
        const {t} = this.props;
        let items = []
        items = this.props.items;

        return (
            <div>
                {
                    items.map((item, i) => {
                        let image = getFeaturedImage(item);
                        let address = {};
                        (item.address) ? address = item.address : null;
                        address = item.address != null ? item.address : null;

                        let propertyType = {};
                        (item.propertyType) ? propertyType = item.propertyType : null;
                        //console.log("country" + address.country);
                        //console.log("bool value is:" + address.country !== null );
                        let accomodationRating = {};
                        (item.accomodationRating) ? accomodationRating = item.accomodationRating : null;
                        let favAccommodation = {
                            accommodationId: item.id,
                            accommodationName: item.name,
                            accommodationLocation: address.city +  "." + ((address.country) ? address.country.name : ""),
                            accommodationImage: image,
                            accommodationImageId: item.featuredPicture.id,
                        };
                        let aminity ="No wifi";
                        if( item.amenityList !=null && item.amenityList.length > 0 ) {
                            for(var j = 0; j < item.amenityList.length; j++) {
                                if (item.amenityList[j].id == 1) {
                                    aminity ="Wifi";
                                }
                            }
                        }
                        return (
                                <div className="col-xs-12 col-sm-6 col-md-6  col-lg-3 property-list-parent">
                                    <div className="property-single clearfix">
                                        <div className="property-photo">
                                            <div className="card-img-box">
                                                <img src={image} />
                                            </div>
                                            <div className="property-price-tag">
                                                {zformat(item.displayPrice)} -
                                            </div>
                                            <div className="col-sm-3 pull-right">
                                                { userLoggedIn == true ?
                                                    <FavouriteWidget accommodation = {favAccommodation} {...this.props}/>
                                                    : null
                                                }
                                            </div>
                                        </div>
                                        <div className="property-title card-title">
                                            <a href={baseCmsUrl + "/accommodation/" + favAccommodation.accommodationId}>  {item.name.length > 15 ? item.name.substr(0, 15) + "..." : item.name}</a>
                                        </div>
                                        <span className="location"><i className="icon-location-pin"></i>{favAccommodation.accommodationLocation}</span>
                                        <div className="property-reviews">
                                            <div className="reviews-stars">
                                                <Rating
                                                    initialRate= {accomodationRating.average > 0 ? zformat(accomodationRating.average): 0 }
                                                    empty = "fa fa-star-o" style={{color:'#ff6043'}}
                                                    full = "fa fa-star"
                                                    fractions = {2}
                                                    readonly
                                                />
                                            </div>
                                            <div className="reviews-number">
                                                {t("Review")}&nbsp;{(accomodationRating.numReviews) ? accomodationRating.numReviews : 0 }
                                            </div>
                                        </div>
                                        <div className="property-description">
                                            {(item.description != null && item.description.length > 60) ? (item.description).substring(0, 60)+"..." : item.description }
                                        </div>
                                        <ul className="property-tags clearfix">
                                            <li className="property-tags-single">{item.capacity}&nbsp;{t("People")}</li>
                                            <li className="property-tags-single">{propertyType.name}</li>
                                            <li className="property-tags-single">{item.roomType}</li>
                                            <li className="property-tags-single">{aminity} </li>
                                        </ul>
                                    </div>
                                </div>
                            )
                    })
                }
            </div>
        )
    }
}

export default TranslationWrapper(translate("PopularAccommodation")(PopularAccommodationContent));
