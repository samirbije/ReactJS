//external
import React, { Component } from "react"
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';
// internal




import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"
import TextFieldGroup from './common/TextFieldGroup';



class MyTripsMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            itineraries: []
        }

    }


    componentWillMount() {
        this.getItineraries();
    }
/*
    componentDidMount() {
        this.getItineraries();
    }
*/
    timeConverter(timestamp){
        var n = Number(timestamp);
        var a = new Date(n);

        var year = a.getFullYear();
        var month = parseInt(a.getMonth()) + 1;
        var date = a.getDate();


        return month + "." + date + "." + year;
    }

    getItineraries(){

        var selectorJson = {
            "userId": 0
        };
        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);

        //baseMVacationApiUrl + '/accomodation/private?orderBy=id&offset=0&size=1&selector=' + encoded

        var url = baseMVacationApiUrl + "/reservation?offset=0&size=-1&selector=" + encoded;
        //var url = baseMVacationApiUrl + "/user/0/reservation/"+ this.props.mode;
        var self = this;

        let onSuccessMethod = (data) => {
            var itineraries = [];
            data.items.forEach(function (item) {
                var row = {
                    id: item.id,
                    accommodationName: item.accomodation.name,
                    hostName: item.accomodation.owner.firstName + " " + item.accomodation.owner.lastName,
                    dateFrom: item.startDate,
                    dateTo: item.endDate,
                    totalGuest: item.numberOfGuest,
                    propertyImage: item.accomodation.featuredPicture.url,
                    propertyImageId: item.accomodation.featuredPicture.id,
                    totalCost: zformat(item.accomodation.displayPrice),
                    city: item.accomodation.address.city,
                    country: (item.accomodation.address.country) ? item.accomodation.address.country.name : ""
                }

                itineraries.push(row)
            })

            self.setState({
                itineraries: itineraries
            });

        }

        let onFailMethod = (err) => {
            console.log("error");
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    render() {
        const {t} = this.props;

        //var {mode} = this.props;



        //if (this.state.itineraries.length > 0){
        return (
            <div className="my-trips-container">
                <div className="item-title" style={{borderBottom: "none"}}>
                    <h5>{t("List of trips")}<span className="pull-right">{(this.state.itineraries.length)} <a href={ baseCmsUrl + "/itinerary-list" }>{t("Items")}</a></span></h5>
                    <div className="divider"></div>
                </div>
                <ul className="scrollable-menu">

                    { (this.state.itineraries.length > 0) ?
                        this.state.itineraries.map((item, i) => {
                        return (
                                <li key={i} className="favorite-list">
                                    <span className="item row">
                                        <span className="item-left col-sm-3">
                                            <a href={baseCmsUrl+"/reservation-details/"+ item.id}><img  className="responsive" src={item.propertyImage != "" ? baseMVacationApiUrl + "/media/"+ item.propertyImageId + "/data?size=70x70" : baseCmsUrl + "/storage/app/media/default-images/70x70.png" }  height="70px" width="70px" /></a>
                                        </span>
                                        <span className="item-info pull-right col-sm-8">
                                            <ul>
                                                <li><strong><a href={baseCmsUrl+"/reservation-details/"+ item.id}>{item.accommodationName}</a></strong> </li><br />
                                                <li>{item.city}.{item.country}</li>
                                                 <li>{item.dateFrom}~{item.dateTo}</li>
                                                <li>{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(item.totalCost)}</li>
                                            </ul>
                                        </span>
                                    </span>
                                </li>
                                    )
                        }) : null
                    }



                </ul>
            </div>
        )

    }
}

export default TranslationWrapper(translate("MyTripsMenu")(MyTripsMenu));
