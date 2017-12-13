//external
import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"

class ProfileImageUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            src: null,
            cropResult: null
        };
        this.cropImage = this.cropImage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.onStart = this.onStart.bind(this);
    }

    onChange(e) {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({ src: reader.result });
        };
        if(files && files.length > 0){
            reader.readAsDataURL(files[0]);
        }
    }

    cropImage(e) {
        e.preventDefault();
        if(this.cropper.getCroppedCanvas()){
            this.setState({
                cropResult: this.cropper.getCroppedCanvas().toDataURL()
            });
        }
    }

    uploadImage(e) {
        e.preventDefault();
        let self = this;
        let dataUrl = this.state.cropResult;
        if(dataUrl){
            fetch(dataUrl)
            .then(res => res.blob())
            .then(image => {
                self.props.uploadImg(image);
            })
            .then($("#fileUploader").modal("hide"))
            .catch( (err) => {
                console.log("image dataUrl error");
                console.log(err);
                });
        }
    }

    onStart(e) {
        e.preventDefault();
        //console.log("accessed on start")
        this.setState({
            src: null,
            cropResult: null
        })
    }

    render() {
        const { t } = this.props;
        return (
            <div>
            <div className="fileUpload btn btn-default" data-toggle="modal" data-target="#fileUploader" onClick={this.onStart}>
                <h5>{t("File upload")}<span> <strong>+</strong></span></h5>
            </div>
            <div className="modal fade" id="fileUploader" role="dialog">
                <div className="modal-dialog" style={{ maxWidth: "500px"}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ width: '100%' }}>
                                <div className="fileUpload btn btn-default">
                                    <input type="file" className="upload" id="profile-image-upload" onChange={this.onChange} />
                                    <h6>{t("Select File")}</h6>
                                </div>
                                <Cropper style={{ maxHeight: 300, width: '100%' }}
                                    scalable={false}
                                    zoomable={true}
                                    rotatable={true}
                                    checkOrientation={true}
                                    guides={false}
                                    aspectRatio={4 / 4}
                                    src={this.state.src}
                                    ref={cropper=> { this.cropper = cropper; }}
                                    />
                            </div>
                            <div className="divider"/>
                            <div>
                                <div className="fileUpload btn btn-default" style={{"float" : "left"}} onClick={this.cropImage}><h6>{t("Crop Image")}</h6></div>
                                <div className="upload-box" style={{ width: '100%'}}>
                                    <img style={{ width: '100%' }} src={this.state.cropResult} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div type="button" className="fileUpload btn btn-default" data-dismiss="modal"><h6>{t("Close")}</h6></div>
                            <div className="fileUpload btn btn-default" style={{"float" : "left"}} onClick={this.uploadImage}><h6>{t("Save Image")}</h6></div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default TranslationWrapper(translate("UserProfile")(ProfileImageUpload));
