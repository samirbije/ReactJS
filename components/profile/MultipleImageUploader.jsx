//external
import React, { Component } from 'react';
import { translate } from "react-translate";
import Select from 'react-select';
import { Carousel } from 'react-responsive-carousel';

//internal
import TranslationWrapper from "../i18n/TranslationWrapper";
import Message from "../common/Message";
import TextFieldGroup from '../common/TextFieldGroup';


class MultipleImageUploader extends Component {

    constructor(props) {
        super(props);
        let images = this.props.images;
        this.state = {
            thumbIndex: 0,
            thumbTag: this.props.thumbTag,
            images: (images) ? images : []
        };
    }

    componentDidMount(){
        this.activeThumbImg(this.state.thumbIndex);
    }

    activeThumbImg(i){
        $("#" + this.state.thumbTag + "-img-thumb-edit>li>img").removeClass("active");
        $("#" + this.state.thumbTag + "-img-thumb-"+i).addClass("active");
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
            let imgList = this.state.images;
            let newImg = {"id": data.id};
            imgList.push(newImg);
            this.props.callback(imgList);

            let thumbIndex = imgList.length -1;

            self.setState({
                images: imgList,
                thumbIndex: thumbIndex
            },function(){
                self.activeThumbImg(thumbIndex);
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "POST", data, onSuccessMethod, onFailMethod, ctype);
    }

    removeImage(e){
        e.preventDefault();
        let self = this;
        let imageIdx = parseInt(e.target.id);
        let thumbIndex = this.state.thumbIndex;
        //console.log("e targett",imageIdx);

        let updatedData = Object.assign([],this.state.images);
        updatedData.splice(e.target.id,1);
        this.props.callback(updatedData);

        self.setState({
            images:updatedData,
            thumbIndex: (thumbIndex == imageIdx) ? 0 : thumbIndex
            },function(){
                (thumbIndex == imageIdx) ? self.activeThumbImg(0) : null;
            });
    }

    onThumbClick(i){
        let self = this;
        let thumbIndex = i;
        self.setState({
            thumbIndex:thumbIndex
            }, function(){
                self.activeThumbImg(thumbIndex);
            });
    }


    render() {
        const { t } = this.props;

        let imgList = this.state.images;
        let imgUrlList =[];

        if (imgList.length) {
            imgList.map((item,i) => {
                let src = baseMVacationApiUrl + "/media/" + item.id + "/data";
                imgUrlList.push(src);
            })
        }

        const list = imgUrlList.map((image,i)=>{
            return (
                <li style={{display:'inline-block'}} key={i}>
                    <img  style={{width: 50, height:50}} src={image} className="image-gallery-thumbnail" id={this.state.thumbTag + "-img-thumb-"+i} onClick={this.onThumbClick.bind(this, i)}/>
                    <span style={{display:'block'}}><a href="#" id={i}  onClick={this.removeImage.bind(this)}>{t("Delete")}</a>
                    </span>
                </li>
            )
        })

        return (
            <div>
                <div className="form-group col-xs-12">
                    <div className="carousel-inner image-upload-form mt-30">
                    {(imgUrlList.length) ?
                        <Carousel showThumbs={false} showArrows={false} selectedItem={this.state.thumbIndex} >
                            {
                                imgUrlList.map((item, i) => {
                                    return(
                                        <div  key={i}>
                                            <img src= {item}/>
                                        </div>
                                    )
                                })
                            }
                        </Carousel>
                        :null}
                    </div>
                    <div>
                        <ul id={this.state.thumbTag + "-img-thumb-edit"}>
                            {list}
                        </ul>
                    </div>
                </div>
                <div className="form-group col-xs-12">
                    <div className="fileUpload btn btn-default">
                        <span>+{t("Upload")}</span>
                        <input type="file" className="upload" disabled={this.state.disable} onChange={this.uploadImg.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default TranslationWrapper(translate("MultipleImageUploader")(MultipleImageUploader));
