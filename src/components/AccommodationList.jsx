//external
import React, { Component } from "react"
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import base64 from 'base-64';
import utf8 from 'utf8';

// internal
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"
import Rating  from 'react-rating';

class AccommodationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accommodations: [],
            ajaxLoading: true,
            page: 1,
            offset: 0,
            recordPerPage: 2,
            totalRecord: 0,
            currentTotalShowing: 0,
            searchBy: "property_name",
            sortBy: "",
        }
    }

    componentDidMount() {
        if(userLoggedIn){
            this.loadUserAccommodations(this.state.offset);
        }

    }

    loadUserAccommodations(offset){
        var self = this;
        var selectorJson = {
            ownerId: 0
        };

        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);
        //var url = baseMVacationApiUrl + "/accomodation?offset=" + offset + "&size=" + this.state.recordPerPage + "&orderBy=latest&selector=" + encoded;
        var url = baseMVacationApiUrl + "/user/0/accomodation?offset=" + offset + "&size=" + this.state.recordPerPage + "&orderBy=latest&selector=" + encoded;

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

    switchSearchBy(e){
        this.setState({
            searchBy: e.target.value
        });
        $('#searchText').val('');
    }

    makeAjaxCall(offset, size){

        var searchText = $("#searchText").val();
        var selectorJson = {
            ownerId: 0
        };

        //console.log("Search text:" + searchText);

        if(this.state.searchBy != "" && searchText != "" ){
            switch(this.state.searchBy) {
                case "property_name":
                    selectorJson.name = searchText;
                    break;
                case "host_name":
                    selectorJson.ownerName = searchText;
                    break;
                default:

            }
        }

        let sortBy = $( "#acco-list-sort-by" ).val();
        let orderBy = "";
        switch(sortBy) {
            case "sort_by":
                orderBy = "latest";
                break;
            case "latest":
                orderBy = "latest";
                break;
            case "most_popular":
                orderBy = "rating";
                break;
            case "lower_price":
                orderBy = "lower_price";
                break;
            case "higher_price":
                orderBy = "higher_price";
                break;
            case "name":
                orderBy = "name";
                break;
            default:

        }


        console.log(orderBy)
        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);

        //var url = baseMVacationApiUrl + "/accomodation?offset=" + offset +"&size=" + size + "&orderBy="+ orderBy +"&selector=" + encoded;
        var url = baseMVacationApiUrl + "/user/0/accomodation?offset=" + offset + "&size=" + size + "&orderBy=latest&selector=" + encoded;
        var self = this;
        $("#ajax-loader-general").show();

        let onSuccessMethod = (data) => {
            self.setState({
                accommodations: data.items,
                totalRecord: data.total,
                currentTotalShowing: (parseInt(data.offset) + 1) * (data.length),
                offset: data.offset
            });
            $("#ajax-loader-general").hide();
        }

        let onFailMethod = (err) => {
            $("#ajax-loader-general").hide();
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    showMore(){
        let size = this.state.currentTotalShowing + this.state.recordPerPage;
        this.makeAjaxCall(0, size)
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

    render() {
        const {t} = this.props;

        if(userLoggedIn){
            return (
                    <div className="container" style={{maxWidth:'1200px',margin:'0 auto'}}>
                    <div className="row header-search">
                        <div className="center page-section-title">{t("Accommodation list")}</div>
                        <div className="divider"></div>
                        <div className="col-md-6">
                            <div className="input-group" id="adv-search">
                                <input type="text" className="form-control" id="searchText" placeholder={t("Search")} />
                                <div className="input-group-btn">
                                    <div className="btn-group" role="group">
                                        <div className="dropdown dropdown-lg">
                                            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span className="caret"></span></button>
                                            <div className="dropdown-menu dropdown-menu-right" role="menu">
                                                <form className="form-horizontal" role="form">
                                                    <div className="form-group">
                                                        <label htmlFor="filter">{t("Filter By")}</label>
                                                        <select className="form-control" onChange={this.switchSearchBy.bind(this)}>
                                                            <option value="property_name">{t("Property name")}</option>
                                                            <option value="host_name">{t("Host name")}</option>
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
                        <div className="col-md-4 col-sm-12 col-xs-12">
                            <select className="form-control" onChange={this.switchSortBy.bind(this)} id="acco-list-sort-by">
                                <option value="sort_by">{t("Sort by")}</option>
                                <option value="latest">{t("Latest")}</option>
                                <option value="most_popular">{t("Most popular")}</option>
                                <option value="lower_price">{t("Lower price")}</option>
                                <option value="higher_price">{t("Higher price")}</option>
                                <option value="name">{t("Alphabetic order")}</option>
                            </select>
                        </div>
                        <div className="col-md-2 offset-md-1 pull-right col-xs-12 col-sm-12">
                            <div className="space-50 visible-sm visible-xs"></div>
                            <a href={ baseCmsUrl + "/accommodation"}  className="btn square-btn outline mb-20"><i className="fa fa-plus" aria-hidden="true"></i>{t("Add new")}</a>
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-12 pull-left"><h4>{this.state.totalRecord > 0 ? 1 : 0} - {this.state.currentTotalShowing} of {this.state.totalRecord}</h4></div>
                    </div>

                    { this.state.ajaxLoading == false ?
                        this.state.accommodations.length > 0 ?
                            this.state.accommodations.map((item, i) => {
                                let image = getFeaturedImage(item);
                                return (
                                    <div className="horizontal-listing">
                                        <div className="list-card-panel col-xs-12 col-md-12" >
                                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                                                <div className="img-bg">
                                                    <a href={ baseCmsUrl + "/accommodation/"+ item.id}><img src={image} /></a>
                                                </div>
                                                <div className="property-price-tag visible-xs">
                                                    { currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(zformat(item.displayPrice))}
                                                </div>
                                            </div>
                                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12  room-details pull-right">
                                                <div className=" room-details">
                                                    <div className="pull-right room-price col-md-3 hidden-sm hidden-xs"> { currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(zformat(item.displayPrice))} </div>
                                                    <div className="visible-sm visible-xs"></div>
                                                    <div className="room-title col-md-9 col-sm-12 col-xs-12" > <a href={ baseCmsUrl + "/accommodation/"+ item.id}>{item.name}</a></div>

                                                </div>

                                                <div className="room-details" >
                                                    <ul className="location-info ">
                                                        <li>&nbsp;</li>
                                                        <br/>
                                                        <li>
                                                            <span className="calender-icon "><a href={  baseCmsUrl + "/price-calendar/" + item.id}><i className="fa fa-calendar-check-o" aria-hidden="true" ></i>{t("Price calender")}</a></span>
                                                        </li>
                                                        <br />
                                                        <li><i  className="fa fa-map-marker" aria-hidden="true">&nbsp;</i>{item.address.city}.{item.address != null && item.address.country != null ? item.address.country.name : ""}</li>
                                                        <br />
                                                        <li>{t("People")} : <i className="fa fa-users">&nbsp;</i>{item.capacity}</li>
                                                        <br />
                                                            <li>{t("Review")}  :
                                                                <Rating
                                                                    initialRate={item.accomodationRating != null && item.accomodationRating.average != null ? zformat(item.accomodationRating.average) : null}
                                                                    empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                                    full="fa fa-star"
                                                                    fractions={4}
                                                                    readonly
                                                                />&nbsp;
                                                                <li>{item.accomodationRating != null ? zformat(item.accomodationRating.average) : " 0.0"}</li>
                                                            </li>
                                                    </ul>
                                                </div>

                                                <div className="property-description col-md-12 col-lg-12 col-xs-12 col-sm-12">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) :
                            <div className="col-md-12 pull-left" style={{"padding": "0px"}}>
                                <div className="alert alert-info alert-dismissable" >
                                    <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}} className="glyphicon glyphicon glyphicon-ok-circle"></span>
                                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                    <strong>{t("Info")}!</strong> {t("No Accommodations found")}!.
                                </div>
                            </div>
                        : <div className="col-md-12 pull-center ajax-loading" ></div>
                    }
                    {
                        this.state.ajaxLoading != true && this.state.currentTotalShowing < this.state.totalRecord ?
                            (
                                <div className="" style={{maxWidth: "1200px", marginBottom: "5em"}}>
                                    <a href="javascript:void(0)" onClick={this.showMore.bind(this)} className="btn btn-info pull-right" style={{borderRadius : "0px"}}>{t("Show more")}</a>
                                </div>) : null

                    }

                </div>

        )
        } else {
            return (
                <div className="container" style={{ "marginTop": "6em"}}>
                    <div className="alert alert-info alert-dismissable">
                        <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}} className="glyphicon glyphicon-remove-circle"></span>
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>{t("Info")}!</strong> {t("This page is available only for authenticated user")}.
                    </div>
                </div>
            )
        }
        
    }
}

export default TranslationWrapper(translate("AccommodationList")(AccommodationList));
