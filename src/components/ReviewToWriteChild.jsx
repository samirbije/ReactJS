/**
 * Created by samir on 10/04/2017.
 */
import React from 'react';
var Rating = require('react-rating');
import Message from './common/Message';
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"

/**
 *  Child Class  for App Parent Class
 *
 */



class ReviewToWriteChild extends React.Component {
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
            type:false,
            msg: [],
            editing: false,
            reviewMediaUrl:'',
            viewId:0
        };
    }

    /**
     * status setting for edit and save
     */
    edit() {
        this.setState({type:false, msg:[] });
        if (this.state.editing) {
            this.setState({editing: false});
        } else {
            this.setState({editing: true});
        }

    }
    /**
     * status setting for edit and save
     */
    view(e) {
        if (this.state.editing) {
            this.setState({editing: false});
        } else {
            this.setState({editing: true});
            this.setState({viewId: e.target.id});
        }

    }
    /**
     * update  app data
     *
     */
    save() {
        this.setState({type:false, msg:[] });
        var accuracy        = this.state.accuracy ? this.state.accuracy : this.props.accuracy;
        var communitaction  = this.state.communitaction ? this.state.communitaction : this.props.communitaction;
        var cleanliness     = this.state.cleanliness ? this.state.cleanliness : this.props.cleanliness;
        var location        = this.state.location ? this.state.location : this.props.location;
        var checkin         = this.state.checkin ? this.state.checkin : this.props.checkin;
        var host            = this.state.host ? this.state.host : this.props.host;
        var comments        = this.refs.newComments.value;
        var mediaId         = this.state.reviewMediaId ? [{"id": this.state.reviewMediaId }] :this.props.imgId ?  [{"id": this.props.imgId }]  : [];
        var media         = this.state.reviewMediaId ? this.state.reviewMediaId  : this.props.imgId ;
        //this.setState({editing: false});
        //var media = this.state.reviewMediaId ? [{"id": this.state.reviewMediaId }] : [];
        const self = this;
        var data = {
            date : new Date(),
            accuracy: accuracy,
            communitaction: communitaction,
            cleanliness: cleanliness,
            location: location,
            checkin:checkin,
            host:host,
            comments:comments,
            mediaList: mediaId

        };

        let url = baseMVacationApiUrl + '/reservation/' + this.props.reservationId + '/guestreview';

        let onSuccessMethod = (data) => {
            self.props.updateCommentText(self.props.id, accuracy , communitaction ,cleanliness ,location , checkin , host , comments,media ,self.props.index)
            self.setState({type:false});
            self.setState({editing: false});
            $('#myModalGuest').removeClass('modal show').addClass("modal");
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

        ajaxCall(url, "PUT", data, onSuccessMethod, onFailMethod);
    }

    /**
     * Remove from apps array
     *
     */
    remove() {
        const {t} = this.props;
        const self = this;
        bootbox.confirm({
            title: 'Delete Review',
            message: 'Are you sure',
            buttons: {
                cancel: {
                    label: '<i className="fa fa-times"></i>' + 'Cancel'
                },
                confirm: {
                    label: '<i className="fa fa-check"></i>' +  'Confirm'
                }
            },
            callback: function (result) {
                if(result){

                    let url = baseMVacationApiUrl + '/reservation/' + self.props.reservationId + '/guestreview';

                    let onSuccessMethod = (data) => {
                        self.props.deleteComentBoard(self.props.index)
                    }

                    let onFailMethod = (err) => {
                        console.log(err.responseText);
                    }

                    ajaxCall(url, "DELETE", null, onSuccessMethod, onFailMethod);
                }
            }
        });
    }

    onInputAccuracyChange(rate ) {
        this.setState({
            accuracy: rate
        });
    }

    onInputCommunitactionChange(rate ) {
        this.setState({
            communitaction: rate
        });
    }

    onInputCleanlinessChange(rate ) {
        this.setState({
            cleanliness: rate
        });
    }

    onInputLocationChange(rate ) {
        this.setState({
            location: rate
        });
    }

    onInputCheckInChange(rate ) {
        this.setState({
            checkin: rate
        });
    }

    onInputHostChange(rate ) {
        this.setState({
            host: rate
        });
    }

    uploadImg(e) {
        e.preventDefault();
        let image = e.target.files[0];
        let data = new FormData();
        data.append('file', image);
        var self = this;

        let url = baseMVacationApiUrl + "/mediaform";
        let ctype = "media";
        let onSuccessMethod = (data) => {
            self.setState({
                reviewMediaId: data.id,
                reviewMediaUrl: data.url
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "POST", data, onSuccessMethod, onFailMethod, ctype);
    }


    modalClose(){
        this.setState({editing: false});
        $('#myModalGuest').removeClass('modal show').addClass("modal");
    }
    /**
     * Html render for normal render
     * render
     *  @return {ReactElement} markup
     */
    renderNormal() {
        const { t } = this.props;
        const totalReview =  this.props.accuracy+this.props.communitaction+this.props.cleanliness+this.props.location + this.props.checkin +this.props.host;
        const avgReview = totalReview/6;
        return(

        <div className="after-review-it clearfix">
            <h5>{t("Your Average Rate")}</h5>
            <div className="personal-sm" style={{fontSize:'24px'}}>
                {avgReview?<Rating
                    initialRate={avgReview}
                    empty="fa fa-star-o" style={{color:'#ff6043'}}
                    full="fa fa-star"
                    fractions={2}
                    readonly
                />:''}
            </div>
            <div className="review-description">
                <pre className="testimonial-section mt-20 message-content-box"  style={{border:'none',background:'none' ,fontFamily:'inherit', paddingLeft: "0px", lineHeight: "inherit"}}> {this.props.comments}</pre>
            </div>
            <h5>{this.props.date}</h5>
            {this.props.status=='PUBLISHED'? '' :
            <div class="row btn-margin">
                <button type="button" className="button-medium" style={{marginLeft: "0px"}} data-toggle="modal" data-target="#myModalGuest" onClick={this.edit.bind(this)}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span>{t("Edit")}</button>
                <button type="button" className="button-medium second" style={{marginLeft: "0px"}} onClick={this.remove.bind(this)}> <span className=" glyphicon glyphicon-remove" aria-hidden="true"></span>{t("Delete")}</button>
            </div>}
        </div>
        );
    }


    /**
     *After click edit button new HTML form for Edit
     *render
     *  @return {ReactElement} markup
     */
    renderForm() {
        const { t } = this.props;
        //console.log("333" + this.props.imgId);
        let reviewImageUrl = this.state.reviewMediaUrl ? this.state.reviewMediaUrl: this.props.imgId!='' ? baseMVacationApiUrl +'/media/' + this.props.imgId +'/data?size=50x50' : '';
        let imagePreview = (baseCmsUrl + "/storage/app/media/default-images/avatar_2x.png");
        if (reviewImageUrl) {
           imagePreview =  (reviewImageUrl);
        }

        return(

        <div className="modal show" id="myModalGuest" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.modalClose.bind(this)} > <span aria-hidden="true">&times;</span>
                        </button>
                        <h5>{t("Review it")}</h5>
                        <Message errors={this.state.msg} type={this.state.type}></Message>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-3 ">{t("Evaluation")}</div>
                                <div className="col-xs-12 col-md-3">
                                    <h5> <strong>{t("Accuracy")}</strong></h5>
                                    <Rating
                                        initialRate={this.state.accuracy ? this.state.accuracy : this.props.accuracy}
                                        empty="fa fa-star-o " style={{color:'#ff6043'}}
                                        full="fa fa-star "
                                        fractions={2}
                                        onChange={this.onInputAccuracyChange.bind(this)}
                                    />
                                </div>
                                <div className="col-xs-12 col-md-3">
                                    <h5> <strong>{t("Cleanliness")}</strong> </h5>
                                    <Rating
                                        initialRate={this.state.communitaction ? this.state.communitaction : this.props.communitaction}
                                        empty="fa fa-star-o " style={{color:'#ff6043'}}
                                        full="fa fa-star "
                                        fractions={2}
                                        onChange={this.onInputCommunitactionChange.bind(this)}
                                    />
                                </div>
                                <div className="col-xs-12 col-md-3 ">
                                    <h5> <strong>{t("Check in")}</strong> </h5>
                                    <Rating
                                        initialRate={this.state.cleanliness ? this.state.cleanliness : this.props.cleanliness}
                                        empty="fa fa-star-o " style={{color:'#ff6043'}}
                                        full="fa fa-star "
                                        fractions={2}
                                        onChange={this.onInputCleanlinessChange.bind(this)}
                                    />
                                </div>
                                <div className="col-md-3 " style={{display:'invisble'}}></div>
                                <div className="col-md-3  col-xs-12">
                                    <h5> <strong>{t("Communication")}</strong></h5>
                                    <Rating
                                        initialRate={this.state.location ? this.state.location : this.props.location}
                                        empty="fa fa-star-o " style={{color:'#ff6043'}}
                                        full="fa fa-star "
                                        fractions={2}
                                        onChange={this.onInputLocationChange.bind(this)}
                                    />
                                </div>
                                <div className="col-xs-12 col-md-3">
                                    <h5> <strong>{t("Location")}</strong> </h5>
                                    <Rating
                                        initialRate={this.state.checkin ? this.state.checkin : this.props.checkin}
                                        empty="fa fa-star-o " style={{color:'#ff6043'}}
                                        full="fa fa-star "
                                        fractions={2}
                                        onChange={this.onInputCheckInChange.bind(this)}
                                    />
                                </div>
                                <div className="col-xs-12 col-md-3">
                                    <h5> <strong>{t("Host")}</strong></h5>
                                    <Rating
                                        initialRate={this.state.host ? this.state.host : this.props.host}
                                        empty="fa fa-star-o " style={{color:'#ff6043'}}
                                        full="fa fa-star "
                                        fractions={2}
                                        onChange={this.onInputHostChange.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message-text" className="form-control-label">{t("Message")}:</label>
                            <textarea placeholder="" ref="newComments"  rows="8" defaultValue={this.props.comments} required="true" className="form-control"  style={{resize : "none"}} />
                        </div>
                        <label htmlFor="message-text" className="form-control-label">{t("Upload")}:</label>
                        <label><small>{t("Attach photos")}</small></label>
                        <div className="col-sm-2  col-xs-2 ">
                        <span className="thumbnail" id="carousel-selector-0">
                            <img src= { imagePreview } style={{ height:'50px',width:'50px'}} />
                        </span>
                        </div>
                        <div className="fileUpload btn btn-default">
                            <span>+</span>
                             <input type="file" className="upload" id="file"  onChange={this.uploadImg.bind(this)}/>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary"  style={{borderRadius: 0}} onClick={this.save.bind(this)}>{t("Submit")}</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" data-dismiss="modal" style={{borderRadius: 0}} onClick={this.modalClose.bind(this)}>{t("Close")}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }

    /**
     * maintaining normalform and after click edit using editing flag
     * render
     *  @return {ReactElement} markup
     */
    render() {
        const { t } = this.props;
        if(this.state.editing) {
            return this.renderForm();
        }else {
            return this.renderNormal();
        }
    }
}
export default TranslationWrapper(translate("ReviewToWriteChild")(ReviewToWriteChild))
//export default ;