//external
import React, { Component } from 'react';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";

//internal
import ReviewAboutYou from './ReviewAboutYou';
import ReviewByYou from './ReviewByYou';

class Review extends Component {
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
            tab: null
        }
        this.getUrlTab = this.getUrlTab.bind(this);
    }

    /**
     *Initial call
     *
     */
    componentDidMount() {
        //console.log("accessed here");
        this.state.tab = this.getUrlTab();

        if(this.state.tab =="tab1"){
            $("#navTab2").removeClass("active");
            $("#tab2").removeClass("active in");
            $("#navTab1").addClass("active");
            $("#tab1").addClass("active in");
        }

        if(this.state.tab == "tab2"){
            $("#navTab1").removeClass("active");
            $("#tab1").removeClass("active in");
            $("#navTab2").addClass("active");
            $("#tab2").addClass("active in");
        }
    }

    /**
     * id from URL params
     *
     */
    getUrlTab() {
        var tab = location.href.substr(location.href.lastIndexOf('#') + 1);
        return tab;
    }

    /**
     *Initial call
     *
     */

    render() {
        const { t } = this.props;
        if(userLoggedIn){
            return (
                <div className="container">
                    <div class="row content-body">
                        <div className="space-50"></div>
                        <div className="section-title">
                            {t("Review")}
                        </div>
                        <ul className="nav nav-tabs">
                            <li className="active sliding-middle-out" id="navTab1"><a href="#tab1" data-toggle="tab">{t("Review about you")}</a></li>
                            <li className="sliding-middle-out" id="navTab2"><a href="#tab2" data-toggle="tab">{t("Your review")}</a></li>
                        </ul>
                        <div className="tab-content">
                                <ReviewAboutYou translations={translations}/>
                                <ReviewByYou translations={translations}/>
                        </div>
                    </div>
                </div>
            );
    } else {
            return (
                <div className="container" style={{marginTop: "6em"}}>
                <div className="alert alert-danger alert-dismissable">
                <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}} className="glyphicon glyphicon-remove-circle"></span>
                <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                <strong>{t("Info")}!</strong> {t("This page is available only for authenticated user")}
                </div>
                </div>
                )
        }
    }
}
export default TranslationWrapper(translate("Review")(Review))