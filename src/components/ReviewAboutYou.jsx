//external
import React, { Component } from 'react'
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";

// internal
import ReviewHost from './ReviewHost';
class ReviewAboutYou  extends Component {
    render() {
        return (
            <div className="tab-pane fade in active" id="tab1">
                <ReviewHost translations={translations}/>
             </div>
        );
    }
}
export default TranslationWrapper(translate("ReviewAboutYou")(ReviewAboutYou))
//export default RoomDescription;