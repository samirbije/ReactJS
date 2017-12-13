//external
import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Select from 'react-select';
import base64 from 'base-64';
import utf8 from 'utf8';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";

//internal
import MessageAccommodation from './common/MessageAccommodation';
import TextFieldGroup from './common/TextFieldGroup';
import Room from './Room';

class Accommodation extends Component {
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
        let accommodationId = this.getAccommodationId();
        console.log(accommodationId);
        if(accommodationId > 0 && localStorage.getItem("form_data_" + accommodationId)){
            this.state =  JSON.parse(localStorage.getItem("form_data_" + accommodationId));
        } else if(localStorage.getItem("form_data_")){
            this.state =  JSON.parse(localStorage.getItem("form_data_"));
        } else {
            this.state = {
                data: [
                    {
                        "id": 0,
                        "name": "",
                        "mediaType": "",
                        "url": baseCmsUrl + "/storage/app/media/text.png"
                    }
                ],
                featuredPicture: {
                    id: 0
                },
                accommodationId: "",
                owner:{},
                country: 'JP',
                countryName:'Japan',
                name: null,
                countryList: [],
                disabled: false,
                searchable: this.props.searchable,
                selectValue: '',
                state: '',
                selectValue1: '',
                clearable: false,
                coun: 'JP',
                property: [],
                room: [],
                aminity: [],
                accomodation: {},
                images: [],
                errors: {},
                type: false,
                msg: [],
                imageName: '',
                mediaType: '',
                aminities: [],
                url: '',
                long: 0,
                lati: 0,
                disable: '',
                amini: [],
                isSelected: false,
                rules: {
                    isSmokingAllowed: null,
                    isPetsAllowed: null,
                    isInfantsAllowed: null,
                    checkInTime: null,
                    checkOutTime: null
                },
                currentLoggedUserId: 0,
                accommodationNotFound: false,
                accommodationOwnerId: 0,
                accomodationRating: {},
                cleaningFee:0,
                ajaxLoading: true,
                thumbIndex:0,
                successfullyUpdated:false,
                cancellationPolicies: [],
                selectedCancellationPolicy: "",
                selectedCancellationPolicyDetails: {},
                accommodationStatus: "",
                unsavedData: false
            }
        }


    }

    /**
     * for sate dropdown
     * @param newValue
     */
    updateValue(newValue) {
        this.setState({
            stateValue: newValue,
            clearable: false
        });
    }

    /**
     * change country
     * @param newValue
     */
    switchCountry(newValue) {
       this.getCountryById(newValue);
       this.setState({
            country: newValue,
            selectValue: null
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
    }

    /**
     *
     * @param newValue
     */
    switchBedNo(newValue) {
        this.setState({
            bedNo: newValue
        });
    }

    /**
     *
     * @param newValue
     */
    switchBathRooms(newValue) {
        this.setState({
            bathRooms: newValue
        });
    }

    /**
     *
     * @param newValue
     */
    switchBedNoRoom(newValue) {
        this.setState({
            bedNoRoom: newValue
        });
    }

    /**
     *
     * @param newValue
     */
    switchRoomType(newValue) {
        this.setState({
            roomType: newValue
        });
    }

    /**
     *
     * @param newValue
     */
    switchPropertyType(newValue) {
        this.setState({
            propertyType: newValue
        });
    }

    /**
     *		      *
     * @param newValue
     */
    switchCheckInTime(e) {
        //console.log("checkin arg1 :",e);
        var rules = this.state.rules;
        rules.checkInTime = e;
        this.setState({
            rules : rules
        });
    }

    /**
     *
     * @param newValue
     */
    switchCheckOutTime(newValue) {
        var rules = this.state.rules;
        rules.checkOutTime = newValue;
        this.setState({
            rules : rules
        });
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
     * id from URL params
     *
     */
    getUrlId() {
        var id = location.href.substr(location.href.lastIndexOf('/') + 1);
        return id;
    }

    /**
     * create json for edit json
     *
     */
    getAccommodation() {
        let accommodationId = this.getAccommodationId();
        let key = "form_data_" + accommodationId;
        //console.log(localStorage.getItem(key) != null);
        if (localStorage.getItem(key) != null){
            //console.log("load:" + key);
            return;
        }

        var text = {
            "id": [accommodationId]
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);
        const self = this;

        //let url = baseMVacationApiUrl + '/accomodation?orderBy=id&offset=0&size=1&selector=' + this.getAccommodationId();
        let url = baseMVacationApiUrl + '/accomodation/' + this.getAccommodationId();

        let onSuccessMethod = (data) => {
            // image for remove
            var uploaded = [];
            //var response = data.items[0];
            var response = data;
            //console.log(JSON.stringify(response));
            for (var i = 0; i < response.mediaList.length; i++) {
                if(response.mediaList[i] != null){
                    uploaded.push(baseMVacationApiUrl +'/media/' + response.mediaList[i].id +'/data?size=50x50');
                }
            }


            document.title = response.name + ", " + response.address.city + ", " + response.address.country.name;
            //console.log(response.mediaList);
            self.setState({
                accommodationId: response.id,
                owner: response.owner,
                name: response.name,
                description: response.description,
                line1: response.address.line1,
                line2: response.address.line2,
                state: response.address.state,
                city: response.address.city,
                longitude: response.longitude,
                latitude: response.latitude,
                postcode: response.address.postcode,
                country: response.address.country.id,
                countryName: response.address.country.name,
                propertyType: response.propertyType.id,
                propertyTypeName: response.propertyType.name,
                roomType: response.roomType,
                capacity: response.capacity,
                bedNo: response.bedNo,
                bathRooms: response.bathRooms,
                bedNoRoom:response.bedRooms,
                amini: response.amenityList,
                aminities: response.amenityList,
                accomodationRating: response.accomodationRating,
                data: response.mediaList,
                featuredPicture: response.featuredPicture,
                images: uploaded,
                cleaningFee:response.cleaningFee,
                rules: {
                    isSmokingAllowed: response.rule.isSmokingAllowed,
                    isPetsAllowed: response.rule.isPetsAllowed,
                    isInfantsAllowed: response.rule.isInfantsAllowed,
                    checkInTime: response.rule.checkInTime,
                    checkOutTime: response.rule.checkOutTime
                 },
                accommodationOwnerId: response.owner.id,
                ajaxLoading: false,
                selectedCancellationPolicy: response.cancellationPolicy != null ? response.cancellationPolicy.id : "",
                displayPrice:response.displayPrice
            })
        }

        let onFailMethod = (err) => {
            //console.log("I am from getAccommodation");
            //console.log(err.responseText);
            self.setState({
                accommodationNotFound: true,
                ajaxLoading: false
            })
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *Initial call
     *
     */
    componentDidMount() {
        $('[name="name"]').focus();
        window.scrollTo(0, 0);
        if (localStorage.getItem("status")){
            this.setState({
                successfullyUpdated: true
            })
            localStorage.removeItem("status");
        }
        this.getCountry();
        this.getPropertyType();
        this.getRoomType();
        this.getAminityType();
        this.getCancellationPolicies();
        if (this.getAccommodationId() > 0){
            this.getAccommodation();
        }
        if (userLoggedIn){
            this.getCurrentLoggedInUserId();
        }

    }

    getCancellationPolicies(){
        const self = this;

        let url = baseMVacationApiUrl + '/cancellation-policy?size=-1';

        let onSuccessMethod = (data) => {
            self.setState({
                cancellationPolicies: data.items,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     * @returns {number}
     */
    getAccommodationId(){
        let currentLocation = window.location.href;
        let lastPart = currentLocation.substr(currentLocation.lastIndexOf('/') + 1);
        var accommodationId = 0;
        var regex=/^[0-9]+$/;
        if (lastPart == "accommodation"){
            accommodationId = 0;
        } else if(!lastPart.match(regex)) {
            accommodationId = 999999999;
        } else {
            accommodationId = lastPart;
        }

        return accommodationId;
    }

    getCurrentLoggedInUserId(){
        var url = baseMVacationApiUrl + "/user/0";
        let self = this;

        let onSuccessMethod = (data) => {
            self.setState({
                currentLoggedUserId: data.id
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    /**
     *
     *
     */
    update(accomodation) {
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/' + this.getUrlId();

        let onSuccessMethod = (data) => {
            //window.scrollTo(0, 0);
            localStorage.setItem("status", 'Successfully Updated' + "!");
            window.location = window.location.href;
            //self.setState({msg: [response.data.name + ' Accommodation Updated ']});
            //self.setState({type: false});
        }

        let onFailMethod = (err) => {
            //console.log(err);
            window.scrollTo(0, 0);
            var data = [
                {
                    "id": 0,
                    "name": "",
                    "mediaType": "",
                    "url": baseCmsUrl + "/storage/app/media/text.png"
                }];
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

            self.setState({type: true});
            self.setState({msg: errArr});
            if (self.state.data.length == 0) {
                self.setState({
                    data: data
                })
            }
        }

        ajaxCall(url, "PUT", accomodation, onSuccessMethod, onFailMethod);
    }
    /**
     *
     *
     */
    create(accomodation) {

        const self = this;

        let url = baseMVacationApiUrl + '/accommodation';

        let onSuccessMethod = (data) => {
            window.location.assign(baseCmsUrl + '/accommodation/' + data.id );
            self.setState({type: false});
        }

        let onFailMethod = (err) => {
            window.scrollTo(0, 0);
            var data = [
                {
                    "id": 0,
                    "name": "",
                    "mediaType": "",
                    "url": baseCmsUrl + "/storage/app/media/text.png"
                }
            ];
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

            self.setState({type: true});
            self.setState({msg: errArr});
            if (self.state.data.length == 0) {
                self.setState({
                    data: data
                })
            }
            self.setState({errors: {"name": '1', isLoading: false}});
        }

        ajaxCall(url, "POST", accomodation, onSuccessMethod, onFailMethod);
    }

    /**
     *
     */
    submitForm() {
        if (this.state.data[0].id == 0) {
            var arr = this.state.data;
            arr.splice(0, 1);
            this.setState({data: arr});
        }
        if(this.state.selectedCancellationPolicy == ""){
            this.setState({selectedCancellationPolicy: "FLEXIBLE"});
        }
        var accomodation = {
            "name": this.state.name,
            "description":this.state.description,
            "address": {
                "line1": this.state.line1,
                "line2": this.state.line2,
                "state": this.state.state,
                "city": this.state.city,
                "postcode": this.state.postcode,
                "country": {
                    "id": this.state.country
                }
            },
            "longitude": this.state.long,
            "latitude": this.state.lati,
            "propertyType": {"id": this.state.propertyType},
            "roomType":  this.state.roomType,
            "capacity": this.state.capacity,
            "bedNo": this.state.bedNo,
            "bathRooms": this.state.bathRooms,
            "bedRooms":this.state.bedNoRoom,
            "packageList": null,
            "listingList": null,
            "rule": this.state.rules,
            "amenityList": this.state.amini,
            "mediaList": this.state.data,
            "featuredPicture": this.state.featuredPicture.id > 0 ? this.state.featuredPicture : null,
            "cleaningFee": this.state.cleaningFee,
            "status":this.state.accommodationStatus,
            "cancellationPolicy" : {
                id: this.state.selectedCancellationPolicy != "" ? this.state.selectedCancellationPolicy : "FLEXIBLE"
            }

        };
        //console.log("111" + JSON.stringify(accomodation));
        if (this.getUrlId()=='accommodation' || this.getUrlId()=='') {
            this.create(accomodation);

            // clear browser soft save data
            localStorage.removeItem("form_data_");
        } else {
            this.update(accomodation);
            // clear browser soft save data
            localStorage.removeItem("form_data_" + this.state.accommodationId);
        }

    }

    /**
     * get aminities
     */
    getCountryById(country_id) {
        const self = this;

        let url = baseMVacationApiUrl + '/country/'+  country_id;

        let onSuccessMethod = (data) => {
            self.setState({
                countryName: data.name,
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);

    }
    handleSubmitClick(button){
        this.state.accommodationStatus = button.target.value;
    }
    /**
     * after submit form
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
        var address='';
            if(this.state.city && this.state.state) {
                var address = this.state.city.replace(/ |,/g, '-') + "+" + this.state.state.replace(/ |,/g, '-') + "+" + this.state.countryName.replace(/ |,/g, '-');
           }
           let param = 'sensor=false&address=' + address;
            const self = this;

            let url = 'https://maps.googleapis.com/maps/api/geocode/json?' + param;
            let ctype = "google-api";
            let onSuccessMethod = (data) => {
                self.setState({
                    long: data.results.length > 0 ? data.results[0].geometry.location.lng:null
                });
                self.setState({
                    lati: data.results.length > 0 ? data.results[0].geometry.location.lat:null
                });
                self.submitForm();
            }

            let onFailMethod = (err) => {
                console.log(err.responseText);
                self.submitForm();
            }

            ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod, ctype);
    }

    /**
     *
     * @param e
     */
    handleAminity(e) {
        var arr2 = [];
        if (e.target.checked) {
            var arr = this.state.amini;
            arr.push({id: e.target.value});
            this.setState({amini: arr});

            var arr1 = this.state.aminities;
            for (var i = 0; i < arr1.length; i++) {
                var cur = arr1[i];
                if (cur.id == e.target.value) {
                    arr1.splice(i, 1);
                    //break;
                }
            }
            arr1.push({id: e.target.value});
            this.setState({aminities: arr1});
        } else {
            var arr = this.state.amini;
            for (var z = 0; z < arr.length; z++) {
                var cur3 = arr[z];
                if (cur3.id == e.target.value) {
                    arr.splice(z, 1);
                    //break;
                }
            }
            this.setState({amini: arr});
            arr2 = this.state.aminities;
            for (var j = 0; j < arr2.length; j++) {
                var cur1 = arr2[j];
                if (cur1.id == e.target.value) {
                    arr2.splice(j, 1);
                    //break;
                }
            }
            arr2.push({id: ''});
            this.setState({
                aminities: arr2
            });
        }

        var newArr = [];
        for (var y = 0; y < this.state.amini.length; y++) {
            if (this.state.amini[y].id != '') {
                newArr.push({id: this.state.amini[y].id});
            }
        }
        this.setState({
            amini: newArr
        });
    }

    /**
     *
     * @param e
     */
    handleRuleChange(e) {
        const isPublished = e.target.value === 'true' ? true: false;
        this.state.rules[e.target.name] = isPublished;
        var newArr = [];
        for (var i = 0; i < this.state.rules.length; i++) {
            if (this.state.rules[i].id != null) {
                newArr.push({id: this.state.rules[i].id});
            }
        }
        this.modifyState({
            rules: this.state.rules
        });
    }

    /**
     *
     * @param e
     */
    handleChange(e) {
        this.modifyState({[e.target.name]: e.target.value});
    }

    modifyState(param){
        var key = "form_data_";
        if( this.state.accommodationId != "" ){
            key = key + this.state.accommodationId;
        }
        param.unsavedData = true;
        //console.log("persisting state...");
        this.setState(param, () => { localStorage.setItem(key, JSON.stringify(this.state)) });
    }
    /**
     * upload image
     */
    uploadImg(e){
        e.preventDefault();
        const image = e.target.files[0];
        var data = new FormData();
        data.append('file', image);
        this.modifyState({
            filename: image.name,
            filetype: image.type
        });
        const self = this;
        let url = baseMVacationApiUrl + '/mediaform';
        let ctype = "media";
        let onSuccessMethod = (data) => {
            const uploaded = baseMVacationApiUrl +'/media/' + data.id +'/data?size=50x50';
            const uploadedResData = data;
            if(self.state.images.length==5) {
                self.modifyState({
                    disable:'disabled'
                })
            }
            if(self.state.data[0].id==0) {
                var arr = self.state.data;
                arr.splice(0, 1);
                self.modifyState({data: arr});
            }
            let updatedImages = Object.assign([],self.state.images)
            let updatedData = Object.assign([],self.state.data)
            updatedImages.push(uploaded)
            updatedData.push(uploadedResData)
            self.modifyState({
                images:updatedImages,
                data:updatedData
            });
            if(self.state.featuredPicture.id == 0){
                self.state.featuredPicture.id = self.state.data[0]["id"];
            }
            self.modifyState({ featuredPicture : {id: self.state.data[0]["id"]} })
        }
        let onFailMethod = (err) => {
            console.log(err.responseText);
        }
        ajaxCall(url, "POST", data, onSuccessMethod, onFailMethod, ctype);
    }

    /**
     *
     * @param e
     */
    setFeaturedPicture(e){
        var mediaList = this.state.data;
        var index = e;
        //console.log("accessed set feature image :", mediaList[index]);

        this.modifyState({
            thumbIndex:index,
            featuredPicture : {id : mediaList[index]["id"]}
        }, function(){
            $("#accom-img-thumb-edit>li>img").removeClass("image-gallery-thumbnail active");
            $("#accom-img-thumb-"+index).addClass("image-gallery-thumbnail active");
        })
    }

    /**
     *
     * @param e
     */
    removeImage(e){
        e.preventDefault();
        let imageIdx = parseInt(e.target.id);
        //console.log("e targett",imageIdx);

        let delFeatured = false;
        if (this.state.data[imageIdx]["id"] == this.state.featuredPicture.id) {
            delFeatured = true;
        }

        let updatedImages = Object.assign([],this.state.images)
        let updatedData = Object.assign([],this.state.data)
        updatedImages.splice(e.target.id,1)
        updatedData.splice(e.target.id,1)

        this.modifyState({
            images:updatedImages,
            data:updatedData,
            disable:''
            }, function(){
                if (delFeatured) {
                    this.setFeaturedPicture(0);
                 }
            });

        if(this.state.data.length==1) {
            var data =[
                {
                    "id":0,
                    "name":"",
                    "mediaType":"",
                    "url": baseCmsUrl +"/storage/app/media/text.png"
                }
            ];
            this.modifyState({
                data: data
            })
        }
    }

    /**
     * get Country
     *
     */
    getCountry(){
        const self = this;
        let url = baseMVacationApiUrl + '/country?size=-1&offset=0';
        let onSuccessMethod = (data) => {
            self.setState({
                countryList: data.items,
            })
        }
        let onFailMethod = (err) => {
            console.log(err.responseText);
        }
        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    handleCancellationPolicyChange(e){
        this.modifyState({
            selectedCancellationPolicy: e.target.id,
        });
    }

    showCancellationPolicy(e){
        e.preventDefault();
        //console.log(e.target.id);
        var mymodal = $('#cancellationPolicyModal');
        var bodyContent = $("div#" + e.target.id).html();
        var modalTitle = e.target.title;
        //console.log(modalTitle);

        mymodal.find('.modal-title').text(modalTitle);
        mymodal.find('.modal-body').append(bodyContent);
        mymodal.modal('show');
    }
    getAccommodationForm(){
        var capacity =[];
        var bedNo = [];
        var bathRooms = [];
        var bedNoRoom = [];
        var checkInTimes = [];
        var checkOutTimes = [];
        var min = "";
        var self = this;

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
            bedNoRoom.push({value: i, label: i})
        }

        for(var i = 0; i <= 23; i++){
            for(var m=0; m<=1; m++){
                (m===0) ? min="00" : min="30";
                checkInTimes.push({value: i+":"+min, label: i+":"+min})
            }
        }

        for(var i = 0; i <= 23; i++){
            for(var m=0; m<=1; m++){
                (m===0) ? min="00" : min="30";
                checkOutTimes.push({value: i+":"+min, label: i+":"+min})
            }
        }


        const country = this.state.countryList;
        const propertyType = this.state.property;
        const roomType = this.state.room;
        const { t } = this.props;
        const { errors } = this.state;

        var placeholder = <span>{t("Select")} </span>;
        var featuredPictureId = this.state.featuredPicture ? this.state.featuredPicture.id :0;
        var media = this.state.data;

        const list = this.state.images.map((image,i)=>{
            return (
                <li style={{display:'inline-block'}} key={i}>
                    {(media[i]["id"] == featuredPictureId) ?
                    <img  style={{width: 50, height:50}} src={image} className="image-gallery-thumbnail active" id={"accom-img-thumb-"+i} onClick={this.setFeaturedPicture.bind(this, i)}/>
                    :
                    <img  style={{width: 50, height:50}} src={image} id={"accom-img-thumb-"+i} onClick={this.setFeaturedPicture.bind(this, i)}/>
                    }
                    <span style={{display:'block'}}><a href="#" id={i}  onClick={this.removeImage.bind(this)}>{t("Remove")}</a>
                    </span>
                </li>
            )
        })
        return (
            <section className="room-register">
                <div className="container ">
                    <div className="row ">
                        <div className="center section-title"></div>
                       <br/>
                        <MessageAccommodation errors={this.state.msg} type={this.state.type}></MessageAccommodation>
                        <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data" id="accommodation-form">
                            <div className="container">
                                <div className="row textarea">
                                    <div className="col-sm-3" alt="Accomodation Details">{t("Property Picture")}<span className="hrlong-double hidden-xs"></span></div>
                                    <div className="col-sm-9">
                                            <div className="carousel slide " id="myCarousel">
                                                <div className="carousel-inner">
                                                    <Carousel showThumbs={false} selectedItem={this.state.thumbIndex}>
                                                        {
                                                            this.state.data.map((text, i) => {
                                                                return(
                                                                    <div  key={i}>
                                                                        <img src= {text.id ? baseMVacationApiUrl +'/media/' + text.id +'/data?size=700x500' : text.url}/>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </Carousel>
                                                </div>
                                                <ul id="accom-img-thumb-edit">
                                                    {list}
                                                </ul>
                                                 <span style={{display:'block'}}>{t("Please select featured picture by clicking on the icon")}
                                                 </span>
                                            </div>

                                        <div className="form-group">
                                            <label><small>{t("Maximum up : xx MB / 6 sheets")}</small></label>
                                            <div className="fileUpload btn btn-default">
                                                <span>+</span>
                                                <input type="file" className="upload" disabled={this.state.disable} onChange={this.uploadImg.bind(this)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row textarea">
                                    <div className="col-sm-3 side-title  hidden-xs" alt="amenity-details">{t("Property Info")}<span className="hrshort hidden-xs"></span></div>
                                    <div className="center visible-xs amenity" alt="amenity-details"><h1><small>{t("Property Info")}</small></h1></div>
                                    <center><div className="divider visible-xs "></div></center>
                                    <div className="col-sm-9 ">
                                        <div className="form-group col-12">
                                            <TextFieldGroup
                                                error={errors.name}
                                                label={t("Name")}
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.name}
                                                field="name"
                                                placeholder={t("Name")}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group col-12">
                                            <label>{t("Detail")}</label>
                                            <textarea placeholder={t("Detail")} name="description"  value={this.state.description} rows="8" className="form-control " onChange={this.handleChange.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row textarea">
                                    <div className="col-sm-3 side-title  hidden-xs" alt="Accomodation Details">{t("Property Detail")}<span className="hrshort hidden-xs"></span></div>
                                    <div className="center visible-xs amenity" alt="amenity-details"><h1><small>{t("Property Detail")}</small></h1></div>
                                    <center><div className="divider visible-xs "></div></center>
                                    <div className="col-sm-9 ">
                                        <div className="col-6 col-sm-6 col-md-3 form-group">
                                            <label>{t("Property type")}</label>
                                            <Select  autofocus options={propertyType} placeholder={placeholder}  simpleValue clearable={this.state.clearable} name="propertyType"  value={this.state.propertyType} onChange={this.switchPropertyType.bind(this)} searchable={this.state.searchable} labelKey="name"
                                                    valueKey="id" />
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-3 form-group">
                                            <label>{t("Room Type")}</label>
                                            <Select   autofocus options={roomType} placeholder={placeholder}  simpleValue clearable={this.state.clearable} name="roomType"  value={this.state.roomType} onChange={this.switchRoomType.bind(this)} searchable={this.state.searchable} labelKey="name"
                                                    valueKey="name" />
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-3 form-group">
                                            <label>{t("Capacity")}</label>
                                            <Select  autofocus options={capacity}  placeholder={placeholder} simpleValue clearable={this.state.clearable} name="capacity"  value={this.state.capacity}  onChange={this.switchCapacity.bind(this)} searchable={this.state.searchable} />
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-3 form-group">
                                            <label>{t("Number Of Beds")}</label>
                                            <Select  autofocus options={bedNo} placeholder={placeholder} simpleValue clearable={this.state.clearable} name="bedNo"  value={this.state.bedNo}  onChange={this.switchBedNo.bind(this)} searchable={this.state.searchable} />
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-3 form-group">
                                            <label>{t("Bath Rooms")}</label>
                                            <Select   autofocus options={bathRooms} placeholder={placeholder} simpleValue clearable={this.state.clearable} name="bathRooms"  value={this.state.bathRooms}  onChange={this.switchBathRooms.bind(this)} searchable={this.state.searchable} />
                                        </div>
                                        <div className="col-6 col-sm-6 col-md-3 form-group">
                                            <label>{t("Number Of Rooms")}</label>
                                            <Select  autofocus options={bedNoRoom} placeholder={placeholder} simpleValue clearable={this.state.clearable} name="bedNoRoom"  value={this.state.bedNoRoom}  onChange={this.switchBedNoRoom.bind(this)} searchable={this.state.searchable} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row textarea">
                                    <div className="col-sm-3 side-title  hidden-xs" alt="amenity-details">{t("Street Address")}<span className="hrlong hidden-xs"></span></div>
                                    <div className="center visible-xs amenity" alt="amenity-details"><h1><small>{t("Street Address")}</small></h1></div>
                                    <center><div className="divider visible-xs "></div></center>
                                    <div className="col-sm-9 ">
                                        <div className="col-sm-6 form-group1">
                                            <label>{t("Country")}</label>
                                            <Select   autofocus options={country} placeholder={placeholder} simpleValue clearable={this.state.clearable} name="selected-country"  value={this.state.country} onChange={this.switchCountry.bind(this)} searchable={this.state.searchable} labelKey="name"
                                                    valueKey="id" />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.postcode}
                                                label={t("Postal code")}
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.postcode}
                                                field="postcode"
                                                placeholder={t("Postal code")}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.state}
                                                label={t("State")}
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.state}
                                                field="state"
                                                placeholder={t("State")}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.city}
                                                label={t("City")}
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.city}
                                                field="city"
                                                placeholder={t("City")}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-12 form-group">
                                            <TextFieldGroup
                                                error={errors.line1}
                                                label={t("Line1")}
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.line1}
                                                field="line1"
                                                placeholder={t("Line1")}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-12 form-group">
                                            <TextFieldGroup
                                                error={errors.line2}
                                                label={t("Line2")}
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.line2}
                                                field="line2"
                                                placeholder={t("Line2")}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row textarea">
                                    <div className="col-sm-3 side-title  hidden-xs amenity" alt="amenity-Regulation">{t("Amenity Rule")}<span className="hrlong hidden-xs"></span></div>
                                    <div className="center visible-xs amenity" alt="amenity-details"><h1><small>{t("Amenity Rule")}</small></h1></div>
                                    <center><div className="divider visible-xs "></div></center>


                                    <div className="col-6 col-sm-6 col-md-3 form-group">
                                        <h5>{t("Check In Time")}</h5>
                                        <Select   autofocus options={checkInTimes} placeholder={placeholder}  simpleValue clearable={this.state.clearable} name="checkInTime"  value={this.state.rules.checkInTime} onChange={this.switchCheckInTime.bind(this)} searchable={this.state.searchable} />
                                    </div>
                                    <div className="col-6 col-sm-6 col-md-3 form-group">
                                        <h5>{t("Check Out Time")}</h5>
                                        <Select   autofocus options={checkOutTimes} placeholder={placeholder}  simpleValue clearable={this.state.clearable} name="checkOutTime"  value={this.state.rules.checkOutTime} onChange={this.switchCheckOutTime.bind(this)} searchable={this.state.searchable} />
                                    </div>

                                    <div className="col-sm-9">
                                        <div className="center">
                                            <div className="rules-list">
                                                <h5>{t("Pet")}</h5>
                                                <div className="radio-inline">
                                                    <input type="radio" id="s-option" name="isPetsAllowed" value="true"
                                                           checked={this.state.rules.isPetsAllowed ===true}
                                                           onChange={this.handleRuleChange.bind(this)}
                                                    />
                                                        <label htmlFor="man">{t("Allowed")}</label>
                                                </div>
                                                <div className="radio-inline">
                                                    <input type="radio" id="s-option" name="isPetsAllowed" value="false"
                                                           checked={this.state.rules.isPetsAllowed ===false}
                                                           onChange={this.handleRuleChange.bind(this)}/>
                                                        <label>{t("NotAllowed")}</label>
                                                </div>
                                            </div>
                                            <div className="rules-list">
                                                <h5>{t("Smoking")}</h5>
                                                <div className="radio-inline">
                                                    <input type="radio"  name="isSmokingAllowed" value="true"
                                                           checked={this.state.rules.isSmokingAllowed ===true}
                                                           onChange={this.handleRuleChange.bind(this)}
                                                    />
                                                        <label htmlFor="man">{t("Allowed")}</label>
                                                </div>
                                                <div className="radio-inline">
                                                    <input type="radio"  name="isSmokingAllowed" value="false"
                                                           checked={this.state.rules.isSmokingAllowed ===false}
                                                           onChange={this.handleRuleChange.bind(this)}
                                                    />
                                                        <label>{t("NotAllowed")}</label>
                                                </div>
                                            </div>
                                            <div className=" rules-list">
                                                <h5>{t("Infant")}</h5>
                                                <div className="radio-inline">
                                                    <input type="radio" id="s-option" name="isInfantsAllowed" value="true"
                                                           checked={this.state.rules.isInfantsAllowed ===true}
                                                           onChange={this.handleRuleChange.bind(this)}
                                                    />
                                                        <label htmlFor="man">{t("Allowed")}</label>
                                                </div>
                                                <div className="radio-inline">
                                                    <input type="radio" id="s-option" name="isInfantsAllowed" value="false"
                                                           checked={this.state.rules.isInfantsAllowed ===false}
                                                           onChange={this.handleRuleChange.bind(this)}
                                                    />
                                                        <label>{t("NotAllowed")}</label>
                                                </div>
                                            </div>
                                            {/*//CEO said there will be further rules in future
                                            <div className="rules-list mt-20">
                                                <span data-toggle="collapse" data-target="#addMore"><small className="main-color">{t("See More Rules")}</small></span>
                                                <div id="addMore" className="collapse rules-list" >
                                                    <div className="rules-list sm-text">
                                                        <h5>Party</h5>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="1" name="party" id="man" />
                                                                <label htmlFor="man">Allow</label>
                                                        </div>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="2" name="party" id="woman" />
                                                                <label>Not Allow</label>
                                                        </div>
                                                    </div>
                                                    <div className="rules-list">
                                                        <h5>Party</h5>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="1" name="1" id="man" />
                                                                <label htmlFor="man">Allow</label>
                                                        </div>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="2" name="1" id="woman" />
                                                                <label>Not Allow</label>
                                                        </div>
                                                    </div>
                                                    <div className="rules-list">
                                                        <h5>Party</h5>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="1" name="2" id="man" />
                                                                <label htmlFor="man">Allow</label>
                                                        </div>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="2" name="2" id="woman" />
                                                                <label>Not Allow</label>
                                                        </div>
                                                    </div>
                                                    <div className="rules-list">
                                                        <h5>Party</h5>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="1" name="3" id="man" />
                                                                <label htmlFor="man">Allow</label>
                                                        </div>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="2" name="3" id="woman" />
                                                                <label>Not Allow</label>
                                                        </div>
                                                    </div>
                                                    <div className="rules-list">
                                                        <h5>Party</h5>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="1" name="4" id="man" />
                                                                <label htmlFor="man">Allow</label>
                                                        </div>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="2" name="4" id="woman" />
                                                                <label>Not Allow</label>
                                                        </div>
                                                    </div>
                                                    <div className="rules-list">
                                                        <h5>Party</h5>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="1" name="5" id="man" />
                                                                <label htmlFor="man">Allow</label>
                                                        </div>
                                                        <div className="radio-inline">
                                                            <input type="radio" value="2" name="5" id="woman" />
                                                                <label>Not Allow</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group  col-sm-9 col-md-12">
                                                <textarea placeholder={t("Enter additional rules here")} rows="3" className="form-control"></textarea>
                                            </div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div className="row textarea">
                                    <div className="col-sm-3 side-title  hidden-xs" alt="amenity-details">{t("Aminities")}<span className="hrlong hidden-xs"></span></div>
                                    <div className="center visible-xs " alt="amenity-details"><h1><small>{t("Aminities")}</small></h1></div>
                                    <center><div className="divider visible-xs "></div></center>
                                    <div className=" col-md-9 col-sm-9  col-12">
                                        {this.state.aminity.map((text, i) => {

                                            var check = false;
                                            $.each(this.state.aminities, function(i,obj) {
                                                if (obj.id == text.id) { check = true; return false;}
                                            });
                                            return(
                                        <div className=" col-md-4 col-sm-4 col-4 checkbox">
                                            <label>
                                                <input type="checkbox" name="aminities" id={i}
                                                       value={text.id}
                                                       checked={check}
                                                       onChange={this.handleAminity.bind(this)} />
                                                <span className="cr"><i className="cr-icon fa fa-check"></i></span>
                                                {text.name}
                                            </label>
                                        </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                                <div className="row textarea">
                                    <div className="col-sm-3 side-title  hidden-xs" alt="amenity-details">{t("Cleaning Fee")}<span className="hrshort hidden-xs"></span></div>
                                    <div className="center visible-xs amenity" alt="amenity-details"><h1><small>{t("Cleaning Fee")}</small></h1></div>
                                    <center><div className="divider visible-xs "></div></center>
                                    <div className="col-sm-9 ">
                                        <div className="form-group col-12">
                                            <TextFieldGroup
                                                error={errors.cleaningFee}
                                                label={t("Cleaning Fee") + "(円)"}
                                                onChange={this.handleChange.bind(this)}
                                                value={this.state.cleaningFee}
                                                field="cleaningFee"
                                                placeholder={t("Cleaning Fee")}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row textarea">
                                    <div className="col-sm-3 side-title  hidden-xs" alt="amenity-details">{t("Cancellation policy")}<span className="hrshort hidden-xs"></span></div>
                                    <div className="center visible-xs " alt="amenity-details"><h1><small>{t("Cancellation policy")}</small></h1></div>
                                    <center><div className="divider visible-xs "></div></center>
                                    <div className=" col-md-9 col-sm-9  col-12 cancellation-policy" >
                                        <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                        {this.state.cancellationPolicies.map((item, i) => {
                                          return(
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id={"headingOne-"+i}>
                                            <span className="panel-title">
                                            <input type="radio" value="Flexible" name="cancel-policy"  style={{height:'18px', width: '20px'}} id={item.id} checked={(this.state.selectedCancellationPolicy == "" && i == 0) || (this.state.selectedCancellationPolicy != "" && this.state.selectedCancellationPolicy == item.id)}
                                                   onChange={this.handleCancellationPolicyChange.bind(this)}/>
                                            <a href={"#collapseOne-"+i} className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion"  aria-expanded="false" aria-controls={"collapseOne-"+i}>
                                            {item.name}
                                            </a>
                                            </span>
                                                </div>
                                                <div id={"collapseOne-"+i} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"headingOne-"+i}>
                                                    <div className="panel-body">
                                                        <ul className="list-group" >
                                                            <li><big><b>{item.description}</b></big></li><br/>
                                                            {
                                                                item.notice.map((it, j) => {
                                                                    return (
                                                                        <li> <b> {it.days} {it.days > 1 ? t("Days ago") : t("Day ago")} : </b><br className="visible-xs" />&nbsp; {t("Refund of total accommodation fee")} {it.refund} %<br/></li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                          )
                                        })
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <center style={{marginBottom:'100px'}}>
                                <button onClick={this.handleSubmitClick.bind(this)}  type="submit" className="btn btn-lg button-medium"   value="PUBLISHED">{t("Publish")}</button>
                                <button onClick={this.handleSubmitClick.bind(this)}   type="submit" className="btn btn-lg button-medium second" value="DRAFT">{t("Draft")}</button>
                            </center>
                        </form>
                    </div>
                </div>
            </section>
        )
    }
    getAccommodationView(){
        let accommodation = {
            accommodationId: this.state.accommodationId,
            accommodationName: this.state.name,
            accommodationLocation: this.state.city +  "." +this.state.countryName,
            accommodationImage: this.state.data.length > 0 ?  this.state.data[0].url : "",
            accommodationImageId: this.state.data.length > 0 ? this.state.data[0].id : "",
        };
        return (
            <Room  translations={translations}
				   accommodation = {accommodation}
				   roomName={this.state.name}
				   ImageInfo={this.state.data}
				   description={this.state.description}
				   capacity={this.state.capacity}
				   roomType={this.state.roomType}
				   propertyType={this.state.propertyTypeName}
				   bedNo={this.state.bedNo}
				   bathRooms={this.state.bathRooms}
				   rules={this.state.rules}
				   aminities={this.state.aminities}
				   line1={this.state.line1}
				   city={this.state.city}
                   cleaningFee={this.state.cleaningFee}
				   state={this.state.state}
				   longitude={this.state.longitude}
				   latitude={this.state.latitude}
				   postcode={this.state.postcode}
				   accomodationRating={this.state.accomodationRating}
                   owner={this.state.owner}
				   currentUserId={this.state.currentLoggedUserId}
                   featuredPicture={this.state.featuredPicture}
                   selectedCancellationPolicyDetails = {this.getSelectedCancellationPolicyDetails()}
                   displayPrice={this.state.displayPrice}
				   {...this.props} />
        )
    }


    getSelectedCancellationPolicyDetails(){
        var selectedPolicy = this.state.selectedCancellationPolicy;
        var notices = [];
        var retVal = null;
        this.state.cancellationPolicies.forEach(function (item) {
            if(item.id.trim().toString() === selectedPolicy.trim().toString()) {
                item.notice.forEach(function (it){
                    notices.push({days: it.days, refund: it.refund});
                });
                retVal = {
                   id: item.id,
                   defaultDescription: item.defaultDescription,
                   name: item.name,
                   notice: notices,
                   description: item.description
               };
               return true;
            }
        });
        return retVal;
    }

    render() {
        //console.log("Unsaved data: " + this.state.unsavedData);
        const { t } = this.props;
        var mode = "new";
        var currentUserId = (this.state.currentLoggedUserId);
        var accommOwnerId = (this.state.accommodationOwnerId);
        // accommodation owner is viewing his own property
        if(this.getAccommodationId() > 0 && (currentUserId > 0 && currentUserId == accommOwnerId)) {
            mode = "edit";
        } else if(this.getAccommodationId() > 0){
            mode = "view";
        }

        //console.log("current user id:" + currentUserId);
        //console.log("accommodation owner user id:" + accommOwnerId);

        //console.log("mode:" + mode);

    if (mode != "new" && this.state.ajaxLoading == true){
            //console.log("I am in if block");
        return (
            <div className="col-md-12 pull-center ajax-loading" style={{marginTop: "130px"}}></div>
        );
    }


    //if(this.state.ajaxLoading == false){
        if (mode == "view" && (this.state.accommodationNotFound)){
            return (
                <div className="container">
                    <div className="alert alert-warning alert-dismissable" style={{marginTop: "6em"}}>
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>{t("Info")}!</strong>{t("No Such accommodation found")}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container">
                    {
                        this.state.unsavedData == true ?
                            <div id="unsave-notification" style={{color: "RED", float: "right", marginTop: "8em", fontWeight: "bold"}}><i className="fa fa-info-circle" aria-hidden="true"></i> {t("You have some unsaved data!")}</div> : null
                    }
                    <div className="center section-title">
                        { mode == "edit" || mode == "view" ?
                            <h3>{t("Property Page")}</h3>
                            : <h3>{t("Accommodation")}</h3>
                        }
                        { this.state.successfullyUpdated ?
                            <div style={{textAlign: 'left'}}><div className="alert alert-success alert-dismissable" style={{marginTop: "1em",fontSize:'11px'}}>
                                <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                <strong style={{"float": "left"}}>&nbsp;</strong>
                                <dd>{t("Successfully Updated")}</dd>
                            </div></div>
                            : null
                        }
                    </div>
                    { mode == "edit" ?
                        <ul className="nav nav-tabs">
                            <li className="active sliding-middle-out"><a href="#tab1" data-toggle="tab">{t("View")}</a></li>
                            <li className="sliding-middle-out"><a href="#tab2" data-toggle="tab">{t("Edit")}</a></li>
                        </ul>
                        : null
                    }

                    <div className="tab-content">
                        {
                            mode == "edit" ?
                                <div className="tab-pane fade in active" id="tab1">
                                    { this.getAccommodationView() }
                                </div>
                                : mode == "view" ? <div>{ this.getAccommodationView() }</div> : null
                        }

                        { mode == "edit"  ?
                            <div className="tab-pane fade in" id="tab2">
                                {this.getAccommodationForm()}
                            </div>
                            : mode != "view" && userLoggedIn ? <div>{this.getAccommodationForm()} </div> :
                                null
                        }
                    </div>
                </div>
            );
        }

   /* } else {
        console.log("i am in else");
        return (
            <div className="col-md-12 pull-center ajax-loading" style={{marginTop: "130px"}}></div>
        );
    } */
    }
}
export default TranslationWrapper(translate("Accommodation")(Accommodation))