import React, { Component } from 'react';
import DayPicker from 'react-day-picker';
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";


//internal
import Message from './common/Message';
import RoomIntro from './RoomIntro';
import RoomPics from './RoomPics';
import RoomDescription from './RoomDescription';
import MapApp from './MapApp';
import RoomSpecification from './RoomSpecification';
import FavouriteWidget from "./favourites/FavouriteWidget";

const overlayStyle = {
    position: 'absolute',
    background: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
    right:0
};
const overlayStyleEnd = {
    position: 'absolute',
    background: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
    right:0,
    top:'3.7em'
};
function sundays(day) {
    return day.getDay() === 0;
}
class Room extends React.Component {
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
        this.handleClick = this.handleClick.bind(this); // handle click event in document
        this.state = {
            type:false,
            msg:[],
            guest:1,
            children:0,
            prices:[],
            roomPrice:{
                "total": '',
                "stay": '',
                "cleaningFee": '',
                "totalDays":''
            },
            curMon:false
        }
    }

    /**
     *
     * @param newValue
     */
    switchGuest(newValue) {
        this.setState({
            guest: newValue
        });
    }

    /**
     *
     * @param newValue
     */
    switchChildren(newValue) {
        this.setState({
            children: newValue
        });
    }

    /**
     * @param {int} The month number, 0 based
     * @param {int} The year, not zero based, required to account for leap years
     * @return {Date[]} List with date objects for each day of the month
     */
    getDaysInMonth(month, year) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
            days.push(moment(new Date(date)).format('YYYY-MM-DD'));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }

    /**
     *
     *
     */
    loadInitialDisable() {

        var arr1 =this.getDaysInMonth(new Date().getMonth(), new Date().getFullYear());
        var lastDayOfMonth = moment(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)).format('YYYY-MM-DD');
        var firstDayOfMonth = moment(new Date()).format('YYYY-MM-DD');
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/'+ this.getUrlId() +'/availability?startDate=' +firstDayOfMonth + '&endDate=' +lastDayOfMonth;

        let onSuccessMethod = (data) => {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push(data[i].date);
            }
            self.setState({
                sunday1: self.arr_diff(arr1,arr),
                prices: data
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }
    /**
     * id from URL params
     *
     */
    getUrlId() {
        var id = location.href.substr(location.href.lastIndexOf('/') + 1);
        return id;
    }
    /**
     *Initial call
     *
     */
    componentDidMount() {
        LineIt.loadButton();
        this.loadInitialDisable();
    }

    handleContainerMouseDown() {
        this.clickedInside = true;
        // The input's onBlur method is called from a queue right after onMouseDown event.
        // setTimeout adds another callback in the queue, but is called later than onBlur event
        this.clickTimeout = setTimeout(() => {
            this.clickedInside = false;
        }, 0);
    }

    /**
     *
     */
    handleContainerMouseDown1() {
        this.clickedInside = true;
        // The input's onBlur method is called from a queue right after onMouseDown event.
        // setTimeout adds another callback in the queue, but is called later than onBlur event
        this.clickTimeout = setTimeout(() => {
            this.clickedInside = false;
        }, 0);
    }

    /**
     *
     */
    handleInputFocus() {

        if(this.state.value) {
            var arr1 = this.getDaysInMonth(new Date(this.state.value).getMonth() , new Date(this.state.value).getFullYear());
        }else {
            var arr1 = this.getDaysInMonth(new Date().getMonth(), new Date().getFullYear());
        }

        if(this.state.value) {
            var lastDayOfMonth = moment(moment(this.state.value).endOf('month').toDate()).format('YYYY-MM-DD');
            var firstDayOfMonth = moment(moment(this.state.value).endOf('month').toDate()).format('YYYY-MM-01');
        }else{

            var lastDayOfMonth = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format('YYYY-MM-DD');
            var firstDayOfMonth = moment(new Date()).format('YYYY-MM-DD');
        }
        const self = this;
        let url = baseMVacationApiUrl + '/accomodation/'+ this.getUrlId() +'/availability?startDate=' +firstDayOfMonth + '&endDate=' +lastDayOfMonth;

        let onSuccessMethod = (data) => {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push(data[i].date);
            }
            self.setState({
                sunday1: self.arr_diff(arr1,arr),
                prices: data,
                showOverlay: true,
                showOverlay3: true,
                showOverlay1: false,
                show1: false,
                show:true,
                show3:true,
                show4:false,
                showOverlay4: false
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);

    }

    /**
     *
     */
    handleInputFocus1() {

        if(this.state.value1) {
            var arr1 = this.getDaysInMonth(new Date(this.state.value1).getMonth() , new Date(this.state.value1).getFullYear());
        }else {
            var arr1 = this.getDaysInMonth(new Date().getMonth(), new Date().getFullYear());
        }

        if(this.state.value1) {
            var lastDayOfMonth = moment(moment(this.state.value1).endOf('month').toDate()).format('YYYY-MM-DD');
            var firstDayOfMonth = moment(moment(this.state.value1).endOf('month').toDate()).format('YYYY-MM-01');
        }else{
            var lastDayOfMonth = moment(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)).format('YYYY-MM-DD');
            var firstDayOfMonth = moment(new Date()).format('YYYY-MM-DD');
        }
        const self = this;
        let url = baseMVacationApiUrl + '/accomodation/'+ this.getUrlId() +'/availability?startDate=' +firstDayOfMonth + '&endDate=' +lastDayOfMonth;

        let onSuccessMethod = (data) => {
            var arr = [];
            if(data.length>0){
                for (var i = 0; i < data.length; i++) {
                    arr.push(data[i].date);
                }
            }
            if( data.length > 0){
            self.setState({
                sunday1: "",
                prices: data,
                showOverlay1: true,
                showOverlay4: true,
                showOverlay: false,
                showOverlay3: false,
                show: false,
                show3: false,
                show1: true,
                show4: true

            })
            }else{
                self.setState({
                    sunday1: self.arr_diff(arr1,arr),
                    prices: data,
                    showOverlay1: true,
                    showOverlay4: true,
                    showOverlay: false,
                    showOverlay3: false,
                    show: false,
                    show3: false,
                    show1: true,
                    show4: true

                })
            }
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);

        /*
         this.setState({
         showOverlay1: true,
         showOverlay: false,
         show1: true
         })*/
    }

    /**
     *
     */
    handleInputBlur() {
        const showOverlay = this.clickedInside;
        this.setState({
            showOverlay,
        });
    }

    /**
     *
     */
    handleInputBlur1() {
        const showOverlay1 = this.clickedInside;
        this.setState({
            showOverlay1,
        });
    }

    /**
     *
     * @param e
     */
    handleInputChange(e) {
        const { value } = e.target;
        const momentDay = moment(value, 'L', true);
        if (momentDay.isValid()) {
            this.setState({
                selectedDay: momentDay.toDate(),
                value,
            }, () => {
                this.daypicker.showMonth(this.state.selectedDay);
            });
        } else {
            this.setState({ value, selectedDay: null });
        }
    }

    /**
     *
     * @param e
     */
    handleInputChange1(e) {
        const { value1 } = e.target;
        const momentDay = moment(value1, 'L', true);
        if (momentDay.isValid()) {
            this.setState({
                selectedDay1: momentDay.toDate(),
                value1,
                // prices
            }, () => {
                this.daypicker.showMonth(this.state.selectedDay1);
            });
        } else {
            this.setState({ value1, selectedDay1: null });
        }
    }
    /**
     *
     * @param day
     * @param disabled
     */

    handleDayClick(day , { disabled }) {
        if (disabled) {
            return;
        }


        if(this.state.value1) {
            var timeDiff = Math.abs(new Date(moment(day).format('YYYY-MM-DD')).getTime()-new Date(this.state.value1).getTime());
            //console.log(timeDiff);
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const self = this;

            let url = baseMVacationApiUrl + '/accomodation/' + this.getUrlId() + '/price?startDate=' + moment(day).format('YYYY-MM-DD')  + '&endDate=' +   moment(this.state.value1).format('YYYY-MM-DD');

            let onSuccessMethod = (data) => {
                data['totalDays'] = diffDays;
                self.setState({
                    roomPrice: data
                })
                self.setState({type:false});
                self.setState({msg:''});
            }

            let onFailMethod = (err) => {
                var errArr = [];
                if(err.responseJSON && err.responseJSON.details) {
                    err.responseJSON.details.forEach(function (item) {
                        errArr.push(item.message);
                    });
                }else if(err.responseJSON){
                    errArr.push(err.responseJSON.message);
                }else {
                    errArr.push(err.responseText);
                }
                self.setState({msg: errArr});
                self.setState({type: true});
            }

            ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
        }
        this.setState({
            value: moment(day).format('YYYY-MM-DD'),
            selectedDay: day,
            showOverlay: false,
            show:false,
            showOverlay3: false,
            show3:false
        });
        //this.input.blur();
    }

    /**
     *
     * @param day
     * @param disabled
     */
    handleDayClick1(day , { disabled }) {
        if (disabled) {
            return;
        }
        if(this.state.value) {
            var timeDiff = Math.abs(new Date(this.state.value).getTime() - new Date(moment(day).format('YYYY-MM-DD')).getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            const self = this;

            let url = baseMVacationApiUrl + '/accomodation/' + this.getUrlId() + '/price?startDate=' + moment(this.state.value).format('YYYY-MM-DD') + '&endDate=' + moment(day).format('YYYY-MM-DD');

            let onSuccessMethod = (data) => {
                data['totalDays'] = diffDays;
                self.setState({
                    roomPrice: data,
                })
                self.setState({type:false});
                self.setState({msg:''});
            }

            let onFailMethod = (err) => {
                var errArr = [];
                if(err.responseJSON && err.responseJSON.details) {
                    err.responseJSON.details.forEach(function (item) {
                        errArr.push(item.message);
                    });
                }else if(err.responseJSON){
                    errArr.push(err.responseJSON.message);
                }else {
                    errArr.push(err.responseText);
                }
                self.setState({msg: errArr});
                self.setState({type: true});
                // self.setState({msg:error.response.data});
            }

            ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
        }
        this.setState({
            value1: moment(day).format('YYYY-MM-DD'),
            selectedDay1: day,
            showOverlay1: false,
            show1:false,
            showOverlay4: false,
            show4:false
        });
        //this.input.blur();
    }



    /**
     *
     * @param event
     */
    /* handleClick(event) {
     // detect where click event has occured
     // if click on input or calendar (date picker wrapper) -> no need to hide date picker
     // if click on out side element -> set state show = false -> to hide date piker
     if (this.refs.input.contains(event.target) || this.refs.calendar.contains(event.target)) {
     } else {
     this.setState({
     show: false
     });
     }
     }
     */

    /**
     *
     * @param event
     */
    /*handleClick1(event) {
     // detect where click event has occured
     // if click on input or calendar (date picker wrapper) -> no need to hide date picker
     // if click on out side element -> set state show = false -> to hide date piker
     if (this.refs.input.contains(event.target) || this.refs.calendar.contains(event.target)) {
     } else {
     this.setState({
     show: false
     });
     }
     }
     */
    /**
     * array diff function
     * @param a1
     * @param a2
     * @returns {Array}
     */
    arr_diff (a1, a2) {
        var a = [], diff = [];
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }

        }
        for (var k in a) {
            diff.push(new Date(k));
        }

        return diff;
    }

    /**
     *
     * @param day
     * @returns {XML}
     */
    renderDay(day) {
        const a = moment(day).format('YYYY-MM-DD');
        const date = day.getDate();
        return (
            <div >
                <code style={{color:'black',backgroundColor:'transparent'}} >{ date }</code>
                <div className="Price-List">
                    {
                        this.state.prices.map((price, i) => {
                            if(price.date == a){
                                return (
                                    <div key={ i } style={{color:'red'}}>
                                        { convertCurrency(Number(price.price)) }
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        );
    }

    /**
     *
     */
    handleSubmit(){
        this.setState({
            type:false,
            msg:[]
        });

        let startDate   = document.getElementsByName("start")[0].value ? document.getElementsByName("start")[0].value :null ;
        let endDate     = document.getElementsByName("end")[0].value ? document.getElementsByName("end")[0].value :null;
        let acc_id     = this.getUrlId();
        var text = {
            "numberOfGuest": this.state.guest,
            "numberOfChild": this.state.children,
            "startDate": startDate,
            "endDate": endDate,
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/' + this.getUrlId() + '/price?startDate=' + startDate + '&endDate=' + endDate;

        let onSuccessMethod = (data) => {
            self.setState({type:false});
            self.setState({msg:''});
            window.location.assign(baseCmsUrl + '/payment?accommodation_id='+ acc_id + '&code='+ encoded);
        }

        let onFailMethod = (err) => {
            var errArr = [];
            if(err.responseJSON && err.responseJSON.details) {
                err.responseJSON.details.forEach(function (item) {
                    errArr.push(item.message);
                });
            }else if(err.responseJSON){
                errArr.push(err.responseJSON.message);
            }else {
                errArr.push(err.responseText);
            }
            self.setState({msg: errArr});
            self.setState({type: true});
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     * @param month1
     * @param year1
     */
    loadInitialDisableNext(month1,year1)
    {
        var arr1 =this.getDaysInMonth(month1, year1);
        var lastDayOfMonth = moment(new Date(year1, month1+1, 0)).format('YYYY-MM-DD');
        var firstDayOfMonth = moment(new Date(year1, month1, 1)).format('YYYY-MM-DD');
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/'+ this.getUrlId() +'/availability?startDate=' +firstDayOfMonth + '&endDate=' +lastDayOfMonth;

        let onSuccessMethod = (data) => {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push(data[i].date);
            }
            self.setState({
                sunday1: self.arr_diff(arr1,arr),
                prices: data
            })
        }

        let onFailMethod = (err) => {
            //console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     * @param month1
     * @param year1
     */
    loadInitialDisableNext1(month1,year1)
    {
        var arr1 =this.getDaysInMonth(month1, year1);
        var lastDayOfMonth = moment(new Date(year1, month1+1, 0)).format('YYYY-MM-DD');
        var firstDayOfMonth = moment(new Date(year1, month1, 1)).format('YYYY-MM-DD');
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/'+ this.getUrlId() +'/availability?startDate=' +firstDayOfMonth + '&endDate=' +lastDayOfMonth;

        let onSuccessMethod = (data) => {
            var arr = [];
            /*var arr = [];
            if(data.length)
            for (var i = 0; i < data.length; i++) {
                arr.push(data[i].date);
            }*/
            if(data.length > 0){
                self.setState({
                    sunday1:"",
                    prices: data
                })
            }else{
                self.setState({
                    sunday1:self.arr_diff(arr1,arr),
                    prices: data
                })
            }
        }

        let onFailMethod = (err) => {
            //console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     * \
     * * @param month
     */
    monthchange(month){
        var mon = new Date(month).getMonth();
        var curMon = new Date().getMonth();
        var year = new Date(month).getFullYear();
        if(mon==curMon){
            this.setState({
                curMon: true
            })
        }
        this.loadInitialDisableNext(mon,year);
    }

    /**
     * \
     * * @param month
     */
    monthchange1(month){
        var mon = new Date(month).getMonth();
        var curMon = new Date().getMonth();
        var year = new Date(month).getFullYear();
        if(mon==curMon){
            this.setState({
                curMon: true
            })
        }
        this.loadInitialDisableNext1(mon,year);
    }

    handleFacebookShare(){
        let currentUrl = location.href;
        let fbShareUrl = "https://www.facebook.com/sharer/sharer.php?u="
        let h = 400;
        let w = 600;

        let y = window.top.outerHeight / 2 + window.top.screenY - ( h / 2);
        let x = window.top.outerWidth / 2 + window.top.screenX - ( w / 2);
        window.open(fbShareUrl+currentUrl, 'pop', 'scrollbars=no, width='+w+', height='+h+', top='+y+', left='+x);
    }

    handleEmailShare(){
        let currentUrl = location.href;
        window.location.href = "mailto:?subject=&body=" + currentUrl;
    }


    componentWillMount() {
        document.addEventListener('click', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }

    handleClick(event) {
        //console.log("dd" + this.refs.calendar1.contains(event.target) + 'dddd33333' + this.state.show);
        // detect where click event has occured
        // if click on input or calendar (date picker wrapper) -> no need to hide date picker
        // if click on out side element -> set state show = false -> to hide date piker
        // if(event.target.name=='endDate') {
        if(this.state.show4) {
            if (this.refs.input4.contains(event.target) || this.refs.calendar4.contains(event.target) || this.state.curMon) {
                //console.log('click inside');
                this.setState({
                    curMon: false,
                });
            } else {
                //console.log('click outside');
                this.setState({
                    show4: false,
                    showOverlay4: false,
                });
            }
        }


        if(this.state.show3) {
            if (this.refs.input3.contains(event.target) || this.refs.calendar3.contains(event.target) || this.state.curMon) {
                //console.log('click inside');
                this.setState({
                    curMon: false,
                });
            } else {
                //console.log('click outside');
                this.setState({
                    show3: false,
                    showOverlay3: false,
                });
            }
        }


        if(this.state.show) {
            if (this.refs.input1.contains(event.target) || this.refs.calendar1.contains(event.target) || this.state.curMon) {
                //console.log('click inside');
                this.setState({
                    curMon: false,
                });
            } else {
                //console.log('click outside');
                this.setState({
                    show: false,
                    showOverlay: false,
                });
            }
        }
        if(this.state.show1) {
            if (this.refs.input2.contains(event.target) || this.refs.calendar2.contains(event.target) || this.state.curMon) {
                //console.log('click inside1');
                this.setState({
                    curMon: false,
                });
            } else {
                //console.log('click outside1');
                this.setState({
                    show1: false,
                    showOverlay1: false,
                });
            }
        }

    }

    /**
     *
     * @returns {XML}
     */
    render() {
        var guest = [];
        for(var i = 1; i <= this.props.capacity; i++){
            guest.push({value: i, label: i})
        }

        var children = [];
        for(var i = 0; i <= this.props.capacity; i++){
            children.push({value: i, label: i})
        }

        const { t } = this.props;
        // Translate month names
        const MONTHS = [
            t("jan"),
            t("feb"),
            t("mar"),
            t("apr"),
            t("may"),
            t("jun"),
            t("jul"),
            t("aug"),
            t("sep"),
            t("oct"),
            t("nov"),
            t("dec"),
        ];
        // Translate weekdays header
        const WEEKDAYS_SHORT = [t("su"), t("mo"), t("tu"), t("we"), t("th"), t("fr"), t("sa")];
        let { accommodation } = this.props;

        accommodation.accommodationPrice = this.state.prices.length >0  ? this.state.prices[0].price : '' ;
        return (
            <div>
                <div className="reserve_button visible-xs visible-sm" data-toggle="modal" data-target="#actionbox-xs">{t("Request For Reservation")}</div>
                <div className="modal fade" id="actionbox-xs" tabindex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content actionbox-xs">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div className="modal-body room-property-sidebar" style={{width:'100%', margin:'0'}}>
                                <h5> {this.props.roomName} </h5>
                                <div className="price">
                                    <span>{currencyCode  == "USD" ? "$" : "¥"} {this.state.roomPrice.stay ?  zformat(convertCurrency((this.state.roomPrice.total/this.state.roomPrice.totalDays).toFixed(2))) :  zformat(convertCurrency(this.props.displayPrice))} -</span>
                                    <span className="room-property-sidebar-top-nichi">/{t("Night")}</span>
                                </div>
                                <div className="check-in-out-box">
                                    <div>
                                        <input
                                            name="end"
                                            type="text"
                                            ref="input4"
                                            className="pull-right"
                                            placeholder="YYYY-MM-DD"
                                            value={ this.state.value1 }
                                            onChange={ this.handleInputChange1.bind(this) }
                                            onFocus={ this.handleInputFocus1.bind(this) }
                                        />
                                        { this.state.showOverlay4 &&
                                        <div  ref="calendar4" style={this.state.show4 ? {position: 'relative',zIndex:1000,fontSize:'14px'} : { display: 'none'}}>
                                            <div style={ overlayStyleEnd } className="ActionBoxCalendar-xs">
                                                <DayPicker
                                                    fromMonth={ new Date() }
                                                    ref="daypicker4"
                                                    initialMonth={this.state.selectedDay1 || undefined }
                                                    disabledDays={  this .state.sunday1 }
                                                    onDayClick={ this.handleDayClick1.bind(this) }
                                                    selectedDays={ this.state.selectedDay1 }
                                                    renderDay={ this.renderDay.bind(this)}
                                                    onMonthChange={this.monthchange1.bind(this)}
                                                    months={MONTHS}
                                                    weekdaysShort={WEEKDAYS_SHORT}
                                                />
                                            </div>
                                        </div>
                                        }
                                    </div>
                                    <div>
                                        <input
                                            name="start"
                                            type="text"
                                            ref="input3"
                                            placeholder="YYYY-MM-DD"
                                            value={ this.state.value }
                                            onChange={ this.handleInputChange.bind(this) }
                                            onFocus={ this.handleInputFocus.bind(this) }
                                        />
                                        { this.state.showOverlay3 &&
                                        <div ref="calendar3" style={this.state.show3 ? {position: 'relative',zIndex:1000,fontSize:'14px'} : { display: 'none'}}>
                                            <div style={ overlayStyle } className="ActionBoxCalendar-xs">
                                                <DayPicker
                                                    fromMonth={ new Date() }
                                                    ref="daypicker3"
                                                    initialMonth={this.state.selectedDay || undefined}
                                                    disabledDays={  this .state.sunday1 }
                                                    onDayClick={ this.handleDayClick.bind(this) }
                                                    selectedDays={ this.state.selectedDay }
                                                    renderDay={ this.renderDay.bind(this)}
                                                    onMonthChange={this.monthchange.bind(this)}
                                                    months={MONTHS}
                                                    weekdaysShort={WEEKDAYS_SHORT}
                                                />
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className="room-property-sidebar-guest">
                                    <span>{t("Adult")}</span>
                                    <Select ref="guest"  autofocus options={guest}   simpleValue clearable={this.state.clearable} name="guest"  value={this.state.guest}  onChange={this.switchGuest.bind(this)} searchable={this.state.searchable} />
                                </div>
                                <div className="room-property-sidebar-child">
                                    <span>{t("Child")}</span>
                                    <Select ref="children"  autofocus options={children}   simpleValue clearable={this.state.clearable} name="children"  value={this.state.children}  onChange={this.switchChildren.bind(this)} searchable={this.state.searchable} />
                                </div>
                                <div className="room-property-sidebar-kaike">
                                    <div className="room-property-sidebar-kaike-line">
                                        <span className="room-property-sidebar-kaike-type">{t("Treasurer")} </span>
                                        <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.stay)}</span>
                                    </div>
                                    <div className="room-property-sidebar-kaike-line">
                                        <span className="room-property-sidebar-kaike-type">{t("Service Fee")}</span>
                                        <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.serviceFee)}</span>
                                    </div>
                                    <div className="room-property-sidebar-kaike-line">
                                        <span className="room-property-sidebar-kaike-type">{t("Cleaning Fee")}</span>
                                        <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.cleaningFee)}</span>
                                    </div>
                                    <div className="room-property-sidebar-kaike-line">
                                        <span className="room-property-sidebar-kaike-type">{t("Total")}</span>
                                        <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.total)}</span>
                                    </div>
                                    <Message errors={this.state.msg} type={this.state.type}></Message>
                                </div>
                                <div className="modal-footer">
                                    { userLoggedIn ?
                                        <button  className="cta-button" onClick={this.handleSubmit.bind(this)}>{t("Request For Reservation")}</button>
                                        :
                                        <button data-toggle="modal" className="cta-button"  data-target="#loginModal">{t("Request For Reservation")}</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container"  id="panel1">
                    <section className="room-property-sidebar hidden-xs hidden-sm col-md-3">
                        <div className="room-property-sidebar-top">
                            <div className="room-property-sidebar-top-heart">
                                {(userLoggedIn) ?
                                    <FavouriteWidget accommodation = {accommodation} {...this.props}/>
                                    :
                                    null}
                            </div>
                            <div className="room-property-sidebar-top-price">
                                <span>{currencyCode  == "USD" ? "$" : "¥"} {this.state.roomPrice.stay ?  zformat(convertCurrency((this.state.roomPrice.total/this.state.roomPrice.totalDays).toFixed(2))) : zformat(convertCurrency(this.props.displayPrice))} -</span>
                                <span className="room-property-sidebar-top-nichi">/{t("Night")}</span>
                            </div>
                        </div>
                        <div className="room-property-sidebar-checkin-checkout">
                            <div className="row">
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 room-property-side-bar-checkin">
                                    <label>{t("Check In")}</label>
                                    <div>
                                        <input
                                            name="start"
                                            type="text"
                                            ref="input1"
                                            placeholder="YYYY-MM-DD"
                                            value={ this.state.value }
                                            onChange={ this.handleInputChange.bind(this) }
                                            onFocus={ this.handleInputFocus.bind(this) }
                                        />
                                        { this.state.showOverlay &&
                                        <div ref="calendar1" style={this.state.show ? {position: 'relative',zIndex:1000,fontSize:'14px'} : { display: 'none'}}>
                                            <div style={ overlayStyle }>
                                                <DayPicker
                                                    fromMonth={ new Date() }
                                                    ref="daypicker1"
                                                    initialMonth={this.state.selectedDay || undefined}
                                                    disabledDays={  this .state.sunday1 }
                                                    onDayClick={ this.handleDayClick.bind(this) }
                                                    selectedDays={ this.state.selectedDay }
                                                    renderDay={ this.renderDay.bind(this)}
                                                    onMonthChange={this.monthchange.bind(this)}
                                                    months={MONTHS}
                                                    weekdaysShort={WEEKDAYS_SHORT}
                                                />
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 room-property-side-bar-checkout">
                                    <label>{t("Check Out")}</label>
                                    <div>
                                        <input
                                            name="end"
                                            type="text"
                                            ref="input2"
                                            placeholder="YYYY-MM-DD"
                                            value={ this.state.value1 }
                                            onChange={ this.handleInputChange1.bind(this) }
                                            onFocus={ this.handleInputFocus1.bind(this) }
                                        />
                                        { this.state.showOverlay1 &&
                                        <div ref="calendar2" style={this.state.show1 ? {position: 'relative',zIndex:1000,fontSize:'14px'} : { display: 'none'}}>
                                            <div style={ overlayStyle }>
                                                <DayPicker
                                                    fromMonth={ new Date() }
                                                    ref="daypicker"
                                                    initialMonth={this.state.selectedDay1 || undefined }
                                                    disabledDays={  this .state.sunday1 }
                                                    onDayClick={ this.handleDayClick1.bind(this) }
                                                    selectedDays={ this.state.selectedDay1 }
                                                    renderDay={ this.renderDay.bind(this)}
                                                    onMonthChange={this.monthchange1.bind(this)}
                                                    months={MONTHS}
                                                    weekdaysShort={WEEKDAYS_SHORT}
                                                />
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="room-property-sidebar-guest">
                            <label>{t("Adult")}</label>
                            <Select ref="guest"  autofocus options={guest}   simpleValue clearable={this.state.clearable} name="guest"  value={this.state.guest}  onChange={this.switchGuest.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="room-property-sidebar-child">
                            <label>{t("Child")}</label>
                            <Select ref="children"  autofocus options={children}   simpleValue clearable={this.state.clearable} name="children"  value={this.state.children}  onChange={this.switchChildren.bind(this)} searchable={this.state.searchable} />
                        </div>
                        <div className="room-property-sidebar-kaike">
                            <div className="room-property-sidebar-kaike-line">
                                <span className="room-property-sidebar-kaike-type">{t("Treasurer")} <i className="icon-question"></i></span>
                                <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.stay)}</span>
                            </div>
                            <div className="room-property-sidebar-kaike-line">
                                <span className="room-property-sidebar-kaike-type">{t("Service Fee")}<i className="icon-question"></i></span>
                                <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.serviceFee)}</span>
                            </div>
                            <div className="room-property-sidebar-kaike-line">
                                <span className="room-property-sidebar-kaike-type">{t("Cleaning Fee")}<i className="icon-question"></i></span>
                                <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.cleaningFee)}</span>
                            </div>
                            <div className="room-property-sidebar-kaike-line">
                                <span className="room-property-sidebar-kaike-type">{t("Total")} <i className="icon-question"></i></span>
                                <span className="room-property-sidebar-kaike-price">{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.state.roomPrice.total)}</span>
                            </div>
                            <Message errors={this.state.msg} type={this.state.type}></Message>
                        </div>
                        <div className="room-property-sidebar-button">
                            { userLoggedIn ?
                                <button onClick={this.handleSubmit.bind(this)}>{t("Request For Reservation")}</button>
                                :
                                <button data-toggle="modal" data-target="#loginModal">{t("Request For Reservation")}</button>
                            }
                        </div>
                        <div className="room-property-sidebar-bottom">
                            <h4>{t("Share")}</h4>
                            <button className="property-sidebar-bottom-messenger" onClick={this.handleFacebookShare.bind(this)}><i className="fa fa-facebook fa-2x " style={{color:'#fff'}} aria-hidden="true"></i></button>
                            <button className="property-sidebar-bottom-line">
                                <div className="line-it-button" data-lang="en" data-url={location.href} data-type="share-c"></div>
                            </button>
                            <button className="property-sidebar-bottom-email" onClick={this.handleEmailShare.bind(this)}><i className="fa fa-envelope fa-2x " aria-hidden="true"></i></button>
                        </div>
                    </section>
                </div>
                <div className="container room-view">
                    <RoomIntro  translations={translations} roomName={this.props.roomName}  city={this.props.city} state={this.props.state} capacity={this.props.capacity} propertyType={this.props.propertyType}/>
                    <div className="room-pictures  row  mb-30">
                        <span className="col-sm-12 col-md-8 col-lg-9"><RoomPics  ImageInfo={this.props.ImageInfo} featuredPicture={this.props.featuredPicture}/></span>
                    </div>
                    <RoomDescription
                        translations={translations}
                        description={this.props.description}
                        capacity={this.props.capacity}
                        roomType={this.props.roomType}
                        propertyType={this.props.propertyType}
                        bedNo={this.props.bedNo}
                        bathRooms={this.props.bathRooms}
                        rules={this.props.rules}
                        aminities={this.props.aminities}
                        owner={this.props.owner}
                        accomodationRating={this.props.accomodationRating}
                        currentUserId={this.props.currentUserId}
                        {...this.props}
                    />
                    <MapApp translations={translations} line1={this.props.line1}  city={this.props.city} state={this.props.state} longitude={this.props.longitude} latitude={this.props.latitude} postcode={this.props.postcode}/>
                    <div className="divider"></div>
                    <RoomSpecification translations={translations} longitude={this.props.longitude} latitude={this.props.latitude}/>
                    <div className="col-xs-12 social-share-xs visible-xs">
                        <div className="col-xs-12 clearfix mt-40 mb-30 social-share-display-xs">
                            <button className="social-share-fb-xs" onClick={this.handleFacebookShare.bind(this)}><i className="fa fa-facebook fa-2x " style={{color:'#fff'}} aria-hidden="true"></i></button>
                            <button className="social-share-line-xs">
                                <div className="line-it-button" data-lang="en" data-url={location.href} data-type="share-c"></div>
                            </button>
                            <button className="social-share-mail-xs" onClick={this.handleEmailShare.bind(this)}><i className="fa fa-envelope fa-2x " aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default TranslationWrapper(translate("Room")(Room))
