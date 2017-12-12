/**
 * Created by samir on 10/04/2017.
 */
import React from 'react';

import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
import Message from './common/Message';
var Rating = require('react-rating');

/**
 *  Child Class  for App Parent Class
 *
 */



class ReviewHostChild extends React.Component {
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
     * update  app data
     *
     */
    save() {
        var rating        = this.state.rating ? this.state.rating : this.props.rating;
        var comments        = this.refs.newComments.value;

        const self = this;
        var data = {
            rating: rating,
            text: comments
          };

        let url = baseMVacationApiUrl + '/reservation/' + this.props.reservationId + '/hostreview';

        let onSuccessMethod = (data) => {
            self.props.updateCommentText(self.props.id, rating , comments ,self.props.index);
            self.setState({editing: false});
            $('#myModalHost').removeClass('modal show').addClass("modal");
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
        const self = this;
        bootbox.confirm({
            title: 'Delete Review',
            message: 'Are you sure',
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i>' + 'Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i>' +  'Confirm'
                }
            },
            callback: function (result) {
                if(result){

                    let url = baseMVacationApiUrl + '/reservation/' + self.props.reservationId + '/hostreview';

                    let onSuccessMethod = (data) => {
                        self.props.deleteComentBoard(self.props.index)
                    }

                    let onFailMethod = (err) => {
                        console.log(err.responseText);
                    }

                    ajaxCall(url, "DELETE", null, onSuccessMethod, onFailMethod);
                }
                //console.log('This was logged in the callback: ' + result);
            }
        });

    }

    onInputRatingChange(rate ) {
        this.setState({
            rating: rate
        });
    }

    modalClose(){
        this.setState({editing: false});
        $('#myModalHost').removeClass('modal show').addClass("modal");
    }
    /**
     * Html render for normal render
     * render
     *  @return {ReactElement} markup
     */
    renderNormal() {
        const { t } = this.props;
        const ind = (this.props.index+1);
        return(
            <div className="after-review-it clearfix">
                <h5>{t("Your Average Rate")}</h5>
                <div className="personal-sm" style={{fontSize: '24px'}}>
                    {this.props.rating?
                        <Rating
                            initialRate={this.props.rating}
                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                            full="fa fa-star"
                            fractions={2}
                        />:''}
                </div>
                <div className="review-description">
                    <pre className="testimonial-section mt-20 message-content-box" style={{border:'none',background:'none' ,fontFamily:'inherit', paddingLeft: "0px", lineHeight: "inherit"}}> {this.props.comments}</pre>
                </div>
                <h5>{this.props.date}</h5>
                {this.props.status=='PUBLISHED'? '' :
                <div className="row btn-margin">
                    <button type="button" className="button-medium" style={{marginLeft: "0px"}} onClick={this.edit.bind(this)}><span
                        className="glyphicon glyphicon-edit" aria-hidden="true"></span> {t("Edit")}
                    </button>
                    <button type="button" className="button-medium second" style={{marginLeft: "0px"}} onClick={this.remove.bind(this)}><span
                        className=" glyphicon glyphicon-remove" aria-hidden="true"></span>
                        {t("Delete")}
                    </button>
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
        return(
        <div className="modal show" id="myModalHost" tabIndex="-1" role="dialog"
             aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.modalClose.bind(this)} > <span aria-hidden="true">&times;</span>
                        </button>
                        <h5>{t("Review it")} </h5>
                        <Message errors={this.state.msg} type={this.state.type}></Message>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6 review-description">{t("Average")}</div>
                                <div className="col-md-6 review-description">
                                    <Rating
                                        initialRate={this.state.rating ? this.state.rating : this.props.rating}
                                        empty="fa fa-star-o" style={{color:'#ff6043'}}
                                        full="fa fa-star "
                                        fractions={2}
                                        onChange={ this.onInputRatingChange.bind(this)}
                                    />
                                </div>
                            </div>
                            <br/>
                            <div className="form-group">
                                <label htmlFor="message-text"
                                       className="form-control-label">{t("Comment")}:</label>
                                <textarea className="form-control" rows="8" ref="newComments"  defaultValue={this.props.comments}
                                          id="message-text" style={{resize : "none"}}></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary"
                                         style={{borderRadius: 0}} onClick={this.save.bind(this)}>
                                    {t("Submit")}
                                </button>
                                <button type="button" className="btn btn-secondary"
                                        data-dismiss="modal"
                                        style={{borderRadius: 0}} onClick={this.modalClose.bind(this)}>{t("Close")}
                                </button>
                            </div>
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
export default TranslationWrapper(translate("ReviewHostChild")(ReviewHostChild))
//export default ReviewHostChild;