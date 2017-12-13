import React from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"


//internal
import ReviewHostChild from './ReviewHostChild';
import ReviewToWriteChild from './ReviewToWriteChild';
import Message from './common/Message';

var Rating = require('react-rating');
class ReviewToWrite extends React.Component {
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
            accuracy:0,
            location:0,
            communication:0,
            checkin:0,
            cleanness:0,
            host:0,
            text:null,
            reviewMediaId:"",
            reviews:[

            ],
            reservationGuestLists:[],
            reservationHostLists:[],
            reservationGuest:[],
            reservationHost:[],
            type:false,
            msg:[],
            type1:false,
            msg1:[]
        }
    }

    /**
     * Remove App
     * @param i
     */
    removeComment(i) {
        var arr = this.state.reservationGuest;
        arr[i]={"name":arr[i].name,
            "city":arr[i].city,
            "mediaList":arr[i].mediaList,
            "reservationId":arr[i].reservationId,"guestReview":null};
        this.setState({reservationGuest:arr});
    }
    /**
     * Remove App
     * @param i
     */
    removeCommentHost(i) {
        var arr = this.state.reservationHost;
        arr[i]={"name":arr[i].name,
            "city":arr[i].city,
            "mediaList":arr[i].mediaList,
            "reservationId":arr[i].reservationId,"hostReview":null};
        this.setState({reservationHost:arr});
    }

    addHost(e){
        e.preventDefault();
        this.setState({type:false, msg:[] });
        var data1= {
            "date": new Date(),
            "text": this.state.text,
            "rating": this.state.rating
        };
        const self = this;

        let url = baseMVacationApiUrl + '/reservation/'+ this.state.reservationId + '/hostreview';

        let onSuccessMethod = (data) => {
            var arr = self.state.reservationHost;
            arr[self.state.index]={
                "name":arr[self.state.index].name,
                "city":arr[self.state.index].city,
                "mediaList":arr[self.state.index].mediaList,
                "reservationId":arr[self.state.index].reservationId,"hostReview": data};
            self.setState({reservationHost:arr});
           // arr.push({"hostReview":response.data});
            //self.setState({reservationHost:arr});
            self.setState({rating:0,
                text:''
            });
            self.setState({type:false});
            $('#ModalFormHost').modal('hide');
        }

        let onFailMethod = (err) => {
            var errArr = [];
            if(err.responseJSON && err.responseJSON.details) {
                err.responseJSON.details.forEach(function (item) {
                    errArr.push(item.message);
                });
            }else if(err.responseJSON){
                errArr.push(err.responseJSON.message);
            }else {
                errArr.push(err.responseText);
            }

            self.setState({type1:true});
            self.setState({msg1:errArr});
            // self.setState({msg:error.response.data});
        }

        ajaxCall(url, "POST", data1, onSuccessMethod, onFailMethod);
    }

    add(e){
        e.preventDefault();
        this.setState({type:false, msg:[] });
        var media = this.state.reviewMediaId ? [{"id": this.state.reviewMediaId }] : [];
        var data1= {
            "date": new Date(),
            "comments": this.state.comments,
            "accuracy": this.state.accuracy,
            "communitaction": this.state.communication,
            "cleanliness": this.state.cleanness,
            "location": this.state.location,
            "checkin": this.state.checkin,
            "host": this.state.host,
            "mediaList": media
        };

        const self = this;

        let url = baseMVacationApiUrl + '/reservation/'+ this.state.reservationId + '/guestreview';

        let onSuccessMethod = (data) => {
            var arr = self.state.reservationGuest;
            arr[self.state.index]={
                "name":arr[self.state.index].name,
                "city":arr[self.state.index].city,
                "mediaList":arr[self.state.index].mediaList,
                "reservationId":arr[self.state.index].reservationId,"guestReview": data};
                self.setState({reservationGuest:arr});
                self.setState({
                accuracy:0,
                communication:0,
                cleanness:0,
                location:0,
                checkin:0,
                host:0,
                comments:'',
               reviewMediaUrl:''
            });
            //self.setState({msg:false});
            self.setState({type:false});
            $('#ModalFormGuest').modal('hide');
        }

        let onFailMethod = (err) => {
            var errArr = [];
            if(err.responseJSON && err.responseJSON.details) {
                err.responseJSON.details.forEach(function (item) {
                    errArr.push(item.message);
                });
            }else if(err.responseJSON){
                errArr.push(err.responseJSON.message);
            }else {
                errArr.push(err.responseText);
            }

            self.setState({type:true});
            self.setState({msg:errArr});
            // self.setState({msg:error.response.data});
        }

        ajaxCall(url, "POST", data1, onSuccessMethod, onFailMethod);
    }

    /**
     * Update apps Array
     * @param id
     * @param newText
     * @param newText1
     * @param i
     */
    updateComment(id,accuracy , communitaction , cleanliness, location, checkin , host , comments , mediaId , i) {
        var arr = this.state.reservationGuest;

        arr[i]= {
            "name":arr[i].name,
            "city":arr[i].city,
            "mediaList":arr[i].mediaList,
            "reservationId":arr[i].reservationId,"guestReview":{"id":id,"accuracy":accuracy ,"communitaction":communitaction ,"cleanliness":cleanliness,"location":location,"checkin": checkin ,"host":host , "comments":comments,"mediaList": [{"id": mediaId }]}};
        this.setState({reservationGuest:arr});
    }
    /**
     * Update apps Array
     * @param id
     * @param newText
     * @param newText1
     * @param i
     */
    updateCommentHost(id,rating,comments , i) {
        var arr = this.state.reservationHost;

        arr[i]= {"name":arr[i].name,
            "city":arr[i].city,
            "mediaList":arr[i].mediaList,
            "reservationId":arr[i].reservationId,"hostReview":{"id":id,"rating":rating , "text":comments}};
        this.setState({reservationHost:arr});
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
                var newArr=[];
                for(var i = 0; i<data.items.length; i++) {
                    newArr.push({
                        "name": data.items[i].accomodation.name,
                        "city": data.items[i].accomodation.address.city,
                        "mediaList": data.items[i].accomodation.featuredPicture.id,
                        "reservationId": data.items[i].id,
                        "guestReview": data.items[i].guestReview
                    })
                }
                self.setState({reservationGuest:newArr});
                self.setState({
                    reservationGuestLists: data.items,
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
            var newArr=[];
            for(var i = 0; i<data.items.length; i++) {
                newArr.push({
                    "name": data.items[i].accomodation.name,
                    "city": data.items[i].accomodation.address.city,
                    "mediaList": data.items[i].user.profile ? data.items[i].user.profile.picture.id:'',
                    "reservationId": data.items[i].id,
                    "hostReview": data.items[i].hostReview
            })
            }
            self.setState({reservationHost:newArr});
            self.setState({
                reservationHostLists: data.items,
            });
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
    onInputAccuracyChange(rate ) {
        this.setState({
            accuracy: rate
        });
    }

    onInputLocationChange(rate ,e) {
        this.setState({
            location: rate
        });
    }

    onInputCommunicationChange(rate ,e) {
        this.setState({
            communication: rate
        });
    }

    onInputCheckInChange(rate ,e) {
        this.setState({
            checkin: rate
        });
    }

    onInputCleannessChange(rate ,e) {
        this.setState({
            cleanness: rate
        });
    }

    onInputHostChange(rate ,e) {
        this.setState({
            host: rate
        });
    }

    /**
     *
     * @param e
     */
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});

    }


    uploadImg(e) {
        e.preventDefault();
        let image = e.target.files[0];
        let data = new FormData();
        data.append('file', image);
        var self = this;

        let url = baseMVacationApiUrl + "/mediaform";
        let ctype = "media"
        let onSuccessMethod = (data) => {
            self.setState({
                reviewMediaId: data.id,
                reviewMediaUrl: data.url
            })
        }

        let onFailMethod = (err) => {
            console.log(err);
        }

        ajaxCall(url, "POST", data, onSuccessMethod, onFailMethod, ctype);
    }

    clickReservation(e){
        this.setState({
            type:false,
            msg:[],
            type1:false,
            msg1:[],
            reservationId: e.target.id,
            index: e.target.name
        });
    }

    onInputRatingChange(rate ) {
        this.setState({
            rating: rate
        });
    }

    render() {
        const { t } = this.props;
        let reviewImageUrl = this.state.reviewMediaId ? baseMVacationApiUrl +'/media/' + this.state.reviewMediaId +'/data?size=50x50':'';
        let imagePreview = (baseCmsUrl + "/storage/app/media/default-images/avatar_2x.png");
        if (reviewImageUrl) {
            imagePreview = (reviewImageUrl);
        }
        return (

            <div>
                {this.state.reservationGuest.length>0 ?
                <div className="section-title sub-title"><strong>{t("As a Guest")}</strong></div> : ''}
                {this.state.reservationGuest.map((text, i) => {
                    return (
                        <div className="card-panel author-box hoverable">
                            <div className="row center-on-small-only">
                                <div className="col-sm-3">
                                    <center>
                                        <img src={text.mediaList ? baseMVacationApiUrl +'/media/' + text.mediaList +'/data?size=100x100':''}  width={100} height={100} className="img-responsive img-circle"/>
                                    </center>
                                </div>
                                <div className="col-sm-9 text-center-xs">
                                    <div className="before-review-it clearfix">
                                        <h3>{text.name}</h3>
                                        <label style={{marginLeft: "0px"}}><i className="icon-location-pin"></i> {text.city}</label>
                                        <br/>
                                        {text.guestReview ? '' :
                                            <button type="button" className="button-medium" style={{borderRadius: 0, marginLeft: "0px"}} data-toggle="modal" data-target="#ModalFormGuest" id={text.reservationId} name={i}
                                                    onClick={this.clickReservation.bind(this)}>
                                                <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>{t("Review it")}
                                                <br/>
                                            </button>}

                                        {text.guestReview?
                                        <ReviewToWriteChild
                                            translations={translations}
                                            accuracy={ text.guestReview.accuracy }
                                            status={text.guestReview.status}
                                            communitaction={text.guestReview.communitaction}
                                            cleanliness={ text.guestReview.cleanliness}
                                            location={ text.guestReview.location}
                                            checkin={ text.guestReview.checkin}
                                            date={moment(text.guestReview.date).format('YYYY-MM-DD')}
                                            host={ text.guestReview.host}
                                            comments={ text.guestReview.comments}
                                            imgId={ text.guestReview.mediaList[0] ? text.guestReview.mediaList[0].id : ''}
                                            imgUrl={ text.guestReview.mediaList[0] ? text.guestReview.mediaList[0].id : ''}
                                            rating={2}
                                            key={i}
                                            index={i}
                                            guest={0}
                                            reservationId={text.reservationId}
                                            id={review.id}
                                            updateCommentText={this.updateComment.bind(this)}
                                            deleteComentBoard={this.removeComment.bind(this)}>
                                        </ReviewToWriteChild>:''}
                                    </div>
                                </div>
                            </div>
                            <div className="divider"></div>
                        </div>
                    )
                })
                }

                <div className="modal fade" id="ModalFormGuest" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <form onSubmit={this.add.bind(this)}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span>
                                </button>
                                <h5>{t("Review it")}</h5>
                                <Message errors={this.state.msg} type={this.state.type}></Message>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-3">{t("Evaluation")}</div>
                                        <div className="col-md-3  col-xs-12">
                                            <h5> <strong>{t("Accuracy")}</strong></h5>
                                            <Rating
                                                initialRate={this.state.accuracy}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                onChange={this.onInputAccuracyChange.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3  col-xs-12">
                                            <h5> <strong>{t("Location")}</strong> </h5>
                                            <Rating
                                                initialRate={this.state.location}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                onChange={this.onInputLocationChange.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3  col-xs-12">
                                            <h5> <strong>{t("Communication")}</strong> </h5>
                                            <Rating
                                                initialRate={this.state.communication}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                onChange={this.onInputCommunicationChange.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3" style={{display:'invisble'}}></div>
                                        <div className="col-md-3  col-xs-12">
                                            <h5> <strong>{t("Check In")}</strong></h5>
                                            <Rating
                                                initialRate={this.state.checkin}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                onChange={this.onInputCheckInChange.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3 col-xs-12">
                                            <h5> <strong>{t("Cleanness")}</strong> </h5>
                                            <Rating
                                                initialRate={this.state.cleanness}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                onChange={this.onInputCleannessChange.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3  col-xs-12">
                                            <h5> <strong>{t("Host")}</strong></h5>
                                            <Rating
                                                initialRate={this.state.host}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                onChange={this.onInputHostChange.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message-text" className="form-control-label">{t("Message")}:</label>
                                    <textarea placeholder="" rows="8" name="comments" value={this.state.comments} className="form-control" required="required" style={{resize : "none"}} onChange={this.handleChange.bind(this)}></textarea>
                                </div>
                                <label htmlFor="message-text" className="form-control-label">{t("Upload")}:</label>
                                <div className="col-sm-3 col-xs-3 ">
                                <span  id="carousel-selector-0"  style={{ minHeight:'50px',minWidth:'50px',padding:'.25em'}}>
                                    <img src= { imagePreview } style={{ height:'50px',width:'50px'}} />
                                </span>
                                </div>
                                <div className="fileUpload btn btn-default">
                                    <span>+</span>
                                    <input type="file" className="upload"  id="file"  onChange={this.uploadImg.bind(this)} />
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary"  style={{borderRadius: 0}}>{t("Submit")}</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" data-dismiss="modal" style={{borderRadius: 0}}>{t("Close")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
                {this.state.reservationHost.length > 0 ?
                <div className="section-title sub-title"><strong>{t("As a Host")}</strong></div>:''}
                {this.state.reservationHost.map((review, i) => {
                    // if(review.hostReview!=null) {
                    return (
                        <div className="card-panel author-box hoverable">
                            <div className="row center-on-small-only">
                                <div className="col-sm-3 col-xs-12">
                                    <center>
                                        <img src={review.mediaList ? baseMVacationApiUrl +'/media/' +review.mediaList +'/data?size=100x100':'' } width={100} height={100} className="img-responsive img-circle"/>
                                    </center>
                                </div>
                                <div className="col-sm-9 text-center-xs">
                                    <div className="before-review-it clearfix">
                                        <h3>{review.name}</h3>
                                        <label style={{marginLeft: "0px"}}><i className="icon-location-pin"></i> {review.city}</label>
                                        <br/>
                                        {review.hostReview?'':
                                        <button type="button" className="button-medium"
                                                style={{borderRadius: 0, marginLeft: "0px"}} data-toggle="modal" data-target="#ModalFormHost" id={review.reservationId} name={i} onClick={this.clickReservation.bind(this)}>
                                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                            {t("Review it")}<br/>
                                        </button>}
                                        {review.hostReview?
                                        <ReviewHostChild
                                            translations={translations}
                                            status={review.hostReview.status}
                                            rating={review.hostReview.rating}
                                            comments={review.hostReview.text}
                                            date={ moment(review.hostReview.date).format('YYYY-MM-DD')}
                                            key={i}
                                            index={i}
                                            reservationId={review.reservationId}
                                            id={review.id}
                                            updateCommentText={this.updateCommentHost.bind(this)}
                                            deleteComentBoard={this.removeCommentHost.bind(this)}>
                                            >
                                        </ReviewHostChild>:''}
                                    </div>
                                </div>
                            </div>
                            <div className="divider"></div>
                        </div>
                    )
                    //   }
                })
                }
                <div className="modal fade" id="ModalFormHost" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <form onSubmit={this.addHost.bind(this)}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                                </button>
                                <h5>{t("Review it")}</h5>
                                <Message errors={this.state.msg1} type={this.state.type1}></Message>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-6 review-description">{t("Average")}</div>
                                        <div className="col-md-6 review-description">
                                            <Rating
                                                initialRate={this.state.rating}
                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                full="fa fa-star"
                                                fractions={2}
                                                onChange={this.onInputRatingChange.bind(this)}
                                            />
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="form-group">
                                        <label htmlFor="message-text"
                                               className="form-control-label">{t("Comment")}:</label>
                                        <textarea placeholder="" rows="8" name="text"  value={this.state.text}  className="form-control"  required="required" style={{resize : "none"}} onChange={this.handleChange.bind(this)}/>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary"
                                                 style={{borderRadius: 0}}>
                                            {t("Submit")}
                                        </button>
                                        <button type="button" className="btn btn-secondary"
                                                data-dismiss="modal" data-dismiss="modal"
                                                style={{borderRadius: 0}}>{t("Close")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
           </div>
        );
    }
}
export default TranslationWrapper(translate("ReviewToWrite")(ReviewToWrite))
//export default ReviewToWrite;