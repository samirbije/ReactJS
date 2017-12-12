//external
import React, { Component } from 'react'
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";

// internal
import ReviewToWrite from './ReviewToWrite';

class ReviewByYou  extends Component {
    render() {
        //const { t } = this.props;
        return (
            <div className="tab-pane fade in" id="tab2">
                <ReviewToWrite translations={translations}/>

            </div>
        );
    }
}
export default TranslationWrapper(translate("ReviewByYou")(ReviewByYou))
//export default RoomDescription;