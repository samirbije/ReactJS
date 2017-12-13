//external
import React, { Component } from 'react'
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
// internal

class RoomIntro  extends Component {
    /**
     * constructor
     * @param {object} props
     */
    constructor(props) {
        super(props);
        /**
         * @type {object}
         * @property {string} AppPost  Apps
         */
        this.state = {

        };
    }


    render() {
        const { t } = this.props;
        return (

                <div>
                    <h3 className="">{this.props.roomName}</h3>
                    <br/>
                    <div className="room-intro-shortdesc mb-100">
                    <span className="room-intro-localisation"><i className="icon-location-pin"></i> {this.props.state} , {this.props.city} </span>
                        <span className="room-intro-localisation"><i className="icon-home"></i> {this.props.propertyType} </span>
                    <span className="room-intro-localisation"><i className="icon-people"></i> {this.props.capacity} </span>
                </div>

                </div>
        );
    }
}
export default TranslationWrapper(translate("RoomIntro")(RoomIntro))
//export default RoomIntro;