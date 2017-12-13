//external
import React from 'react';

// internal
import { translate } from "react-translate";
import TranslationWrapper from "../i18n/TranslationWrapper";

class LikeWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            likedByCurrentUser:false,
            disLikedByCurrentUser:false,
            nbOfLikes:0,
            nbOfDisLikes:0
        }

   }

    clickLikeIt(info,e){
        e.preventDefault();

        const self = this;

        let url = baseMVacationApiUrl + '/'+ info.name + '/' + info.id + '/like';
        let ctype = "x-www-form";
        let onSuccessMethod = (data) => {
            self.setState({
                likedByCurrentUser: true,
                disLikedByCurrentUser:false,
                nbOfLikes: data.nbOfLikes,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "POST", "", onSuccessMethod, onFailMethod, ctype);
    }

    clickDisLikeIt(info,e){
        e.preventDefault();

        const self = this;

        let url = baseMVacationApiUrl + '/'+ info.name + '/' +  info.id + '/like';

        let onSuccessMethod = (data) => {
           self.setState({
               nbOfLikes: data.nbOfLikes,
               likedByCurrentUser: false,
               disLikedByCurrentUser: true,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "DELETE", null, onSuccessMethod, onFailMethod);
    }


    render(){
        const { t } = this.props;
        if(userLoggedIn){
       var  status = this.state.likedByCurrentUser ? this.state.likedByCurrentUser : this.state.disLikedByCurrentUser ? false : this.props.info.likedByCurrentUser;
       return (
                   <div className="helpLike">
                        { status == true ?
                            <button className="btn  btn-small helpful-btn" id={this.props.info.id} name={this.props.info.name}
                                    onClick={this.clickDisLikeIt.bind(this,this.props.info)}>
                                <span className="text-size" >
                                    <i  className="glyphicon glyphicon-thumbs-up"></i>
                                    <div  className="helpful-btn-text text-babu">
                                        {t("Helpful")}
                                    </div>
                                    <div className="helpful-btn-count helpful-btn-count-regular">
                                            {this.state.nbOfLikes ? this.state.nbOfLikes : this.props.info.nbOfLikes}
                                    </div>
                                </span>
                            </button>
                            :
                            <button className="btn  btn-small helpful-btn" id={this.props.info.id} name={this.props.info.name}
                                    onClick={this.clickLikeIt.bind(this,this.props.info)}>
                                <span className="text-size" >
                                    <i  className="glyphicon glyphicon-thumbs-up"></i>
                                    <div  className="helpful-btn-text text-muted">
                                        {t("Helpful")}
                                    </div>
                                    <div className="helpful-btn-count helpful-btn-count-regular">
                                            {this.state.nbOfLikes ||  this.state.disLikedByCurrentUser ? this.state.nbOfLikes : this.props.info.nbOfLikes}
                                    </div>
                                </span>
                            </button>
                        }
                    </div>
                );
        } else {
            return (
                <div className="helpLike">
                    <button className="btn  btn-small helpful-btn" data-toggle="modal" data-target="#loginModal">
                                <span className="text-size">
                                    <i className="glyphicon glyphicon-thumbs-up"></i>
                                    <div
                                        className= "helpful-btn-text text-muted">
                                        {t("Helpful")}
                                    </div>
                                    <div className="helpful-btn-count helpful-btn-count-regular">
                                        {this.props.info.nbOfLikes}
                                    </div>
                                </span>
                    </button>

                </div>
            );
        }
    }
}
export default TranslationWrapper(translate("LikeWidget")(LikeWidget))
//export default LikeWidget
