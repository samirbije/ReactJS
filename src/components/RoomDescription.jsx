//external
import React, { Component } from 'react'
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
var Rating = require('react-rating');
import base64 from 'base-64';
import utf8 from 'utf8';

// internal
import AccomodationReviewComments from "./reviews/AccomodationReviewComments";
import Message from './common/Message';
import ContactHost from './room/ContactHost';


class RoomDescription  extends Component {

    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} child app class
         */
        //const { t } = this.props;
        this.state = {
            reviewGuestComments:[],
            accomodationId: ""
        }
    }
    /**
     * id from URL params
     *
     */
    getUrlId() {
        var id = location.href.substr(location.href.lastIndexOf('/') + 1);
        return id;
    }

    loadReviewComments(){
        this.state.accomodationId = this.getUrlId();
        var text = {
            "accomodationId" : this.state.accomodationId
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        //console.log(encoded);
        const self = this;

        let url = baseMVacationApiUrl + '/reservation?orderBy=id&offset=0&size=-1&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                reviewGuestComments: data.items
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
        this.loadReviewComments();
    }


    render() {
        const { t } = this.props;
        // aminity
        let listSiteShow = [];
        if( this.props.aminities.length>0 ) {
            for(var i = 0; i<this.props.aminities.length; i++){
                listSiteShow.push(
                    <li alt="amenity-1">{this.props.aminities[i].name}</li>
                );
            }
        }
        else listSiteShow.push( <li alt="amenity-1"></li>);
        // rule
        var  rules = '';
        if(this.props && this.props.rules){
             rules = <ul>
                <li alt="pet">{t("Pet")}{this.props.rules.isPetsAllowed?'OK':'NG'}</li>
                <li alt="smokinig">{t("Smoking")}{this.props.rules.isSmokingAllowed?'OK':'NG'}</li>
                 {/*<li alt="party">{t("party")}{this.props.rules.isPartyAllowed?'OK':'NG'}</li>*/}
                 <li alt="infant">{t("Infant")}{this.props.rules.isInfantsAllowed?'OK':'NG'}</li>
                <li alt="Free-word">※{t("Check-in must be between")} {this.props.rules.checkInTime} - {this.props.rules.checkOutTime} </li>
            </ul>
        } else{
            rules = ( <ul></ul>);
        }
        //console.log(this.props.selectedCancellationPolicyDetails);
        // Review
        var accomodationRating = '';
        if(this.props && this.props.accomodationRating){
            accomodationRating =
               <div className="total-review mb-40" alt="total-review">
                    <div className="total-review">
                        <div className="title col-md-8  col-xs-12">
                            <span>{t("Average Review")} ( {this.props.accomodationRating.numReviews} )</span>
                            <br className="visible-xs" />
                            <span className="main-color mt-20">&nbsp;
                            <Rating
                                initialRate={this.props.accomodationRating.average}
                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                full="fa fa-star"
                                fractions={2}
                                readonly
                            />
                            </span>
                        </div>
                        <div className="col-md-4 col-xs-12 col-sm-12 pull-right">
                            {/*<form action="search-result" method="get" role="form" id="locationField" onsubmit ="ActiveXObject()">
                                <input id="btn-input" type="text" className="form-control" placeholder="Keyword Search" />
                            </form>*/}
                        </div>
                    </div>
                    <div className="space-50"></div>
                    <div className="col-md-12 col-xs-12 mt-30" style={{background:'transparent !important'}}>

                        <div className="table-responsive"  style={{border:'none'}}>
                            <table className="table">
                                <tbody className="hidden-xs" style={{backgroundColor:'transparent !important'}}>
                                <tr>
                                    <th className="list-review-rate">{t("Accuracy")}</th>
                                    <td nowrap>
                                        <Rating
                                            initialRate={this.props.accomodationRating.accuracy}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                    <th>{t("Communication")}</th>
                                    <td nowrap>
                                        <Rating
                                            initialRate={this.props.accomodationRating.communitaction}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Cleanliness")}</th>
                                    <td nowrap>
                                        <Rating
                                            initialRate={this.props.accomodationRating.cleanliness}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                    <th>{t("Location")}</th>
                                    <td nowrap>
                                        <Rating
                                            initialRate={this.props.accomodationRating.location}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Checkin")}</th>
                                    <td nowrap>
                                        <Rating
                                            initialRate={this.props.accomodationRating.checkin}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                    <th>{t("Host")}</th>
                                    <td nowrap>
                                        <Rating
                                            initialRate={this.props.accomodationRating.host}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                </tbody>
                                <tbody className="visible-xs" style={{border: 'none'}}>
                                <tr>
                                    <th className="list-review-rate"> {t("Accuracy")} </th>
                                    <td>
                                        <Rating
                                            initialRate={this.props.accomodationRating.accuracy}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Communication")} </th>
                                    <td>
                                        <Rating
                                            initialRate={this.props.accomodationRating.communitaction}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Cleanliness")} </th>
                                    <td>
                                        <Rating
                                            initialRate={this.props.accomodationRating.cleanliness}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Location")} </th>
                                    <td>
                                        <Rating
                                            initialRate={this.props.accomodationRating.location}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Checkin")} </th>
                                    <td>
                                        <Rating
                                            initialRate={this.props.accomodationRating.checkin}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Host")} </th>
                                    <td>
                                        <Rating
                                            initialRate={this.props.accomodationRating.host}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        } else {
            accomodationRating =
                <div className="total-review mb-40" alt="total-review">
                    <div className="total-review">
                        <div className="title col-md-8 col-xs-12">
                            <span>{t("Average Review")} ( 0 件)</span>
                            <br className="visible-xs" />
                            <span className="main-color mt-20">&nbsp;
                            <Rating
                                initialRate={0}
                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                full="fa fa-star"
                                fractions={2}
                                readonly
                            />
                            </span>
                        </div>
                    </div>
                    <div className="space-50"></div>
                    <div className="col-md-12 col-xs-12 mt-30">
                        <div className="table-responsive" style={{border:'none'}}>
                            <table className="table">
                                <tbody className="hidden-xs">
                                <tr>
                                    <th className="list-review-rate"> {t("Accuracy")} </th>
                                    <td >
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                    <th>{t("Communication")}</th>
                                    <td >
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Cleanliness")}</th>
                                    <td >
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                    <th>{t("Location")}</th>
                                    <td >
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>{t("Checkin")}</th>
                                    <td >
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                    <th>{t("Host")}</th>
                                    <td >
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                </tbody>
                                <tbody className="visible-xs" style={{border: 'none'}}>
                                <tr>
                                    <th className="list-review-rate"> {t("Accuracy")} </th>
                                    <td>
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Communication")} </th>
                                    <td>
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Cleanliness")} </th>
                                    <td>
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Location")} </th>
                                    <td>
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Checkin")} </th>
                                    <td>
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="list-review-rate"> {t("Host")} </th>
                                    <td>
                                        <Rating
                                            initialRate={0}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        }
        let owner = {};
        (this.props.owner) ? owner = this.props.owner :null;
        return (
        <div>
            <div className="row">
                <div className="col-sm-3">
                    <h4><strong>{t("Description")}</strong></h4></div>
                <div className="col-lg-6 col-md-6  col-sm-12  col-xs-12">
                    <p className="accomodation-description float-left ">
                        <pre className="testimonial-section mt-20 message-content-box" style={{border: "none", background: "none", fontFamily: "inherit", paddingLeft: "0px", lineHeight: "inherit"}}>{this.props.description}</pre>
                    </p>
                </div>
            </div>
            <div className="divider hidden-xs  hidden-sm hidden-md "></div>
            <div className="divider hidden-lg"></div>
            <div className="row line">
                <div className="col-sm-3" alt="accomodation-type">
                    <h4><strong>{t("Property")}</strong></h4></div>
                <div className="col-sm-9">
                    <p className="accomodation-description">
                        <ul>
                            <li alt="capacity">{t("Capacity")} {this.props.capacity} {t("People")}</li>
                            <li alt="accomodation-type">{this.props.roomType}</li>
                            <li alt="room-type">{this.props.propertyType}</li>
                            <li alt="bed-room-numbers">{t("Number Of Beds")} {this.props.bedNo}  </li>
                            <li alt="bathroom-numbers">{t("Bath Rooms")} {this.props.bathRooms} </li>
                        </ul>
                    </p>
                </div>
            </div>
            <div className="divider hidden-xs  hidden-sm hidden-md "></div>
            <div className="divider hidden-lg"></div>
            <div className="row line">
                <div className="col-sm-3 alt-rules">
                    <h4><strong>{t("Rules")}</strong></h4></div>
                <div className="col-sm-9">
                    <p className="accomodation-description">
                        {rules}
                    </p>
                </div>
            </div>
            <div className="divider hidden-xs  hidden-sm hidden-md "></div>
            <div className="divider hidden-lg"></div>
            <div className="row line">
                <div className="col-sm-3" alt="amenity">
                    <h4><strong>{t("Amenity")}</strong></h4></div>
                <div className="col-sm-9">
                    <p className="accomodation-description">
                        {listSiteShow}
                    </p>
                </div>
            </div>
            <div className="divider"></div>
            <div className="row line">
                <div className="col-sm-3" alt="cancel-policy">
                    <h4><strong>{t("Cancellation")}</strong></h4></div>
                <div className="col-sm-9">
                    {this.props.selectedCancellationPolicyDetails != null ?
                    <p className="accomodation-description">
                        <h4>{ this.props.selectedCancellationPolicyDetails.name }</h4> <h5>({this.props.selectedCancellationPolicyDetails.description})</h5>
                        <ul>
                            {
                                this.props.selectedCancellationPolicyDetails.notice.map((it, j) => {
                                    return (
                                        <li style={{display: "block"}}> {it.days} {it.days > 1 ? t("Days ago") : t("Day ago")} : {t("Total accommodation fee")} {it.refund} %</li>
                                    )
                                })
                            }
                        </ul>
                    </p>
                        : null }
                </div>
            </div>
            <div className="divider"></div>
            <div className="row">
                <div className="col-sm-3" alt="total-review">
                    <h4><strong>{t("Review")}</strong></h4></div>
                <div className="col-sm-9 col-xs-12">
                    {accomodationRating}
                    <div className="space-200 hidden-xs"></div>
                    <AccomodationReviewComments {...this.props}/>
                </div>
            </div>

            {(this.props.currentUserId !== owner.id) ?
            <div className="row  host-section mb-100">
                <div className="divider"></div>
                <div className="col-lg-3 col-md-3  col-sm-12  col-xs-12 avatar-md center-block text-center">
                    <img src={ (owner.profile && owner.profile.picture && owner.profile.picture.id) ? baseMVacationApiUrl + "/media/"+ owner.profile.picture.id + "/data?size=250x250" : baseCmsUrl + "/storage/app/media/default-images/250x250.png"} className="img-responsive img-circle" />
                </div>
                <div className="col-md-9 col-xs-12">
                    <h2><small>{owner.firstName} {owner.lastName} </small></h2>
                    <h3> <small> <i className="icon-location-pin"></i>{(owner.profile && owner.profile.address) ? owner.profile.address.state : ''} {(owner.profile && owner.profile.address) ? owner.profile.address.city:''}</small></h3>
                    <div className="persoanl-introduction">
                        {owner.profile ? owner.profile.selfIntroduction : ''}
                    </div>
                    <h3> <small> <i className="glyphicon glyphicon-star"></i></small>{t("Response Rate")} 100%</h3>
                    <h3> <small> <i className="glyphicon glyphicon-time"></i>{t("Response Time")} </small>{t("Very Soon")} </h3>
										<ContactHost currentUserId={this.props.currentUserId} accomodationId={this.state.accomodationId} owner={this.props.owner} {...this.props}/>
                </div>
            </div>
            : null}
        </div>
        );
    }
}
export default TranslationWrapper(translate("RoomDescription")(RoomDescription))
//export default RoomDescription;