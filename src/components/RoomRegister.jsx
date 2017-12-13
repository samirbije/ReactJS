import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Select from 'react-select';
import { translate } from "react-translate"
import TranslationWrapper from "./i18n/TranslationWrapper"

//internal
import MessageAccommodation from './common/MessageAccommodation';
import TextFieldGroup from './common/TextFieldGroup';


class RoomRegister extends React.Component{
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
            data : [
                {
                    "id":0,
                    "name":"",
                    "mediaType":"",
                    "url": baseCmsUrl +"/storage/app/media/text.png"
                }
            ],
            country: 'JP',
            countryList: [],
            disabled: false,
            searchable: this.props.searchable,
            selectValue: '',
            state:'',
            selectValue1: '',
            clearable: false,
            coun: 'JP',
            property:[],
            room:[],
            amini:[

            ],
            aminity:[

            ],
            accomodation:{
            },
            images:[],
            errors: {},
            isLoading: false,
            type: false,
            msg:[],
            imageName:'',
            mediaType:'',
            url:'',
            long:0,
            lati:0,
            disable:''
        }
    }
    /**
     * for sate dropdown
     * @param newValue
     */
    updateValue (newValue) {
        //console.log('State changed to ' + newValue);
        this.setState({
            stateValue: newValue,
            clearable: false
        });
    }

    /**
     * change country
     * @param newValue
     */
    switchCountry (newValue) {
        //var newCountry = e.target.value;
        // console.log('Country changed to ' + newValue);
        this.setState({
            country: newValue,
            selectValue: null
        });

    }

    /**
     *
     * @returns {XML}
     */
    getPropertyType(){
        const self = this;
        axios.get(baseMVacationApiUrl + '/property-type?size=100&offset=0')
            .then(function (res) {
                self.setState({
                    property: res.data.items,
                })
            })
            .catch(function(res) {
                if(res instanceof Error) {
                    console.log(res.message);
                } else {
                    console.log(res.data);
                }
            });
    }
    /**
     *
     * @returns {JSON}
     */
    getRoomType(){
        const self = this;
        axios.get(baseMVacationApiUrl + '/room-type?size=100&offset=0')
            .then(function (res) {
                self.setState({
                    room: res.data.items,
                })
            })
            .catch(function(res) {
                if(res instanceof Error) {
                    console.log(res.message);
                } else {
                    console.log(res.data);
                }
            });
    }

    /**
     * get aminities
     */
    getAminityType() {
        const self = this;
        axios.get(baseMVacationApiUrl + '/amenity?offset=0&size=100')
            .then(function (res) {
                self.setState({
                    aminity: res.data.items,
                })
            })
            .catch(function(res) {
                if(res instanceof Error) {
                    console.log(res.message);
                } else {
                    console.log(res.data);
                }
            });
    }
    /**
     *Initial call
     *
     */
    componentDidMount() {
        this.getCountry();
        this.getPropertyType();
        this.getRoomType();
        this.getAminityType();
    }

    /**
     *
     */
    add() {
        if(this.state.data[0].id==0) {
            //  console.log("hhhhh" );
            var arr = this.state.data;
            arr.splice(0, 1);
            this.setState({data: arr});
        }
        this.setState({ errors: {}, isLoading: true });
        var  accomodation = {
            "name":this.state.name,
            "address": {
                "line1" : this.state.line1,
                "line2" : this.state.line2,
                "state" : this.state.state,
                "city" : this.state.city,
                "postcode" : this.state.postcode,
                "country" : {
                    "id" : 6,
                    "countryCode" : this.state.country,
                }
            },
            "longitude": this.state.long,
            "latitude": this.state.lati,
            "propertyType":
                {
                    "name":this.state.propertyType,
                    "id": 1
                },
            "roomType":this.state.roomType,
            "capacity": this.state.capacity,
            "bedNo":this.state.bedNo,
            "bathRooms":this.state.bathRooms,
            "packageList":null,
            "listingList":null,
            "amenityList":
            this.state.amini,
            "mediaList":
            this.state.data
        };
         //console.log('ggg' + JSON.stringify(accomodation));
        const self = this;
/*        axios.post(baseMVacationApiUrl + '/user/0/accommodation', accomodation ,{
            crossDomain: true,
            withCredentials: true
        })
            .then(function (response) {
                self.setState({msg:[ response.data.name + ' Acomodation Created ']});
                self.setState({type:false});
            })
            .catch(function (error) {

                var data =[
                    {
                        "id":0,
                        "name":"",
                        "mediaType":"",
                        "url": baseCmsUrl +"/storage/app/media/text.png"
                    }];
                var errArr = [];
                errArr.push(error.response.data.message);
                error.response.data.details.forEach(function(item){
                    errArr.push(item.message);
                });
                self.setState({type:true});
                self.setState({msg:errArr});
                // self.setState({msg:error.response.data});
                if(self.state.data.length==0) {
                    self.setState({
                        data: data
                    })
                }
                self.setState({ errors:{"name":'1' , isLoading: false}});
            }); */
        let url = baseMVacationApiUrl + '/user/0/accommodation';

        let onSuccessMethod = (data) => {
            self.setState({msg:[data.name + ' Acomodation Created ']});
            self.setState({type:false});
        }

        let onFailMethod = (err) => {
            var data =[
                {
                    "id":0,
                    "name":"",
                    "mediaType":"",
                    "url": baseCmsUrl +"/storage/app/media/text.png"
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
            self.setState({type:true});
            self.setState({msg:errArr});
            // self.setState({msg:error.response.data});
            if(self.state.data.length==0) {
                self.setState({
                    data: data
                })
            }
            self.setState({ errors:{"name":'1' , isLoading: false}});
        }

        ajaxCall(url, "POST", accomodation, onSuccessMethod, onFailMethod);
    }
    /**
     * after submit form
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
        var address = this.state.line1+ "+" +this.state.line1+"+"+
            this.state.stateValue + '+' + this.state.city + '+'
            + this.state.postcode;

        let param = 'sensor=false&address='+address;
        const self = this;
/*
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?'+param)
            .then(function (res) {
                self.setState({
                    long:res.data.results[0].geometry.location.lat
                });
                self.setState({
                    lati:res.data.results[0].geometry.location.lng
                });
                self.add();

            })
            .catch(function(res) {
                if(res instanceof Error) {
                    console.log(res.message);
                } else {
                    console.log(res.data);
                }
                //console.log('ggggg');
                self.add();
            });
*/
        let url = 'https://maps.googleapis.com/maps/api/geocode/json?'+param;

        let onSuccessMethod = (data) => {
            self.setState({
                long: data.results[0].geometry.location.lat
            });
            self.setState({
                lati: data.results[0].geometry.location.lng
            });
            self.add();
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
            self.add();
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    handleFile(e) {
        //console.log('fff'+ e.target.name);
        if(e.target.name=='aminities') {
            // console.log('sfssf');
            var arr = this.state.amini;
            arr.push({id:e.target.value});
            this.setState({amini:arr});
        }
        this.setState({[e.target.name]: e.target.value});
    }

    /**
     * upload image
     */
    uploadImg(e)
    {
        e.preventDefault();
        const image = e.target.files[0];
        var data = new FormData();
        data.append('file', image);

        this.setState({
            filename: image.name,
            filetype: image.type
        });

        const self = this;
/*
        axios.post(baseMVacationApiUrl + '/mediaform', data,{
            crossDomain: true,
            withCredentials: true
        })
            .then(function (response) {
                // console.log("ttt"+response.data.url);
                const uploaded = response.data.url;
                const uploadedResData = response.data;
                if(self.state.images.length==5) {
                    self.setState({
                        disable:'disabled'
                    })
                }
                //console.log("sfsdfsd"+JSON.stringify(self.state.data));
                //console.log("dgdfffff" + self.state.data[0].id);
                if(self.state.data[0].id==0) {
                    //  console.log("hhhhh" );
                    var arr = self.state.data;
                    arr.splice(0, 1);
                    self.setState({data: arr});
                }


                let updatedImages = Object.assign([],self.state.images)
                let updatedData = Object.assign([],self.state.data)
                updatedImages.push(uploaded)
                updatedData.push(uploadedResData)

                self.setState({
                    images:updatedImages,
                    data:updatedData
                })
                //console.log(JSON.stringify(self.state.data));
            })
            .catch(function (error) {
                console.log(error);

            });
*/
        let url = baseMVacationApiUrl + '/mediaform';

        let onSuccessMethod = (data) => {
            // console.log("ttt"+data.url);
            const uploaded = data.url;
            const uploadedResData = data;
            if(self.state.images.length==5) {
                self.setState({
                    disable:'disabled'
                })
            }
            //console.log("sfsdfsd"+JSON.stringify(self.state.data));
            //console.log("dgdfffff" + self.state.data[0].id);
            if(self.state.data[0].id==0) {
                //  console.log("hhhhh" );
                var arr = self.state.data;
                arr.splice(0, 1);
                self.setState({data: arr});
            }


            let updatedImages = Object.assign([],self.state.images)
            let updatedData = Object.assign([],self.state.data)
            updatedImages.push(uploaded)
            updatedData.push(uploadedResData)

            self.setState({
                images:updatedImages,
                data:updatedData
            })
            //console.log(JSON.stringify(self.state.data));
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", data, onSuccessMethod, onFailMethod);
    }
    removeImage(e){
        e.preventDefault()
        // console.log('removeImage' +e.target.id);
        let updatedImages = Object.assign([],this.state.images)
        let updatedData = Object.assign([],this.state.data)
        updatedImages.splice(e.target.id,1)
        updatedData.splice(e.target.id,1)

        this.setState({
            images:updatedImages,
            data:updatedData,
            disable:''
        })
        // console.log("length " + this.state.data.length);
        if(this.state.data.length==1) {
            //console.log("length111 " + this.state.data.length);
            var data =[
                {
                    "id":0,
                    "name":"",
                    "mediaType":"",
                    "url": baseCmsUrl +"/storage/app/media/text.png"
                }];
            this.setState({
                data: data
            })
        }

    }

    /**
     * switch for states
     * @param newValue
     */
   /* getStatesByCountry(newValue){
        //console.log('newValue' + newValue);
        const self = this;
        axios.get('http://localhost/test/state.php?va='+ newValue)
            .then(function (res) {
                self.setState({
                    states: res.data,
                })
            })
            .catch(function(res) {
                if(res instanceof Error) {
                    console.log(res.message);
                } else {
                    console.log(res.data);
                }
            });
    }
*/
    /**
     * get states
     *
     */
    getCountry(){
        const self = this;
/*        axios.get(baseMVacationApiUrl + '/country?size=1000&offset=0')
            .then(function (res) {
                self.setState({
                    countryList: res.data.items,
                })
            })
            .catch(function(res) {
                if(res instanceof Error) {
                    console.log(res.message);
                } else {
                    console.log(res.data);
                }
            }); */
        let url = baseMVacationApiUrl + '/country?size=1000&offset=0';

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

    render() {
        const country = this.state.countryList;
        const { t } = this.props;
        const { errors } = this.state;
        const states = eval(this.state.states);

        var placeholder = <span>&#9786; Select Country </span>;

        const list = this.state.images.map((image,i)=>{
            return (
                <li key={i}>
                    <img  style={{width: 72}} src={image}/>
                    <a href="#" id="{i}" onClick={this.removeImage.bind(this)}>Remove</a>
                </li>
            )
        })

        return (
            <section className="room-register">
                <div className="container">
                    <div className="row">
                        <div className="center section-title"><h3>{t("photo")}</h3></div>
                        <MessageAccommodation errors={this.state.msg} type={this.state.type}></MessageAccommodation>
                        <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
                            <div className="container">
                                <div className="row btn-margin">
                                    <div className="col-sm-3" alt="Accomodation Details">{t("attach")}<span className="hrlong hidden-xs"></span></div>
                                    <div className="col-sm-9 form-acm">

                                        <div className="col-sm-6">
                                            <div  id="carousel-bounding-box">
                                                <div className="carousel slide" id="myCarousel">
                                                    <div className="carousel-inner">
                                                        <Carousel showArrows={true}>
                                                            {
                                                                this.state.data.map((text, i) => {
                                                                    return(
                                                                        <div  key={i}>
                                                                            <img src={text.url} />
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </Carousel>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleInputFile">{t("image")}</label>
                                            <input type="file" id="file"  disabled={this.state.disable} onChange={this.uploadImg.bind(this)}/>
                                            <p><small>  <br/>{t("imageinfo")}</small></p>
                                            <ol>
                                                {list}
                                            </ol>
                                        </div>

                                    </div>
                                </div>
                                <div className="row btn-margin">
                                    <div className="col-sm-3" alt="Accomodation Details">物件情報<span className="hrlong hidden-xs"></span></div>
                                    <div className="col-sm-9 form-acm">
                                        <div className="form-group">
                                            <TextFieldGroup
                                                error={errors.name}
                                                label={t("name")}
                                                onChange={this.handleFile.bind(this)}
                                                value={this.state.name}
                                                field="name"
                                                placeholder="物件名"
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t("detail")}</label>
                                            <textarea placeholder="物件詳細説明" name="detail" rows="3" className="form-control " onChange={this.handleFile.bind(this)}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="row btn-margin">
                                    <div className="col-sm-3"  alt="Accomodation Details">住所<span className="hrlong hidden-xs"></span></div>
                                    <div className="col-sm-9 form-acm">
                                        <div className="col-sm-6 form-group1">
                                            <label>{t("country")}</label>
                                            <Select ref="countryCode"  autofocus options={country} placeholder={placeholder} simpleValue clearable={this.state.clearable} name="selected-country"  value={this.state.country} onChange={this.switchCountry.bind(this)} searchable={this.state.searchable} labelKey="countryName"
                                                    valueKey="countryCode" />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.postcode}
                                                label={t("postcode")}
                                                onChange={this.handleFile.bind(this)}
                                                value={this.state.postcode}
                                                field="postcode"
                                                placeholder="Enter postcode.."
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.city}
                                                label={t("city")}
                                                onChange={this.handleFile.bind(this)}
                                                value={this.state.city}
                                                field="city"
                                                placeholder="Enter city.."
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-6 form-group ">
                                            <TextFieldGroup
                                                error={errors.state}
                                                label={t("state")}
                                                onChange={this.handleFile.bind(this)}
                                                value={this.state.state}
                                                field="state"
                                                placeholder="Enter state.."
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <TextFieldGroup
                                                error={errors.line1}
                                                label={t("line1")}
                                                onChange={this.handleFile.bind(this)}
                                                value={this.state.line1}
                                                field="line1"
                                                placeholder="Enter line1.."
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="col-sm-6 form-group">                                            <TextFieldGroup
                                                error={errors.line2}
                                                label={t("line2")}
                                                onChange={this.handleFile.bind(this)}
                                                value={this.state.line2}
                                                field="line2"
                                                placeholder="Enter line2.."
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row btn-margin">
                                    <div className="col-sm-3" alt="Accomodation Details">お部屋のタイプ<span className="hrlong hidden-xs"></span></div>
                                    <div className="col-sm-9 form-acm">
                                        <div className="col-sm-6 form-group">
                                            <label>{t("propertyType")}</label>
                                            <select className="form-control " name="propertyType" onChange={this.handleFile.bind(this)}>
                                                <option value="">Choose Your Property</option>
                                                {this.state.property.map((text,i) => {
                                                    return(
                                                        <option key={i} value={text.id}>{text.name} </option>
                                                    )
                                                })
                                                }
                                            </select>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <label>{t("roomType")}</label>
                                            <select className="form-control " name="roomType" onChange={this.handleFile.bind(this)}>
                                                <option value="">Choose Your Room</option>
                                                {this.state.room.map((text, i) => {
                                                    return(
                                                        <option key={i} value={text.name}>{text.name} </option>
                                                    )
                                                })
                                                }
                                            </select>

                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <label>{t("capacity")}</label>
                                            <select className="form-control Large " name="capacity" onChange={this.handleFile.bind(this)}>
                                                <option value="">Choose Your People</option>
                                                <option value="1">1 </option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <label>{t("bedNo")}</label>
                                            <select className="form-control Large " name="bedNo" onChange={this.handleFile.bind(this)}>
                                                <option value="">Choose Your bed</option>
                                                <option value="1">1 </option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <label>{t("bathRooms")}</label>
                                            <select className="form-control Large " name="bathRooms" onChange={this.handleFile.bind(this)}>
                                                <option value="">Choose Your No of bed</option>
                                                <option value="1">1 </option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>
                                        <div className="col-sm-3 form-group">
                                            <label>{t("pet")}</label>
                                            <select className="form-control Large " name="pet" onChange={this.handleFile.bind(this)}>
                                                <option value="">Choose Your bath</option>
                                                <option value="1">1 </option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row btn-margin">
                                    <div className="col-sm-3" alt="amenity-details">{t("aminities")}<span className="hrlong hidden-xs"></span></div>
                                    <div className="col-sm-9 checkbox-amenity-line">
                                        {this.state.aminity.map((text, i) => {
                                            return(
                                                <div className="col-sm-3">
                                                    <label class="checkbox-inline">
                                                    <input type="checkbox" name="aminities" id={i}
                                                           value={text.id}
                                                           onChange={this.handleFile.bind(this)} />
                                                   {text.value}</label>
                                                </div>
                                            )
                                        })
                                        }
                                    </div>
                                </div>
                            </div>
                            <center style={{marginBottom:'100px'}}>
                                <button type="submit" className="btn btn-default btn-lg">{t("save")}</button>
                                <button   type="submit" className="btn btn-info btn-lg">{t("publish")}</button>
                            </center>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}
export default TranslationWrapper(translate("RoomRegister")(RoomRegister))
//export default RoomRegister;