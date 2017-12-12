import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import base64 from 'base-64';
import utf8 from 'utf8';
import ReactPaginate from 'react-paginate';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
import InputRange from 'react-input-range';
import Rating from 'react-rating';
import Select from 'react-select';
//internal
import SearchResultMap from './SearchResultMap';
import FavouriteWidget from "./favourites/FavouriteWidget";

class SearchResult  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            propertyLists:[],
            latitude:null,
            longitude:null,
            value: { min: 0, max: 90000 },
            aminity:[],
            aminities:[],
            property:[],
            room:[],
            roomList:[],
            propertyList:[],
            minReview:null,
            capacity:'',
            bathRooms:'',
            bedNo:'',
            clearable: false,
            page: 1,
            total:0,
            offset: 0,
            recordPerPage: 18,
            forceSelected:0,
            searchable: this.props.searchable,
            sortBy: "",
            rules: {
                isSmokingAllowed: null,
                isPetsAllowed: null,
                isInfantsAllowed: null
            },
            geo: {
                lat:null,
                lng:null
            },
            ajaxLoading:true,
            address: this.getQueryParams().destination,
            calendar:this.getQueryParams().calendar,
            guests:this.getQueryParams().guests ? parseInt(this.getQueryParams().guests) :1,
            child:this.getQueryParams().child ? parseInt(this.getQueryParams().child):0,
            map:false
        }
        this.onChange = (address) => this.setState({ address })
    }

    /**
     *
     */
    componentDidMount() {
        this.getPropertyType();
        this.getRoomType();
        this.getAminityType();
        if(this.getQueryParams().guests==undefined ){
            this.freeSearchResult();
        }
        else {
            this.getSearchGeoResult();
        }
    }

    switchSortBy(e){
        this.setState({
            forceSelected:0,
            sortBy: e.target.value,
        });
        this.getAdvanceSearchResult(this.state.offset*this.state.recordPerPage);
    }

    /**
     *
     */
    getAdvanceSearchResult(offset) {
        let sortBy = $( "#acco-search-sort-by" ).val();
        let minReview = $("input[name='minReview']:checked").val();
        let orderBy = "";
        switch(sortBy) {
            case "sort_by":
                orderBy = "name";
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

        var calendar    = document.getElementsByName("calender")[0].value;
        var res1 = calendar.replace(/ |,/g,'-');
        var calendar = res1.replace(/[/]/g,'-');

        var guests      = document.getElementsByName("guests")[0].value;
        var child      = document.getElementsByName("child")[0].value;


        this.setState({
            geo: {
                lat:this.state.latitude ? parseFloat(this.state.latitude.toFixed(2)):0,
                lng:this.state.longitude ? parseFloat(this.state.longitude.toFixed(2)):0
            }
        });
        var calender =  calendar.split('---');
        var checkin  = null;
        var checkout = null;
        if(calender!= '') {
            checkin    = moment(calender[0], 'MM-DD-YYYY').format('YYYY-MM-DD');
            checkout   = moment(calender[1], 'MM-DD-YYYY').format('YYYY-MM-DD');
        }
        var searchParum = {
            "id" : null,
            "minReview" : minReview ? minReview : this.state.minReview ,
            "maxReview" : null,
            "minPrice" : this.state.value.min,
            "maxPrice" : this.state.value.max,
            "amenity" : this.state.aminities.length > 0 ? this.state.aminities : null,
            "propertyType" : this.state.propertyList.length > 0 ? this.state.propertyList : null,
            "ownerId"   :null,
            "name":null,
            "rule": this.state.rules,
            "roomType":this.state.roomList.length > 0 ? this.state.roomList : null,
            "nbedrooms":this.state.bedNo,
            "nbathrooms":this.state.bathRooms,
            "longitude" : this.state.longitude,
            "latitude" : this.state.latitude,
            "capacity" : this.state.capacity ? this.state.capacity : (parseInt(guests)+parseInt(child)),
            "begin" :  checkin,
            "end" : checkout
        };
        //console.log('4444' + JSON.stringify(searchParum));
        var bytes = utf8.encode(JSON.stringify(searchParum));
        var encoded = base64.encode(bytes);
        const self = this;
        let url = baseMVacationApiUrl + '/accomodation?orderBy=' + orderBy + '&offset=' + offset + '&size=' +  this.state.recordPerPage + '&selector=' + encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                total: data.total,
                propertyLists: data.items,
                ajaxLoading: false,
            })
        }

        let onFailMethod = (err) => {
            self.setState({
                ajaxLoading: false
            });
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    searchSubmit() {
        var str         = this.state.address;//document.getElementsByName("destination")[0].value ? document.getElementsByName("destination")[0].value : this.getQueryParams().destination ;
        var destination = str.replace(/ |,/g,'-');
        let param = 'sensor=false&address=' + destination;

        this.setState({
            calendar: document.getElementsByName("calender")[0].value
        });
        const self = this;


        let url = 'https://maps.googleapis.com/maps/api/geocode/json?' + param;
        let ctype = "google-api";
        let onSuccessMethod = (data) => {
            self.setState({
                latitude: data.results.length > 0 ? data.results[0].geometry.location.lat:0,
                longitude: data.results.length > 0 ? data.results[0].geometry.location.lng:0
            });
            self.getAdvanceSearchResult(self.state.offset*self.state.recordPerPage);
        }

        let onFailMethod = (err) => {
            //console.log(err.responseText);
            self.getAdvanceSearchResult(self.state.offset*self.state.recordPerPage);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod, ctype);
    }


    /**
     * id from URL params
     *
     */
    getQueryParams() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");

        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }

    /**
     *
     */
    getSearchGeoResult() {
        var address = this.getQueryParams().destination ;
        let param = 'sensor=false&address=' + address;
        const self = this;

        let url = 'https://maps.googleapis.com/maps/api/geocode/json?' + param;
        let ctype = "google-api";
        let onSuccessMethod = (data) => {
            self.setState({
                latitude: data.results.length > 0 ? data.results[0].geometry.location.lat :0,
                longitude: data.results.length > 0 ? data.results[0].geometry.location.lng:0
            });
            self.getSearchResult();
        }

        let onFailMethod = (err) => {
            //console.log(err.responseText);
            self.getSearchResult();
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod, ctype);
    }
    /**
     *
     */
    getSearchResult(){
        //console.log("gggg" + this.getQueryParams().guests);
        var calendar = getQueryParams().calender.replace(/-|,/g,'/');
        var find = '///';
        var re = new RegExp(find, 'g');
        calendar.replace(re, ' - ')
        this.setState({
            geo: {
                lat:this.state.latitude ? parseFloat(this.state.latitude.toFixed(2)):0,
                lng:this.state.longitude ? parseFloat(this.state.longitude.toFixed(2)):0
            },
            calendar: calendar.replace(re, ' - ')
        });
        var calender =  this.getQueryParams().calender.split('---');
        var checkin  = null;
        var checkout = null;
        if(this.getQueryParams().calender!= '') {
            checkin    = moment(calender[0], 'MM-DD-YYYY').format('YYYY-MM-DD');
            checkout   = moment(calender[1], 'MM-DD-YYYY').format('YYYY-MM-DD');
        }
        var order_by = 'name';
        if(this.getQueryParams().orderBy=='rating') {
            order_by='rating';
        }
        var searchParum =
            {
                "id":null,
                "minReview":null,
                "maxReview":null,
                "minPrice":this.state.value.min,
                "maxPrice":this.state.value.max,
                "amenity":null,
                "propertyType":null,
                "ownerId":null,
                "nbedrooms":null,
                "nbathrooms":null,
                "name":null,
                "roomType":null,
                "longitude":this.state.longitude,
                "latitude":this.state.latitude,
                "capacity":(parseInt(this.getQueryParams().guests)+parseInt(this.getQueryParams().child)),
                "begin":checkin,
                "end":checkout
            };

        //console.log("3333" + JSON.stringify(searchParum));
        var bytes = utf8.encode(JSON.stringify(searchParum));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation?orderBy='+ order_by +'&offset=0&size='+ this.state.recordPerPage +'&selector='+encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                propertyLists: data.items,
                ajaxLoading: false
            })
            self.setState({
                total: data.total,
            })
        }

        let onFailMethod = (err) => {
            self.setState({
                ajaxLoading: false
            });
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     */
    freeSearchResult() {
        var address = this.getQueryParams().phrase ;
        let param = 'sensor=false&address=' + address;
        const self = this;

        let url = 'https://maps.googleapis.com/maps/api/geocode/json?' + param;
        let ctype = "google-api";
        let onSuccessMethod = (data) => {
            self.setState({
                latitude: data.results.length > 0 ? data.results[0].geometry.location.lat:0,
                longitude:  data.results.length > 0 ? data.results[0].geometry.location.lng :0
            });
            self.getFreeSearchResult();
        }

        let onFailMethod = (err) => {
            self.getFreeSearchResult();
            //console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod, ctype);
    }

    /**
     *
     */
    getFreeSearchResult(){
        this.setState({
            geo: {
                lat:this.state.latitude,
                lng:this.state.longitude
            }
        });
        var searchParum =
            {
                "id":null,
                "minReview":null,
                "maxReview":null,
                "minPrice":this.state.value.min,
                "maxPrice":this.state.value.max,
                "amenity":null,
                "propertyType":null,
                "ownerId":null,
                "nbedrooms":null,
                "nbathrooms":null,
                "name":null,
                "roomType":null,
                "longitude":this.state.longitude,
                "latitude":this.state.latitude,
                "capacity":null,
                "begin":null,
                "end":null
            };
        var bytes = utf8.encode(JSON.stringify(searchParum));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation?orderBy=name&offset=0&size='+ this.state.recordPerPage +'&selector='+encoded;

        let onSuccessMethod = (data) => {
            self.setState({
                propertyLists: data.items,
                ajaxLoading: false
            })
        }

        let onFailMethod = (err) => {
            ajaxLoading: false;
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     * @returns {JSON}
     */
    getPropertyType() {
        const self = this;

        let url = baseMVacationApiUrl + '/property-type?size=-1&offset=0';

        let onSuccessMethod = (data) => {
            self.setState({
                property: data.items,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     * @returns {JSON}
     */
    getRoomType() {
        const self = this;

        let url = baseMVacationApiUrl + '/room-type?size=-1&offset=0';

        let onSuccessMethod = (data) => {
            self.setState({
                room: data.items,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }
    /**
     * get aminities
     */
    getAminityType() {
        const self = this;

        let url = baseMVacationApiUrl + '/amenity?offset=0&size=-1';

        let onSuccessMethod = (data) => {
            self.setState({
                aminity: [{'id':1,'name':'aminity1'},{'id':1,'name':'aminity1'},{'id':1,'name':'aminity1'},{'id':1,'name':'aminity1'}]//data.items,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }
    /**
     *
     * @param e
     */

    handleAminity(e) {
        // current array of options
        const aminities = this.state.aminities;
        let index;
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            aminities.push(+e.target.value)
        } else {
            // or remove the value from the unchecked checkbox from the array
            index = aminities.indexOf(+e.target.value)
            aminities.splice(index, 1)
        }
        // sort the array
        aminities.sort()
        // update the state with the new array of options
        this.setState({ aminities: aminities });
        this.getAdvanceSearchResult(this.state.offset);
    }


    handleRuleChange(e){
        if (e.target.checked) {
            this.state.rules[e.target.name] = e.target.value;
        } else {
            this.state.rules[e.target.name] = null;
        }
        this.getAdvanceSearchResult(this.state.offset);
    }


    /**
     *
     * @param e
     */

    handleProperty(e) {
        const propertyList = this.state.propertyList;
        let index;
        if (e.target.checked) {
            propertyList.push(+e.target.value);
        } else {
            index = propertyList.indexOf(+e.target.value);
            propertyList.splice(index, 1);
        }
        propertyList.sort();
        this.setState({ propertyList: propertyList });
        this.getAdvanceSearchResult(this.state.offset);
    }

    /**
     *
     * @param newValue
     */
    switchGuests(newValue) {
        this.setState({
            guests: newValue
        });
    }
    /**
     *
     * @param newValue
     */
    switchChild(newValue) {
        this.setState({
            child: newValue
        });
    }

    /**
     *
     * @param newValue
     */
    switchCapacity(newValue) {
        this.setState({
            capacity: newValue
        });
        this.getAdvanceSearchResult(this.state.offset);
    }

    /**
     *
     * @param newValue
     */
    switchBedNo(newValue) {
        this.setState({
            bedNo: newValue
        });
        this.getAdvanceSearchResult(this.state.offset);
    }


    /**
     *
     * @param newValue
     */
    switchBathRooms(newValue) {
        this.setState({
            bathRooms: newValue
        });
        this.getAdvanceSearchResult(this.state.offset);
    }


    handleRoom(e) {
        const roomList = this.state.roomList;
        let index;
        if (e.target.checked) {
            roomList.push(e.target.value);
        } else {
            index = roomList.indexOf(+e.target.value);
            roomList.splice(index, 1);
        }
        roomList.sort();
        this.setState({ roomList: roomList });
        this.getAdvanceSearchResult(this.state.offset);
    }

    handleRating(e){
        this.setState({ minReview: e.target.value });
        this.getAdvanceSearchResult(this.state.offset);
    }

    handleInputRange(){
        this.getAdvanceSearchResult(this.state.offset);
    }
    /**
     *
     * @param page
     */
    changePage(page) {
        window.scrollTo(0, 0);
        let page1 = page.selected+1;
        this.setState({page: page1,
            offset:page.selected
        });
        this.getAdvanceSearchResult(page.selected*this.state.recordPerPage);
    }

    arrowUpDown(){
        if(document.getElementById("adSearch").className=='fa fa-chevron-up'){
            document.getElementById("adSearch").className = "fa fa-chevron-down";
        }else {
            document.getElementById("adSearch").className = "fa fa-chevron-up";
        }
    }

    searchMapMobile(){
        this.setState({map:true,
            propertyList: this.state.propertyList});
    }

    searchMobile(){
        this.setState({map:true  });
        if(document.getElementById("adSearch").className=='fa fa-chevron-up'){
            document.getElementById("adSearch").className = "fa fa-chevron-down";
        }else {
            document.getElementById("adSearch").className = "fa fa-chevron-up";
        }
    }
    /**
     *
     * @returns {XML}
     */
    render() {
        const { t } = this.props;
        const inputProps = {
            value: this.state.address,
            onChange: this.onChange,
            type: 'search',
            placeholder: t("Where"),
            autoFocus: true,
        }

        var capacity =[];
        var bedNo = [];
        var bathRooms = [];
        var guests =[];
        var child =[];

        for(var i = 1; i <= 10; i++){
            capacity.push({value: i, label: i})
        }

        for(var i = 1; i <= 10; i++){
            bedNo.push({value: i, label: i})
        }

        for(var i = 1; i <= 10; i++){
            bathRooms.push({value: i, label: i})
        }

        for(var i = 1; i <= 10; i++){
            guests.push({value: i, label:i==1 ? i+ t('Adult') : i+ t('Adults')})
        }

        for(var i = 0; i <= 10; i++){
            child.push({value: i, label: i+ t("Child")})
        }

        var placeholder = <span>{t('Select')}</span>;
        var newArr = [];
        if(this.state.propertyLists.length>0) {
            for (var i = 0; i < this.state.propertyLists.length; i++) {
                newArr.push({
                    longitude: this.state.propertyLists[i].longitude,
                    latitude: this.state.propertyLists[i].latitude,
                    cleaningFee: this.state.propertyLists[i].cleaningFee == null ?  0 : this.state.propertyLists[i].cleaningFee,
                    price: this.state.propertyLists[i].displayPrice == null ? 0 : zformat(this.state.propertyLists[i].displayPrice),
                    state: this.state.propertyLists[i].address.state,
                    country: this.state.propertyLists[i].address.country.name,
                });
            }
        }
        else {newArr}
        //console.log("dd" + JSON.stringify(newArr));
        // for pagination
        let per_page        = this.state.recordPerPage;
        const pages         = Math.ceil(this.state.total/per_page);
        const current_page  = this.state.page;
        const start_offset  = (current_page-1) * per_page;
        let start_count     = 0;
        let cur_record = (start_offset+per_page) < this.state.total ? (start_offset+per_page) : this.state.total;

        const myStyles = {

            input: { width: '100%',
                height: '46px',
                fontSize: '14px',
                lineHeight: '1.3333333',
                borderRadius: '6px' ,
                border: '2px solid #eee',

            }
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12　col-lg-12  hidden-xs hidden-sm advanced-search-header">
                        <ul>
                            <li className="col-lg-4  col-md-4">
                                <PlacesAutocomplete inputProps={inputProps}  styles={myStyles} />
                            </li>
                            <li className="col-lg-2 col-md-2">
                                <input className="from-control col-xs-12 input-lg" type="text" id="calendar"  name="calender" placeholder={t("Check In - Check out")}  value={this.state.calendar}/>
                            </li>
                            <li className="col-lg-2 col-md-2">
                                <Select   options={guests}   placeholder={placeholder} simpleValue clearable={this.state.clearable} name="guests"  value={this.state.guests} onChange={this.switchGuests.bind(this)}    searchable={this.state.searchable} />
                            </li>
                            <li className="col-lg-2 col-md-2">
                                <Select   options={child}  placeholder={placeholder} simpleValue clearable={this.state.clearable} name="child"  value={this.state.child} onChange={this.switchChild.bind(this)}   searchable={this.state.searchable} />
                            </li>
                            <li className="col-lg-2 col-md-2">
                                <button  className="advanced-search-button" onClick={this.searchSubmit.bind(this)} >{t("Search")}</button>
                            </li>
                        </ul>
                    </div>

                    <div className="col-sm-12 col-xs-12 hidden-lg hidden-md advanced-search-header">
                        <ul className="collapse" id="advanced-search-bar">
                            <li className="col-sm-12 col-xs-12" style={{zIndex:'10000'}}>
                                <PlacesAutocomplete inputProps={inputProps} styles={myStyles} />
                            </li>
                            <li className="col-sm-12 col-xs-12">
                                <input className="from-control col-xs-12 input-lg"    type="text" id="calendar"  name="calender" placeholder={t("Check In - Check out")} value=""/>
                            </li>
                            <li className="col-sm-4 col-xs-6">
                                <Select  autofocus options={guests}  placeholder={placeholder} simpleValue clearable={this.state.clearable} name="guests"  value={this.state.guests} onChange={this.switchGuests.bind(this)}  searchable={this.state.searchable} />
                            </li>
                            <li className="col-sm-4 col-xs-6">
                                <Select  autofocus options={child}  placeholder={placeholder} simpleValue clearable={this.state.clearable} name="child"  value={this.state.child} onChange={this.switchChild.bind(this)}  searchable={this.state.searchable} />
                            </li>
                            <li className="hidden-lg hidden-md col-xs-6 col-sm-6 mt-10">
                                <button  className="btn btn-default" onClick={this.searchSubmit.bind(this)} >{t("Search")}</button>
                            </li>
                        </ul>
                        <div className="hidden-lg hidden-md col-sm-12 col-xs-12">
                            <button className="advanced-search-button second col-sm-12  mt-10 " type="button" data-toggle="collapse" data-target="#advanced-search-bar" aria-expanded="false" aria-controls="advanced-search-bar" onClick={this.searchMobile.bind(this)}>{t("Location Search")}
                                <b>&nbsp;&nbsp;</b>
                            <i id="adSearch" className="fa fa-chevron-down" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <div className="search-result nopadding-l-f col-md-12">
                        <div className="col-xs-12 col-md-12 space-100"></div>
                        <div className="property-list col-md-8 nopadding-l-f">
                            <div className="col-md-12  col-xs-12 ">
                                <div className="advanced-search-toggle col-md-8">
                                    <div className="panel-heading advanced-search-panel">
                                        <button type="button" className="btn btn-default mt-50" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" onClick={this.arrowUpDown.bind(this)}>
                            <span >
                                <b> {t("Advanced Search")} </b>
                                <i id="adSearch" className="fa fa-chevron-down" aria-hidden="true"></i>
                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="panel-group advanced-search-menu col-md-12 col-xs-12 nopadding-l-f" id="accordion">
                                    <div id="collapseTwo" className="panel-collapse collapse">
                                        <div className="panel-body">
                                            <div className="list-advanced">
                                                <div className="col-md-3  price-range left">
                                                    <label>{t("Price")}</label>
                                                </div>
                                                <div className="col-md-9 check-body right ">
                                                    <InputRange
                                                        maxValue={100000}
                                                        minValue={0}
                                                        value={this.state.value}
                                                        onChange={value => this.setState({ value })}
                                                        onChangeComplete={this.handleInputRange.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <div className="list-advanced">
                                                <div className="offset-md-1 col-md-3  price-range left">
                                                    <label>{t("Rating")}</label>
                                                </div>
                                                <div className="col-md-9 check-body right">
                                                    <div className="col-md-4 col-xs-12 radio" style={{float:'right',marginTop:'0px'}}>
                                                        <label><input type="radio" name="minReview"  value="1" onChange={this.handleRating.bind(this)}/>
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            <Rating
                                                                initialRate={1}
                                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                                full="fa fa-star"
                                                                fractions={2}
                                                                readonly
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="col-md-4 col-xs-12 radio">
                                                        <label>
                                                            <input type="radio" name="minReview" value="2" onChange={this.handleRating.bind(this)}/>
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            <Rating
                                                                initialRate={2}
                                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                                full="fa fa-star"
                                                                fractions={2}
                                                                readonly
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="col-md-4 col-xs-12 radio">
                                                        <label><input type="radio" name="minReview" value="3" onChange={this.handleRating.bind(this)}/>
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            <Rating
                                                                initialRate={3}
                                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                                full="fa fa-star"
                                                                fractions={2}
                                                                readonly
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="col-md-4 col-xs-12 radio">
                                                        <label><input type="radio" name="minReview" value="4" onChange={this.handleRating.bind(this)}/>
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            <Rating
                                                                initialRate={4}
                                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                                full="fa fa-star"
                                                                fractions={2}
                                                                readonly
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className="col-md-4 col-xs-12 radio">
                                                        <label><input type="radio" name="minReview" value="5" onChange={this.handleRating.bind(this)}/>
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            <Rating
                                                                initialRate={5}
                                                                empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                                full="fa fa-star"
                                                                fractions={2}
                                                                readonly
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <div className="list-advanced">
                                                <div className="col-md-3 left">
                                                    <label>{t("Amenity")}</label>
                                                </div>
                                                <div className="col-md-9  check-body right">
                                                    {this.state.aminity.map((text, i) => {
                                                        return (
                                                            <div className="col-md-4 col-xs-12 checkbox">
                                                                <label>
                                                                    <input type="checkbox"  value={text.id} onChange={this.handleAminity.bind(this)}/>
                                                                    <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                                    {text.name}
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <div className="list-advanced">
                                                <div className="col-md-3 left">
                                                    <label>{t("Facility")}</label>
                                                </div>
                                                <div className="col-md-9  check-body right">
                                                    <div className="col-xs-12 col-md-4 form-group" alt="bed-numbers">
                                                        <label>{t("Capacity")}</label>
                                                        <Select  autofocus options={capacity}  placeholder={placeholder} simpleValue clearable={this.state.clearable} name="capacity"  value={this.state.capacity}  onChange={this.switchCapacity.bind(this)} searchable={this.state.searchable} />
                                                    </div>
                                                    <div className=" col-xs-12 col-md-4 form-group" alt="bed-numbers">
                                                        <label>{t("Number Of Rooms")}</label>
                                                        <Select  autofocus options={bedNo} placeholder={placeholder} simpleValue clearable={this.state.clearable} name="bedNo"  value={this.state.bedNo}  onChange={this.switchBedNo.bind(this)} searchable={this.state.searchable} />
                                                    </div>
                                                    <div className=" col-xs-12 col-md-4 form-group" alt="bed-numbers">
                                                        <label>{t("Number Of Beds")}</label>
                                                        <Select   autofocus options={bathRooms} placeholder={placeholder} simpleValue clearable={this.state.clearable} name="bathRooms"  value={this.state.bathRooms}  onChange={this.switchBathRooms.bind(this)} searchable={this.state.searchable} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <div className="list-advanced">
                                                <div className="col-md-3 left">
                                                    <label>{t("Property Type")}</label>
                                                </div>
                                                <div className="col-md-9  check-body right">
                                                    {this.state.property.map((text, i) => {
                                                        return (
                                                            <div className="col-md-4 col-xs-12 checkbox">
                                                                <label>
                                                                    <input type="checkbox" value={text.id} onChange={this.handleProperty.bind(this)}/>
                                                                    <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                                    {text.name}
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <div className="list-advanced">
                                                <div className="col-md-3 left">
                                                    <label>{t("Room Type")}</label>
                                                </div>
                                                <div className="col-md-9  check-body right">
                                                    {this.state.room.map((text, i) => {
                                                        return (
                                                            <div className="col-md-4 col-xs-12 checkbox">
                                                                <label>
                                                                    <input type="checkbox" value={text.name} onChange={this.handleRoom.bind(this)}/>
                                                                    <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                                    {text.name}
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="panel-body">
                                            <div className="list-advanced">
                                                <div className="col-md-3 left">
                                                    <label>{t("Rules")}</label>
                                                </div>
                                                <div className="col-md-9  check-body right">
                                                    <div className="col-md-4 col-xs-12 checkbox">
                                                        <label><input type="checkbox" name="isPetsAllowed" value="true" onChange={this.handleRuleChange.bind(this)} />
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            {t("Pet OK")}
                                                        </label>
                                                    </div>
                                                    <div className="col-md-4 col-xs-12 checkbox">
                                                        <label><input type="checkbox"  name="isSmokingAllowed" value="true" onChange={this.handleRuleChange.bind(this)}/>
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            {t("Smoking Ok")}
                                                        </label>
                                                    </div>
                                                    <div className="col-md-4 col-xs-12 checkbox">
                                                        <label><input type="checkbox" name="isInfantsAllowed" value="true" onChange={this.handleRuleChange.bind(this)}/>
                                                            <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                            {t("Baby Ok")}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.total > 0   ?
                                    <div className="col-md-6 col-xs-6 mt-10">
                                        <h5><b>{start_offset+1} - {cur_record} {t("Of")} {this.state.total}</b></h5>
                                    </div>: <div className="col-md-12 col-xs-12 mt-10"  >
                                        { this.state.ajaxLoading==false ?<center>
                                                <h2><b>{t("No Property Found")}</b></h2>
                                                <h3><b>{t("Please search other conditions")}</b></h3>
                                                <div className="col-md-12" style={{minHeight:'900px',backgroundColor:'transparent' }}>

                                                </div>
                                            </center>:null}
                                    </div>}
                                {this.state.total > 0 ?<div className="col-md-4  col-xs-6 pull-right mt-10" >
                                        <select className="form-control" onClick={this.switchSortBy.bind(this)} id="acco-search-sort-by">
                                            <option value="sort_by">{t("Sort by")}</option>
                                            <option value="latest">{t("Latest")}</option>
                                            <option value="most_popular">{t("Most Popular")}</option>
                                            <option value="lower_price">{t("Lower Price")}</option>
                                            <option value="higher_price">{t("Higher price")}</option>
                                            <option value="name">{t("Alphabetical Order")}</option>
                                        </select>
                                    </div>:null}
                            </div>
                            {this.state.ajaxLoading==false ?<span>{this.state.propertyLists.map((text, i) => {
                                    let aminity = t("No Wifi");
                                    if( text.amenityList !=null && text.amenityList.length > 0 ) {
                                        for(var j = 0; j < text.amenityList.length; j++) {
                                            if (text.amenityList[j].id == 1) {
                                                aminity = t("Wifi");
                                            }
                                        }
                                    }
                                    var accommodationPrice = parseFloat(text.displayPrice != null ||  text.displayPrice != -1 ? zformat(text.displayPrice) : 0)
                                    var accommodationObject = {
                                        accommodationId: text.id,
                                        accommodationName: text.name,
                                        accommodationLocation: text.address != null && text.address.city != null ? text.address.city : "" + "." + text.address != null && text.address.country != null ? text.address.country.name : "",
                                        accommodationPrice: accommodationPrice,
                                        accommodationImage: "",
                                        accommodationImageId: text.featuredPicture != null & text.featuredPicture.id != null ? text.featuredPicture.id : ""
                                    }
                                    return(
                                        <div className="col-md-4 col-xs-12">
                                            <div className="property-single clearfix">
                                                <div className="property-photo">
                                                    <div className="card-img-box">
                                                        <a href={baseCmsUrl + "/accommodation/" + text.id}><img src={text.mediaList.length > 0 ? baseMVacationApiUrl +'/media/' + text.featuredPicture.id +'/data?size=250x250':baseCmsUrl + "/storage/app/media/default-images/250x250.png"} className="img-responsive"/></a>
                                                    </div>
                                                    <div className="property-price-tag">
                                                        { currencyCode  == "USD" ? "$" : "¥"} {convertCurrency(accommodationPrice)} -
                                                    </div>
                                                    <div className="col-sm-3 pull-right">
                                                        { userLoggedIn == true ?
                                                            <FavouriteWidget accommodation = {accommodationObject} {...this.props}/>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                                <div className="property-title card-title" style={{textTransform: 'capitalize'}}>
                                                    <a href={baseCmsUrl + "/accommodation/" + text.id}>  {text.name.length > 15 ? text.name.substr(0, 15) + "..." : text.name}</a>
                                                </div>
                                                <span className="location"><i className="icon-location-pin"></i>{text.address.city} &nbsp; {text.address.country != null ? text.address.country.name : ""} </span>
                                                <div className="property-reviews">
                                                    <div className="reviews-stars">
                                                        <Rating
                                                            initialRate={text.accomodationRating ? zformat(text.accomodationRating.average):0}
                                                            empty="fa fa-star-o" style={{color:'#ff6043'}}
                                                            full="fa fa-star"
                                                            fractions={2}
                                                            readonly
                                                        />
                                                    </div>
                                                    <div className="reviews-number">
                                                        {t("Review")}  { text.accomodationRating != null ? text.accomodationRating.numReviews : 0}
                                                    </div>
                                                </div>
                                                <div className="property-description">
                                                    {text.description != null && text.description.length > 60 ? text.description.substr(0, 60) + "..." : text.description}
                                                </div>
                                                <ul className="property-tags clearfix">
                                                    <li className="property-tags-single">{text.capacity}{t("People")}</li>
                                                    <li className="property-tags-single">{text.propertyType.name}</li>
                                                    <li className="property-tags-single">{text.roomType}</li>
                                                    <li className="property-tags-single">{aminity} </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                                    {this.state.total > 0 ?
                                        <div className="col-xs-12 col-md-12 pagenation">
                                            <center>
                                                <ReactPaginate previousLabel={"<<"}
                                                               nextLabel={">>"}
                                                               breakLabel={<a href="">...</a>}
                                                               breakClassName={"break-me"}
                                                               pageCount={pages}
                                                               marginPagesDisplayed={5}
                                                               pageRangeDisplayed={per_page}
                                                               onPageChange={this.changePage.bind(this)}
                                                               containerClassName={"pagination pg-amber"}
                                                               subContainerClassName={"pages pagination"}
                                                               activeClassName={"active"}
                                                               forcePage={this.state.forceSelected}/>

                                            </center>
                                        </div>:null}</span>: <div className="col-md-12 pull-center ajax-loading" ></div>}
                            <div className="col-md-12 search-result-footer hidden-xs hidden-sm">
                                <footer style={{backgroundColor:'black'}}>
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-12 col-xs-12 footer-logo">
                                                <span className="nohover" herf="{{base_cms_url}}"> mVacation</span>
                                            </div>
                                            <div className="col-md-3 col-xs-12  footer-body mb-30">
                                                <label>はじめに</label>
                                                <ul>
                                                    <li><a href="/about">Mvacについて</a></li>
                                                    <li><a href="#">利用規約とプライバシーについて</a></li>
                                                    <li><a href="#">会社概要 </a></li>
                                                </ul>
                                            </div>
                                            <div className="col-md-3 col-xs-12  footer-body">
                                                <label>ゲスト・ホスト</label>
                                                <ul>
                                                    <li><a href="#">物件検索する</a></li>
                                                    <li><a href="#">使い方について</a></li>
                                                    <li><a href="#">ホストについて</a></li>
                                                </ul>
                                            </div>
                                            <div className="col-md-3 col-xs-12  footer-body">
                                                <label>ヘルプ</label>
                                                <ul>
                                                    <li><a href="#">FAQ</a></li>
                                                    <li><a href="#">カスタマーセンター</a></li>

                                                </ul>
                                            </div>
                                            <div className="col-md-3 col-xs-12 footer-body">
                                                <label>FIND US</label>
                                                <ul className="social">
                                                    <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-twitter"></i></a></li>
                                                    <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
                                                </ul>
                                            </div>
                                            <div className="footer-copy">©&nbsp;みんなの宿泊&nbsp;-&nbsp;2017</div></div>
                            </div>
                        </footer></div>
                        </div>
                        {newArr.length ?
                            <div className="col-md-4 map-section nopadding hidden-xs hidden-sm">
                                <SearchResultMap  geoCode={newArr} geo={this.state.geo}/>
                            </div>:''}
                    </div>
                </div>
            </div>
        )
    }
}
export default TranslationWrapper(translate("SearchResult")(SearchResult))
