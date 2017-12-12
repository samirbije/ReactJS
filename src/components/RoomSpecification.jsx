//external
import React, { Component } from 'react'
import base64 from 'base-64';
import utf8 from 'utf8';
var Slider = require('react-slick');
import Rating from   'react-rating';
// internal
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";

// internal


class SampleNextArrow extends React.Component{
    render() {
        const { currentSlide, slideCount, ...filteredProps } = this.props;
        return (
            <a {...filteredProps} data-slide="prev" href="javascript:void(0)" className="right carousel-control" style={{display: 'block'}} ><i className="fa fa-caret-right fa-2x" aria-hidden="true"></i></a>
        );
    }
}

class SamplePrevArrow extends React.Component{
    render() {
        const { currentSlide, slideCount, ...filteredProps } = this.props;
        return (
            <a {...filteredProps} data-slide="next" href="javascript:void(0)"  className="left carousel-control" style={{display: 'block'}}><i className="fa fa-caret-left fa-2x" aria-hidden="true"></i></a>
        );
    }
}


class RoomSpecification  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            propertyLists:[],
        }
    }



    getSimilarAccommodationResult(){
        var searchParum =
            {
                "id":null,
                "minReview":null,
                "maxReview":null,
                "minPrice":null,
                "maxPrice":null,
                "amenity":null,
                "propertyType":null,
                "ownerId":null,
                "nbedrooms":null,
                "nbathrooms":null,
                "name":null,
                "roomType":null,
                "longitude":this.props.longitude,
                "latitude":this.props.latitude,
                "capacity":null,
                "begin":null,
                "end":null
            };

        var bytes = utf8.encode(JSON.stringify(searchParum));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation?orderBy=id&offset=0&size=30&selector='+encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                propertyLists: data.items,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    componentDidMount() {
        this.getSimilarAccommodationResult();
    }
    /**
     * id from URL params
     *
     */
    getUrlId() {
        var id = location.href.substr(location.href.lastIndexOf('/') + 1);
        return id;
    }

    render() {
        var {t} = this.props;
        var settings = {
            dots: false,
            arrows: this.state.propertyLists.length > 3 ? true : false,
            infinite: false,
            speed: 500,
            slidesToShow: this.state.propertyLists.length < 3 ? this.state.propertyLists.length : 3,
            slidesToScroll:  this.state.propertyLists.length < 3 ? this.state.propertyLists.length : 3,
            initialSlide: 0,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }],
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />
        };
        let listAccommoShow = [];
        if( this.state.propertyLists.length > 1 ) {
            for(var i = 0; i <  this.state.propertyLists.length; i++) {
                if (this.state.propertyLists[i].id != this.getUrlId()){
                    let aminity = t("No wifi");
                    if( this.state.propertyLists[i].amenityList !=null && this.state.propertyLists[i].amenityList.length > 0 ) {
                        for(var j = 0; j < this.state.propertyLists[i].amenityList.length; j++) {
                            if (this.state.propertyLists[i].amenityList[j].id == 1) {
                                aminity ="Wifi";
                            }
                        }
                    }
                    listAccommoShow.push(
                        <div className="col-xs-12 col-sm-6 col-md-6  col-lg-4 property-list-parent">
                            <div className="property-single clearfix">
                                <div className="property-photo">
                                    <div className="card-img-box">
                                        <a href={baseCmsUrl + "/accommodation/" + this.state.propertyLists[i].id}><img src={this.state.propertyLists[i].featuredPicture ? baseMVacationApiUrl + "/media/" +  this.state.propertyLists[i].featuredPicture.id  + "/data?size=220x250" : baseCmsUrl + "/storage/app/media/text.png"} /></a>
                                    </div>
                                    <div className="property-price-tag">
                                        { currencyCode  == "USD" ? "$" : "¥"}{this.state.propertyLists[i].displayPrice != null ? convertCurrency(this.state.propertyLists[i].displayPrice) : 0.0} -
                                    </div>
                                </div>
                                <div className="property-title card-title">
                                    <a href={baseCmsUrl + "/accommodation/" + this.state.propertyLists[i].id}>  {this.state.propertyLists[i].name.length > 15 ? this.state.propertyLists[i].name.substr(0, 15) + "..." : this.state.propertyLists[i].name}</a>
                                </div>
                                <span className="location"><i className="icon-location-pin"></i>{this.state.propertyLists[i].address != null ? this.state.propertyLists[i].address.city : ""}.{this.state.propertyLists[i].address != null && this.state.propertyLists[i].address.country != null ? this.state.propertyLists[i].address.country.name : ""}</span>
                                <div className="property-reviews">
                                    <div className="reviews-stars">
                                        <Rating
                                            initialRate={this.state.propertyLists[i].accomodationRating != null ? zformat(this.state.propertyLists[i].accomodationRating.average) : 0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={10}
                                            readonly
                                        />
                                    </div>
                                    <div className="reviews-number">
                                        {t("Review")} {this.state.propertyLists[i].accomodationRating != null ? this.state.propertyLists[i].accomodationRating.numReviews : 0}&nbsp;{t("Stars")}
                                    </div>
                                </div>
                                <div className="property-description">
                                    {(this.state.propertyLists[i].description != null && this.state.propertyLists[i].description.length > 60) ? (this.state.propertyLists[i].description).substring(0, 60)+"..." : this.state.propertyLists[i].description }
                                </div>
                                <ul className="property-tags clearfix">
                                    <li className="property-tags-single">{this.state.propertyLists[i].capacity}&nbsp;{t("People")}</li>
                                    <li className="property-tags-single">{this.state.propertyLists[i].propertyType != null ? this.state.propertyLists[i].propertyType.name : ""}</li>
                                    <li className="property-tags-single">{this.state.propertyLists[i].roomType}</li>
                                    <li className="property-tags-single">{aminity}</li>
                                </ul>
                            </div>
                        </div>
                    );
                }
            }
        }
        else listAccommoShow.push(<div></div>);
        return (
            <div className="col-xs-12">
                    <div className="col-sm-3" alt="accomodation-type"><h4><strong>{t("Similar Listing")}</strong></h4> </div>
                <div className="popular-cities mb-100">
                    <div className="row" style={{'clear':'both'}}>
                        <Slider {...settings} className="room-register">
                            {listAccommoShow}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}
//export default RoomSpecification;
export default TranslationWrapper(translate("RoomSpecification")(RoomSpecification));