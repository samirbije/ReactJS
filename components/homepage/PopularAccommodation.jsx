//external
import React, { Component } from "react"
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"
import Rating  from 'react-rating';

// internal
import FavouriteWidget from "../favourites/FavouriteWidget";
import PopularAccommodationContent from "./PopularAccommodationContent";

class PopularAccommodation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accommodations: [],
            ajaxLoading: true,
            offset: 0,
            recordPerPage: 8,

        }
    }

    componentDidMount() {
        this.loadUserAccommodations(this.state.offset, this.state.recordPerPage);
    }

    loadUserAccommodations(offset, size) {
        var self = this;
        //console.log("accessed load accomodation");
        var url = baseMVacationApiUrl + "/accomodation?offset=" + offset + "&size=" + size + "&orderBy=rating";

        let onSuccessMethod = (data) => {
            self.setState({
                accommodations: data.items,
                ajaxLoading: false,
                totalRecord: data.total,
                currentTotalShowing: (parseInt(data.offset) + 1) * (data.length),
                offset: data.offset
            });
        }

        let onFailMethod = (err) => {
            console.log("error");
            self.setState({
                ajaxLoading: false
            });
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    render() {
        const {t} = this.props;
        let accommodations = [];
        accommodations = this.state.accommodations;
        let size = accommodations.length
        let topHalf = accommodations.slice(0, size/2);
        let secondHalf = accommodations.slice(size/2, size);

        return (
            <div className="container">
                <div className="row property-list-line">
                    <div className="center section-title">
                        {t("POPULAR ACCOMMODATION LIST")}
                    </div>
                    <PopularAccommodationContent items={topHalf} {...this.props}/>
                </div>
                <div className="row">
                    <PopularAccommodationContent items={secondHalf} {...this.props}/>
                </div>
                <div className="pull-right view-more"><a href={baseCmsUrl+"/search-result?destination=&calender=&guests=1&child=0&orderBy=rating"}>{t("See All")} </a> <i className="fa fa-angle-right" aria-hidden="true"></i> </div>
            </div>

        )

    }
}

export default TranslationWrapper(translate("PopularAccommodation")(PopularAccommodation));
