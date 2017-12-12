import React from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"


//internal

var Rating = require('react-rating');
class ReviewHost extends React.Component {
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
        this.state = {
            rating:null,
            reviewMediaId:"",
            reviewHosts:[

              ],
            reviewGuest:[

            ],
            reservationGuestLists:[],
            reservationHostLists:[],
            type:false,
            msg:[]
        }
    }

    loadReservationListFromServer(){
        var text = {
            "userId" : 0,
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/reservation?orderBy=id&offset=0&size=-1&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                reservationGuestLists: data.items,
                reviewGuest: data.items.length > 0 ? data.items[0].hostReview : null
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    loadReservationHostListFromServer(){
        var text = {
            "hostId" : 0,
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/reservation?orderBy=id&offset=0&size=-1&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                reservationHostLists: data.items,
                reviewHost: data.items.length > 0 ? data.items[0].guestReview:null
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
        this.loadReservationListFromServer();
        this.loadReservationHostListFromServer();
    }

    /**
     * state change of every input field
     * handle change event at input form
     * @param {SytheticEvent} e
     */
    onInputRatingChange(rate ) {
        this.setState({
            rating: rate
        });
    }

    clickReservation(e){
        this.setState({
            reservationId: e.target.id
        });
    }

    /**
     *
     * @param e
     */
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }


    render() {
        const { t } = this.props;
        
       return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="section-title sub-title"><strong>{t("From a Host")}</strong></div>
                {this.state.reviewHost == null  && this.state.reviewGuest==null ? t("No one has reviewed you yet") : ''}
                  {this.state.reservationGuestLists.map((text, i) => {
                     if(text.hostReview!=null) {
                    return (
                        <div>
                            <div className="card-panel author-box hoverable">
                                <div className="row center-on-small-only">
                                    <div className="col-sm-3">
                                        <center>
                                            <img src={baseMVacationApiUrl +'/media/' + text.accomodation.featuredPicture.id +'/data?size=100x100'} width={100} height={100} className="img-responsive img-circle"/>
                                        </center>
                                    </div>
                                    <div className="col-sm-9 text-center-xs">
                                        <h3>{text.accomodation.name}</h3>
                                        <div className="personal-sm">
                                            <Rating
                                                initialRate={ text.hostReview ? text.hostReview.rating : ''}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                readonly
                                            />
                                        </div>
                                        <label style={{marginLeft: "0px"}}><i className="icon-location-pin"></i> {text.accomodation.address.city}</label>
                                        <div className="review-description">
                                            <pre className="testimonial-section mt-20 message-content-box"  style={{border:'none',background:'none' ,fontFamily:'inherit', paddingLeft: "0px", lineHeight: "inherit"}}> { text.hostReview ? text.hostReview.text : ''}</pre>
                                        </div>
                                        <h5>{ text.hostReview ? moment(text.hostReview.date).format('YYYY-MM-DD') : ''}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="divider"></div>
                        </div>
                    )
                    }
                })
                }
                <div className="section-title sub-title"><strong>{t("From a Guest")}</strong></div>
                {this.state.reservationHostLists.map((review, i) => {
                     if(review.guestReview!=null) {
                    const totalReview =  review.guestReview.accuracy + review.guestReview.communitaction + review.guestReview.cleanliness+ review.guestReview.location + review.guestReview.checkin +review.guestReview.host;
                    const avgReview = totalReview/6;
                    return (
                        <div>
                        <div className="card-panel author-box hoverable">
                            <div className="row center-on-small-only">
                                <div className="col-sm-3">
                                    <div className="avatar">
                                        <center>
                                            <img src={baseMVacationApiUrl +'/media/' + review.accomodation.featuredPicture.id +'/data?size=100x100' } width={100} height={100}  className="img-circle img-responsive " />
                                        </center>
                                    </div>
                                </div>
                                <div className="col-sm-9 text-center-xs">
                                    <h3>{review.accomodation.name}</h3>
                                    <div className="personal-sm">
                                        <Rating
                                            initialRate={avgReview}
                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                            full="fa fa-star"
                                            fractions={2}
                                            readonly
                                        />
                                    </div>
                                    <label style={{marginLeft: "0px"}}><i className="icon-location-pin"></i>{review.accomodation.address.city}</label>
                                    <div className="review-description">
                                        { review.guestReview?review.guestReview.comments:''}
                                        <h5>{ review.guestReview ? moment(review.guestReview.date).format('YYYY-MM-DD') : ''}</h5>
                                    </div>

                                    <button type="button" className="btn advanced-search-button second" data-toggle="modal" data-target={'#myModal-'+i}>{t("Details")}</button>
                                    <div className="mb-100 visible-xs"></div>
                                    <div id={'myModal-'+i} className="modal fade mt-100" role="dialog">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                                    <h4><label>{t("Average Rating")} </label>
                                                        <div>
                                                            <Rating
                                                                initialRate={ avgReview }
                                                                empty="fa fa-star-o " style={{color:'#ff6043'}}
                                                                full="fa fa-star "
                                                                fractions={2}
                                                                readonly
                                                            />
                                                        </div>
                                                    </h4>
                                                </div>
                                                <div className="modal-body row">
                                                    <div className="col-sm-4 col-xs-12">
                                                        <h5><strong>{t("Accuracy")}</strong></h5>
                                                        <Rating
                                                            initialRate={ review.guestReview?review.guestReview.accuracy :''}
                                                            empty="fa fa-star-o " style={{color:'#ff6043'}}
                                                            full="fa fa-star "
                                                            fractions={2}
                                                            readonly
                                                        />
                                                    </div>
                                                    <div className="col-sm-4 col-xs-12">
                                                        <h5><strong>{t("Communication")}</strong></h5>
                                                        <Rating
                                                            initialRate={review.guestReview?review.guestReview.communitaction:''}
                                                            empty="fa fa-star-o " style={{color:'#ff6043'}}
                                                            full="fa fa-star "
                                                            fractions={2}
                                                            readonly
                                                        />
                                                    </div>
                                                    <div className="col-sm-4 col-xs-12">
                                                        <h5><strong>{t("Cleanliness")}</strong></h5>
                                                        <Rating
                                                            initialRate={ review.guestReview?review.guestReview.cleanliness:''}
                                                            empty="fa fa-star-o " style={{color:'#ff6043'}}
                                                            full="fa fa-star "
                                                            fractions={2}
                                                            readonly
                                                        />
                                                    </div>
                                                    <div className="col-sm-4 col-xs-12">
                                                        <h5><strong>{t("Location")} </strong></h5>
                                                        <Rating
                                                            initialRate={ review.guestReview?review.guestReview.location:''}
                                                            empty="fa fa-star-o " style={{color:'#ff6043'}}
                                                            full="fa fa-star "
                                                            fractions={2}
                                                            readonly
                                                        />
                                                    </div>
                                                    <div className="col-sm-4 col-xs-12">
                                                        <h5><strong>{t("Host")}</strong></h5>
                                                        <Rating
                                                            initialRate={ review.guestReview?review.guestReview.host:''}
                                                            empty="fa fa-star-o " style={{color:'#ff6043'}}
                                                            full="fa fa-star "
                                                            fractions={2}
                                                            readonly
                                                        />
                                                    </div>
                                                    <div className="col-sm-4 col-xs-12">
                                                        <h5><strong>{t("Check in")}</strong></h5>
                                                        <Rating
                                                            initialRate={ review.guestReview?review.guestReview.checkin:''}
                                                            empty="fa fa-star-o " style={{color:'#ff6043'}}
                                                            full="fa fa-star "
                                                            fractions={2}
                                                            readonly
                                                        />
                                                    </div>
                                                    <div className="review-description col-sm-12">
                                                        <pre className="testimonial-section mt-20 message-content-box"  style={{border:'none',background:'none' ,fontFamily:'inherit', paddingLeft: "0px", lineHeight: "inherit"}}>{ review.guestReview ? review.guestReview.comments:''}</pre>
                                                        <h5>{ review.guestReview ? moment(review.guestReview.date).format('YYYY-MM-DD'):''}</h5>
                                                    </div>

                                                </div>
                                                <div className="col-sm-2  col-xs-2 ">
                                                    <span className="thumbnail" id="carousel-selector-0">
                                                        <img src= { review.guestReview.mediaList[0] ? baseMVacationApiUrl +'/media/' + review.guestReview.mediaList[0].id +'/data?size=50x50':''} style={{ height:'50px',width:'50px'}} />
                                                    </span>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-default pull-left" data-dismiss="modal" style={{borderRadius:0}}>{t("Close")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="divider"></div>
                        </div>
                    )
                     }
                })
                }
            </div>
        );
    }
}
export default TranslationWrapper(translate("ReviewHost")(ReviewHost))
//export default ReviewHost;