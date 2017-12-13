import React, { Component } from "react"

import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"
import Rating  from 'react-rating';
import base64 from 'base-64';
import utf8 from 'utf8';
import { deleteFavourite } from '../../actions/actions'

class MyFavouritesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favourites: [],
            ajaxLoading: true,
            offset: 0,
            recordPerPage:2,
            totalRecord: 0,
            currentTotalShowing: 0,
            searchBy: "property_name",
            sortBy: ""
        }

    }

    componentDidMount() {
        if(userLoggedIn) {
            this.getFavourites();
        }
    }

    getFavourites(){
        var url = baseMVacationApiUrl + "/user/0/favorite?offset=0&size="+ this.state.recordPerPage +"&orderBy=latest";
        var self = this;

        let onSuccessMethod = (data) => {
            self.setState({
                favourites: data.items,
                ajaxLoading: false,
                totalRecord: data.total,
                currentTotalShowing: (parseInt(data.offset) + 1) * (data.length),
                offset: data.offset
            });
        }

        let onFailMethod = (err) => {
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
        var selectorJson = {};

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

        let sortBy = $( "#fevou-list-sort-by" ).val();
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

        var bytes = utf8.encode(JSON.stringify(selectorJson));
        var encoded = base64.encode(bytes);

        var url = baseMVacationApiUrl + "/user/0/favorite?offset=" + offset +"&size=" + size +"&orderBy="+ orderBy+"&selector=" + encoded;
        var self = this;
        $("#ajax-loader-general").show();

        let onSuccessMethod = (data) => {
            self.setState({
                favourites: data.items,
                ajaxLoading: false,
                totalRecord: data.total,
                currentTotalShowing: (parseInt(data.offset) + 1) * (data.length),
                offset: data.offset
            });
            $("#ajax-loader-general").hide();
        }

        let onFailMethod = (err) => {
            console.log("error");
            self.setState({
                ajaxLoading: false
            });
            $("#ajax-loader-general").hide();
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    switchSortBy(e){
        this.setState({
            sortBy: e.target.value
        });
        this.makeAjaxCall(0, this.state.recordPerPage);
    }

    makeSearch(){
        let recordPerPage = this.state.recordPerPage;
        this.makeAjaxCall(0, recordPerPage);
    }

    showMore(){
        let size = this.state.currentTotalShowing + this.state.recordPerPage;
        this.makeAjaxCall(0, size)
    }

    deleteFavorite(i){
        var arr = this.state.favourites;
        arr.splice(i,1);
        this.setState({favourites:arr,
            ajaxLoading: false,
            totalRecord:this.state.totalRecord-1,
            currentTotalShowing:this.state.currentTotalShowing-1,
            offset:this.state.offset-1
        });
    }

    remove(e){
        e.preventDefault();
        let favourite_id = e.target.id;
        let index = e.target.name;
        //this.deleteFavorite(e.target.name);
        const self = this;
        bootbox.confirm({
            title: 'Delete Favorite',
            message: 'Are you sure',
            buttons: {
                cancel: {
                    label: '<i className="fa fa-times"></i>' + 'Cancel'
                },
                confirm: {
                    label: '<i className="fa fa-check"></i>' +  'Confirm'
                }
            },
            callback: function (result) {
                if(result){
                    self.deleteFavorite(index);
                    self.props.store.dispatch(
                        deleteFavourite(
                            favourite_id
                        )
                    );
                }

            }
        });
    }


    render() {
        const {t} = this.props;
        if(userLoggedIn) {
            return (
                <div className="container" style={{maxWidth:'1200px',margin:'0 auto'}}>
                    <div className="row header-search">
                        <div className="center page-section-title">{t("Favourite list")}</div>
                        <div className="divider"></div>
                        <div className="col-md-6">
                            <div className="input-group" id="adv-search">
                                <input type="text" className="form-control" id="searchText" placeholder={t("Search")}/>
                                <div className="input-group-btn">
                                    <div className="btn-group" role="group">
                                        <div className="dropdown dropdown-lg">
                                            <button type="button" className="btn btn-default dropdown-toggle"
                                                    data-toggle="dropdown" aria-expanded="false"><span
                                                className="caret"></span></button>
                                            <div className="dropdown-menu dropdown-menu-right" role="menu">
                                                <form className="form-horizontal" role="form">
                                                    <div className="form-group">
                                                        <label htmlFor="filter">{t("Filter by")}</label>
                                                        <select className="form-control" onChange={this.switchSearchBy.bind(this)}>
                                                            <option value="property_name">{t("Property name")}</option>
                                                            <option value="host_name">{t("Host name")}</option>
                                                        </select>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <button type="button" className="btn btn-warning" onClick={this.makeSearch.bind(this)}><span
                                            className="glyphicon glyphicon-search" aria-hidden="true"></span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div className="space-50 visible-sm visible-xs"></div>
                        <div className="col-md-4 col-sm-12 col-xs-12">
                            <select className="form-control"  onChange={this.switchSortBy.bind(this)} id="fevou-list-sort-by">
                                <option value="sort_by">{t("Sort by")}</option>
                                <option value="latest">{t("Latest")}</option>
                                <option value="most_popular">{t("Most popular")}</option>
                                <option value="lower_price">{t("Lower price")}</option>
                                <option value="higher_price">{t("Higher price")}</option>
                                <option value="alphabetic_order">{t("Alphabetical Order")}</option>
                            </select>
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-12 pull-left"><h4>{this.state.totalRecord  > 0 ? 1:0}
                            - {this.state.currentTotalShowing} of {this.state.totalRecord}</h4></div>
                    </div>


                    { this.state.ajaxLoading == false ?
                        this.state.favourites.length > 0 ?
                            this.state.favourites.map((item, i) => {
                                let image = getFeaturedImage(item);
                                return (
                                    <div className="horizontal-listing">
                                        <div className="list-card-panel col-xs-12 col-md-12">
                                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                                                <div className="img-bg">
                                                    <a href={ baseCmsUrl + "/accommodation/" + item.id}><img
                                                        src={image}/></a>
                                                </div>
                                                <div className="property-price-tag visible-xs">
                                                    { currencyCode == "USD" ? "$" : "¥"}{convertCurrency(zformat(item.displayPrice))}
                                                </div>
                                            </div>
                                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 pull-right">
                                                <div className="clearfix room-details">
                                                    <div  className="pull-right room-price col-md-3 hidden-sm hidden-xs"> { currencyCode == "USD" ? "$" : "¥"}{convertCurrency(zformat(item.displayPrice))} </div>
                                                    <div className="visible-sm visible-xs mt-20 "></div>
                                                    <div className="room-title nopadding-l-f col-md-9 col-sm-9 col-xs-9"><a href={ baseCmsUrl + "/accommodation/" + item.id}>{item.name}</a></div>

                                                </div>

                                                <div className="room-details">
                                                    <ul className="font-thin nopadding-l-f ">
                                                        <li><i className="fa fa-map-marker"
                                                               aria-hidden="true">&nbsp;</i>{item.address != null ? item.address.city : ""}.{item.address != null && item.address.country != null ? item.address.country.name : ""}
                                                        </li>
                                                        <br />
                                                        <li><i className="fa fa-users">&nbsp;</i>{item.capacity}</li>
                                                        <br />
                                                        <li>
                                                            <Rating
                                                                initialRate={item.accomodationRating != null ? zformat(item.accomodationRating.average) : 0}
                                                                empty="fa fa-star-o" style={{color: '#ff6043'}}
                                                                full="fa fa-star"
                                                                fractions={4}
                                                                readonly
                                                            />&nbsp;
                                                            <li>{item.accomodationRating != null ? zformat(item.accomodationRating.average) : " 0.0"}</li>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div
                                                    className="property-description font-thin col-md-12 col-lg-12 col-xs-12 col-sm-12 nopadding-l-f">
                                                    {item.description}
                                                </div>
                                                <div className="trash pull-right"><a href="javascript:void(0);" onClick={this.remove.bind(this)} id={item.id} name={i}><li className="glyphicon glyphicon-trash"></li>{t("Delete")}</a></div>
                                             </div>
                                        </div>
                                    </div>
                                )
                            }) :
                            <div className="col-md-12 pull-left" style={{"padding": "0px"}}>
                                <div className="alert alert-info alert-dismissable">
                                    <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}}
                                          className="glyphicon glyphicon glyphicon-ok-circle"></span>
                                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                    <strong>{t("Info")}!</strong> {t("Nothing found in you favourite list")}!.
                                </div>
                            </div>
                        : <div className="col-md-12 pull-center ajax-loading"></div>
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

export default TranslationWrapper(translate("MyFavouritesList")(MyFavouritesList));
