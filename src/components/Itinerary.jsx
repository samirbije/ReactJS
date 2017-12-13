//external
import React, { Component } from "react"
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';

// internal




import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"
import Rating  from 'react-rating';



class Itinerary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clearable: false,
            sortCriteria: "",
            searchBy: "property_name",
            searchText: "",
            itineraries: [],
            ajaxLoading: true,
            length: 0,
            totalRecord: 0,
            currentTotalShowing: 0,
            offset: 0,
            recordPerPage:2
        }
        //this.uploadImg = this.uploadImg.bind(this);

       // this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentDidMount() {
        if(userLoggedIn) {
            this.getItineraries();
        }
    }

    /*
    componentWillMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount(){
        window.removeEventListener('keydown', this.handleKeyDown);
    }
     */
    handleKeyDown(e) {
        console.log(e);
    }


    timeConverter(timestamp){
        var n = Number(timestamp);
        var a = new Date(n);

        var year = a.getFullYear();
        var month = parseInt(a.getMonth()) + 1;
        var date = a.getDate();


    return month + "." + date + "." + year;
}

    getItineraries(){
        var selectorJson = {};

        if( this.props.mode == "inbound"){
            selectorJson.userId = 0;
        } else if(this.props.mode == "outbound") {
            selectorJson.hostId = 0;
        }

        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);
        var url = baseMVacationApiUrl + "/reservation?offset=0&size="+  this.state.recordPerPage + "&orderBy=date&selector=" + encoded;
        //var url = baseMVacationApiUrl + "/user/0/reservation/"+ this.props.mode;

        var self = this;

        let onSuccessMethod = (data) => {
            var itineraries = [];
            data.items.forEach(function (item) {
                var row = {
                    id: item.id,
                    accomodationId: item.accomodation.id,
                    accommodationName: item.accomodation.name,
                    hostName: self.props.mode == "inbound" ? item.accomodation.owner.firstName + " " + item.accomodation.owner.lastName : item.user.firstName + " " + item.user.lastName,
                    dateFrom: moment(item.startDate).format("MM.DD.YYYY"),//self.timeConverter(item.startDate),
                    dateTo: moment(item.endDate).format("MM.DD.YYYY"),//self.timeConverter(item.endDate),
                    totalGuest: item.numberOfGuest,
                    propertyImage: item.accomodation.featuredPicture.url,
                    propertyImageId: item.accomodation.featuredPicture.id,
                    location: item.accomodation.address.city + "." + item.accomodation.address.country.name,
                    rating: item.accomodation.accomodationRating != null ? zformat(item.accomodation.accomodationRating.average) : "0.0",
                    displayPrice: zformat(item.accomodation.displayPrice),
                    status: item.status

                }

                itineraries.push(row)
            })

            self.setState({
                itineraries: itineraries,
                ajaxLoading: false,
                totalRecord: data.total,
                currentTotalShowing: (parseInt(data.offset) + 1) * (data.length),
                offset: data.offset
            });
        }

        let onFailMethod = (err) => {
            console.log("error");
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
        }


    getCurrentLoggedInUserId() {
        var url = baseMVacationApiUrl + "/user/0";
        let self = this;
        //console.log("owner:"+this.props.owner);
        //console.log("owner:"+this.state.owner);

        let onSuccessMethod = (data) => {
            self.setState({
                currentLoggedInUserId: data.id
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    makeAjaxCall(offset, size, reset = true){

        var searchText = $("#searchText").val();
        var selectorJson = {};

        if( this.props.mode == "inbound"){
            selectorJson.userId = 0;
        } else if(this.props.mode == "outbound") {
            selectorJson.hostId = 0;
        }

        //console.log("Search by:" + this.state.searchBy);
        //console.log("Search text:" + this.state.searchText);
        //console.log("Search text:" + searchText);
        //&& parseInt(this.state.searchText.length) > 3
        if(this.state.searchBy != "" && searchText != "" ){
            switch(this.state.searchBy) {
                case "property_name":
                    selectorJson.accomodationName = searchText;
                    break;
                case "guest_name":
                    selectorJson.userName  = searchText;
                    break;
                case "host_name":
                    selectorJson.hostName = searchText;
                    break;
                default:

            }
        }

        let sortBy = $( "#acco-list-sort-by" ).val();
        let orderBy = "";
        switch(sortBy) {
            case "sort_by":
                orderBy = "date";
                break;
            case "latest":
                orderBy = "date";
                break;
            case "most_popular":
                orderBy = "guestreview_likes";
                break;
            case "lower_price":
                orderBy = "price_asc";
                break;
            case "higher_price":
                orderBy = "price_desc";
                break;
            case "name":
                orderBy = "acc_name";
                break;
            default:

        }


        //console.log(selectorJson)
        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);
        var url = baseMVacationApiUrl + "/reservation?offset="+ offset +"&size="+ size  + "&orderBy="+ orderBy + "&selector=" + encoded;
        var self = this;

        $("#ajax-loader-general").show();

        let onSuccessMethod = (data) => {
            var itineraries = [];

            data.items.forEach(function (item) {
                var cityName = "";
                var countryName = "";
                if(item.accomodation.address != null){
                    cityName = item.accomodation.address.city;
                    if(item.accomodation.address.country != null){
                        countryName = item.accomodation.address.country.name;
                    }
                }

                var row = {
                    id: item.id,
                    accomodationId: item.accomodation.id,
                    accommodationName: item.accomodation.name,
                    hostName: self.props.mode == "inbound" ? item.accomodation.owner.firstName + " " + item.accomodation.owner.lastName : item.user.firstName + " " + item.user.lastName,
                    dateFrom: item.startDate,
                    dateTo: item.endDate,
                    totalGuest: item.numberOfGuest,
                    propertyImage: item.accomodation.featuredPicture.url,
                    propertyImageId: item.accomodation.featuredPicture.id,
                    location: cityName + "." + countryName,
                    rating: item.accomodation.accomodationRating != null ? item.accomodation.accomodationRating.average : "0.0",
                    displayPrice: item.accomodation.displayPrice,
                    status: item.status
                }
                itineraries.push(row)
            })


            self.setState({
                itineraries: reset == false ? self.state.itineraries.concat(itineraries) : itineraries,
                totalRecord: data.total,
                currentTotalShowing: reset == false ? (self.state.currentTotalShowing) + (data.length) :(parseInt(data.offset) + 1) * (data.length),
                offset: data.offset
            });
            $("#ajax-loader-general").hide();
        }

        let onFailMethod = (err) => {
            //console.log("error");
            $("#ajax-loader-general").hide();
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    handleSubmit(e) {
        e.preventDefault();

    }

    onInputChange(e) {
        this.setState({[e.target.name]: e.target.value});
        let recordPerPage = this.state.recordPerPage;
        this.makeAjaxCall(0, recordPerPage);
    }

    makeSearch(){
        let recordPerPage = this.state.recordPerPage;
        this.makeAjaxCall(0, recordPerPage);
    }

    switchSortBy(e){
        this.setState({
            sortBy: e.target.value
        });
        this.makeAjaxCall(0, this.state.recordPerPage);
    }

    switchSortingOrder(newValue){
        this.setState({
            sortCriteria: newValue
        });
    }

    switchSearchBy(e){
        this.setState({
            searchBy: e.target.value
        });
        $('#searchText').val('');
    }

    showMore(){
        let newOffset = this.state.offset + this.state.recordPerPage;
        let recordPerPage = this.state.recordPerPage;
        this.makeAjaxCall(newOffset, recordPerPage, false)
    }

    getStatus(status){
        const {t} = this.props;
        let tStatus = '';
        switch(status) {
            case "CREATED":
                tStatus = t("Pending");
                break;
            case "APPROVED":
                tStatus = t("Approved");
                break;
            case "CANCEL_BY_GUEST":
                tStatus = t("CANCEL BY GUEST");
                break;
            case "CANCEL_BY_HOST":
                tStatus = t("CANCEL BY HOST");
                break;
            case "REJECTED":
                tStatus = t("CANCEL BY HOST");
                break;
            case "CREATED":
                tStatus = t("Pending");
                break;
            default:

        }
        return tStatus;
      }

    render() {
        const {t} = this.props;
        var {mode} = this.props;
        var sortingOrder = [];
        var searchBy = [];

        sortingOrder.push({value: "latest_itinerary_date", label: t("Latest date")});
        sortingOrder.push({value: "most_favourite", label: t("Most favourite")});
        sortingOrder.push({value: "cheapest_price", label: t("Cheapest price")});
        sortingOrder.push({value: "high_price", label: t("Highest price")});
        sortingOrder.push({value: "alphabetic_asc", label: t("Alphabetical Order")});

        searchBy.push({value: "property_name", label: t("Property name")});
        if(this.props.mode == "inbound") {
            searchBy.push({value: "host_name", label: t("Host name")});
        } else if( this.props.mode == "outbound" ){
            searchBy.push({value: "guest_name", label: t("Guest name")});
        }


        var defaultPropertyImages = baseCmsUrl + "/storage/app/media/default-images/250x210.png";
        if(userLoggedIn) {
            return (
                <div className="container" style={{maxWidth:'1200px',margin:'0 auto'}}>
                    <div className="row header-search">
                        <div className="center page-section-title">{t("Reservation List")}</div>
                        <div className="divider"></div>
                        <div className="col-md-8 col-sm-12 col-xs-12 pull-right">
                            <div className="input-group" id="adv-search">
                                <input type="text" className="form-control" placeholder={t("Search")} id="searchText" name="searchText"/>
                                <div className="input-group-btn">
                                    <div className="btn-group" role="group">
                                        <div className="dropdown dropdown-lg">
                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span className="caret"></span></button>
                                            <div className="dropdown-menu dropdown-menu-right" role="menu">
                                                <form className="form-horizontal" role="form">
                                                    <div className="form-group">
                                                        <label htmlFor="filter">{t("Filter by")}</label>
                                                        <select className="form-control" onChange={this.switchSearchBy.bind(this)}>
                                                            <option value="property_name" >{t("Property Name")}</option>
                                                            { this.props.mode == "inbound" ?
                                                              <option value="host_name">{t("Host Name")}</option>
                                                                :
                                                              <option value="guest_name">{t("Guest Name")}</option>
                                                            }
                                                        </select>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-warning" onClick={this.makeSearch.bind(this)}><span className="glyphicon glyphicon-search" aria-hidden="true"></span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-50 visible-sm visible-xs"></div>
                        <div className="col-md-3 col-sm-12 col-xs-12">
                            <select className="form-control" onChange={this.switchSortBy.bind(this)} id="acco-list-sort-by">
                                <option value="sort_by">{t("Sort by")}</option>
                                <option value="latest">{t("Latest date")}</option>
                                <option value="most_popular">{t("Most favourite")}</option>
                                <option value="lower_price">{t("Lower price")}</option>
                                <option value="higher_price">{t("Higher price")}</option>
                                <option value="name">{t("Alphabetical Order")}</option>
                            </select>
                        </div>
                        <div className="space-50 visible-sm visible-xs"></div>
                        {this.state.totalRecord > 0 ?
                            <div className="col-xs-12 col-md-12 col-lg-12 pull-left"><h4>1
                                - {this.state.currentTotalShowing} of {this.state.totalRecord}</h4></div> : null
                        }
                    </div>

                    { this.state.ajaxLoading == false ?
                        this.state.itineraries.length > 0 ?
                            this.state.itineraries.map((item, i) => {
                                return (
                                    <div className="horizontal-listing">
                                        <div className="list-card-panel col-xs-12 col-md-12">
                                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                                                <div className="img-bg">
                                                    <a href={ baseCmsUrl + "/accommodation/"+ item.accomodationId}> <img src={item.propertyImageId != "" ? baseMVacationApiUrl + "/media/"+ item.propertyImageId + "/data?size=250x210" : defaultPropertyImages} /></a>
                                                </div>
                                                <div className="property-price-tag visible-xs">
                                                    { currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(zformat(item.displayPrice))}
                                                </div>
                                            </div>
                                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 pull-right">
                                                <div className="clearfix room-details">
                                                    <div className="pull-right room-price col-md-3 hidden-sm hidden-xs">
                                                        { currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(zformat(item.displayPrice))}
                                                    </div>
                                                    <div className="visible-sm visible-xs mt-20 "></div>
                                                    <div
                                                        className="room-title nopadding-l-f col-md-9 col-sm-9 col-xs-9">
                                                        <a href={ baseCmsUrl + "/accommodation/"+ item.accomodationId}>{ item.accommodationName }</a>
                                                    </div>
                                                </div>
                                                <div className="nopadding-l-f">
                                                    <span> <i className="fa fa-map-marker" aria-hidden="true"></i>{item.location}&nbsp; </span>
                                                    <span><i className="fa fa-user">{ mode == "inbound" ? t('Host') : t('Guest')} </i>&nbsp; &nbsp;{item.hostName}</span><br />
                                                </div>
                                                <div className="room-details">
                                                    <div className="font-bold-title"><a href={ baseCmsUrl + "/reservation-details/"+ item.id}>{item.dateFrom} ~ {item.dateTo}</a></div>
                                                    <ul className="list-inline font-thin nopadding-l-f ">
                                                        <li>{t('People')}<br /><i className="fa fa-users">&nbsp;</i>{item.totalGuest}</li>
                                                        <li>{t('Status')}<br /><i className={item.status=='APPROVED'?"fa fa-check":"fa fa-close"}>    &nbsp; </i>
                                                            <span className={item.status} style={{"color":item.status=='APPROVED'?"green":"red"}}><strong>{this.getStatus(item.status) }</strong></span>
                                                        </li>
                                                        <li>{t('Review')}<br />
                                                            <Rating
                                                                initialRate={item.rating}
                                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                                full="fa fa-star"
                                                                fractions={10}
                                                                readonly
                                                            />
                                                        </li> &nbsp;
                                                        <li>{item.rating ? zformat(item.rating) :"0.0"}</li>
                                                    </ul>
                                                </div>

                                                <div
                                                    className="property-description nopadding-t-b font-thin col-md-12 col-lg-12 col-xs-12 col-sm-12 nopadding-l-f">
                                                    { item.accommodationName }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }):
                            <div className="col-md-12 pull-left" style={{"padding": "0px"}}>
                                <div className="alert alert-warning alert-dismissable" style={{"marginTop": "6em"}}>
                                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                    { this.props.mode == "inbound" ?
                                        <span><strong>{t("Info")}</strong> {t("No itinerary found")}!.</span> :
                                        <span><strong>{t("Info")}!</strong> {t("No reservations found")}!. </span>
                                    }
                                </div>
                            </div> :
                        <div className="col-md-12 pull-right ajax-loading"></div>
                    }

                    {
                        this.state.ajaxLoading != true && this.state.currentTotalShowing < this.state.totalRecord ?
                            (
                                <div className="" style={{maxWidth: "1200px", marginBottom: "5em"}}>
                                <a href="javascript:void(0)" onClick={this.showMore.bind(this)} className="btn btn-info pull-right" style={{borderRadius : "0px"}}>{t("Show More")}</a>
                                </div>) : null
                    }
                </div>
            )
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

export default TranslationWrapper(translate("Itinerary")(Itinerary));
