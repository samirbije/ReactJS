// external
import React from 'react';
import DayPicker from 'react-day-picker';
import ReactPaginate from 'react-paginate';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
import base64 from 'base-64';
import utf8 from 'utf8';


//import { mount } from 'enzyme';

//internal
import PackageChild from './PackageChild';
import Message from './common/Message';

const LABELS = {
    en: { nextMonth: 'Next Month', previousMonth: 'Previous Month' },
    ja: { nextMonth: '来月', previousMonth: '前月' }
};

const overlayStyle = {
    position: 'absolute',
    background: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0,1)',
    fontSize:'14px',

};
const overlayStyle1 = {
    position: 'absolute',
    background: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0,1)',
    fontSize:'14px',

};
//import styles from './daycalendar1.css';

class PriceCalendar extends React.Component{
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
            selectedDay:{},
            selectedDayNew:null,
            selectedDayEnd:null,
            showOverlay: false,
            showOverlay1: false,
            value: '',
            value1: '',
            locale: 'ja',
            packages:[],
            package: {
                //startDate: null,
               // endDate: null,
                price: -1
            },
            type:false,
            msg:[],
            page:1,
            offset: 0,
            showStore:false,
            cleaningFee:0,
            accommodationOwnerId:0,
            currentLoggedUserId:0,
            ajaxLoading: true,
            typeEdit:false,
            msgEdit:[]
        }
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

    getAccomodationById(){
        /*var text = {
            "id": [this.getAccommodationId()]
        };
        var bytes = utf8.encode(JSON.stringify(text));
        var encoded = base64.encode(bytes);*/
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/' + this.getAccommodationId();

        let onSuccessMethod = (data) => {
            self.setState({
                cleaningFee: data.cleaningFee,
                accommodationOwnerId: data.owner.id,
                ajaxLoading: false
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
            self.setState({
                ajaxLoading: false
            })
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }
    /**
     *
     *
     */
    loadPricesFromServer()
    {
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/'+ this.getUrlId() + '/package';

        let onSuccessMethod = (data) => {
            self.setState({
                packages: data,
                ajaxLoading: false
            })
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }
    /**
     * Remove App
     * @param i
     */
    removeComment(i) {
        var arr = this.state.packages;
        arr.splice(i,1);
        this.setState({packages:arr});
    }

    /**
     * Update apps Array
     * @param id
     * @param newText
     * @param newText1
     * @param i
     */
    updateComment(id,newStart,newEnd,newPrice1,newPrice2,i) {
        var arr = this.state.packages;
        arr[i]= {"id": id, "startDate": newStart, "endDate": newEnd, "price": newPrice1, "cleaningFee": newPrice2};

        this.setState({packages:arr});
        this.setState({typeEdit:false, msgEdit:[] });
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
     *Initial call
     *
     */
    componentDidMount() {
        this.loadPricesFromServer();
        this.getAccomodationById();
        if (userLoggedIn){
            this.getCurrentLoggedInUserId();
        }
    }


    /**
     * Add New App
     *
     */
    add(e) {
        e.preventDefault();
        this.setState({type:false, msg:[] });
        const self = this;

        let url = baseMVacationApiUrl + '/accomodation/'+ this.getUrlId() +'/package';

        let onSuccessMethod = (data) => {
            var arr = self.state.packages;
            arr.push(data);
            self.setState({packages:arr});
            self.setState({showStore: true});
            self.setState({value: '',
                value1:''
            });
            delete self.state.package.startDate;
            delete self.state.package.endDate;
            self.setState({type:false});
            $('#ModalForm').modal('hide');
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

            self.setState({type:true});
            self.setState({msg:errArr});
            // self.setState({msg:error.response.data});
        }

        ajaxCall(url, "POST", this.state.package, onSuccessMethod, onFailMethod);
    }

    updateError(errArr){
        window.scrollTo(0, 0);
        this.setState({typeEdit:true});
        this.setState({msgEdit:errArr});
    }

    removeEdit(){
        this.setState({typeEdit:false});
        this.setState({msgEdit:[]});
    }
    /**
     * state change of every input field
     * handle change event at input form
     * @param {SytheticEvent} e
     */
    onInputChange(e) {
        this.state.package[e.target.name] = e.target.value;
    }

    /**
     *
     * @param e
     */
    handleInputChange = e => {
        const { value } = e.target;
        const momentDay = moment(value, 'L', true);
        if (momentDay.isValid()) {
            this.setState(
                {
                    selectedDayNew: momentDay.toDate(),
                    value,
                },
                () => {
                    this.daypicker.showMonth(this.state.selectedDayNew);
                }
            );
        } else {
            this.setState({ value, selectedDayNew: null });
        }
    };
    /**
     *
     * @param e
     */
    handleInputChange1 = e => {
        const { value1 } = e.target;
        const momentDay = moment(value1, 'L', true);
        if (momentDay.isValid()) {
            this.setState(
                {
                    selectedDayEnd: momentDay.toDate(),
                    value1,
                },
                () => {
                    this.daypicker.showMonth(this.state.selectedDayEnd);
                }
            );
        } else {
            this.setState({ value1, selectedDayEnd: null });
        }
    };
    /**
     *
     * @param page
     */
    changePage(page) {
        let page1 = page.selected+1;
        this.setState({page: page1});
    }

    /**
     *
     * @param day
     */
    handleDayClickStartDate = day => {
        this.setState({
            value: moment(day).format('YYYY-MM-DD'),
            selectedDayNew: day,
            showOverlay: false,
        });
        this.state.package['startDate'] = moment(day).format('YYYY-MM-DD');
        this.input.blur();
    };

    /**
     *
     * @param day
     */
    handleDayClickEndDate = day => {
        this.setState({
            value1: moment(day).format('YYYY-MM-DD'),
            selectedDayEnd: day,
            showOverlay1: false,
        });
        this.state.package['endDate'] = moment(day).format('YYYY-MM-DD');
        this.input.blur();
    };
    /**
     *
     */
    handleInputFocus = () => {
        this.setState({
            showOverlay: true,
        });
    };
    /**
     *
     */
    handleInputFocus1 = () => {
        this.setState({
            showOverlay1: true,
        });
    };

    clickAdd(e){
      this.setState({
            type:false,
            msg:[],
            typeEdit:false,
            msgEdit:[],
        });
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
            <div>
                <code style={{backgroundColor:'white' ,color:'#555'}}>{ date }</code>
                <div>
                    {
                        this.state.packages.map((text, i) => {
                            var listDate = [];
                            var startDate = moment(text.startDate).format('YYYY-MM-DD');
                            var endDate =  moment(text.endDate).format('YYYY-MM-DD');
                            var dateMove = new Date(startDate);
                            var strDate = startDate;

                            while (strDate < endDate){
                                var strDate = dateMove.toISOString().slice(0,10);
                                listDate.push(strDate);
                                dateMove.setDate(dateMove.getDate()+1);
                            };
                            if(listDate.includes(a) == true){
                                return (
                                    <div key={ i } style={{color:'#F4511E'}}>
                                        { (Number(text.price)) }
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        );
    }
    render() {
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
        let per_page =5;
        const pages = Math.ceil(this.state.packages.length/per_page);
        const current_page = this.state.page;
        const start_offset = (current_page-1)*per_page;
        let start_count = 0;
        //let cur_record = (start_offset+per_page)<this.state.packages.length ? (start_offset+per_page) : this.state.packages.length;

        const { locale } = this.state;
        //console.log("1111"+ this.state.currentLoggedUserId);

        if ( this.state.ajaxLoading == true){
            return (
                <div className="col-md-12 pull-center ajax-loading" style={{marginTop: "130px"}}></div>
            );
        }


        if( userLoggedIn && this.state.currentLoggedUserId == this.state.accommodationOwnerId ){
        return (
                <section className="property-list">
                    <div className="container">
                        <div className="row">
                            <div className="center section-title">
                                <h5>&nbsp;</h5>
                                <h5><Message errors={this.state.msgEdit} type={this.state.typeEdit}></Message></h5>
                            </div>
                            <div className="bigCalendar">
                                <DayPicker
                                    labels={ LABELS[locale] }
                                    locale={ locale }
                                    months={MONTHS}
                                    weekdaysShort={WEEKDAYS_SHORT}
                                    selectedDays={ new Date() }
                                    renderDay={ this.renderDay.bind(this) } />
                            </div>

                                <table className="chart-orign table-striped">
                                    <thead className="hidden-xs">
                                    <tr>
                                        <th>ID</th>
                                        <th>{t("Start Date")}</th>
                                        <th>{t("End Date")}</th>
                                        <th>{t("Accommodation")}</th>
                                        <th>{t("Cleaning Fee")}</th>
                                        <th>{t("Edit")}・{t("Delete")}</th>
                                    </tr>
                                    </thead>
                                    <tbody style={{backgroundColor: 'white'}}>
                                    {this.state.packages.map((text, i) => {
                                        if(i>=start_offset && start_count<per_page){
                                            start_count++;
                                            return(
                                                <PackageChild translations={translations}  start1={text.startDate} end1={text.endDate} price2={text.price} price3={this.state.cleaningFee} accId={this.getUrlId() }  key={i} index={i} id={text.id}  updateCommentText={this.updateComment.bind(this)} updateError={this.updateError.bind(this)} removeEdit={this.removeEdit.bind(this)} deleteComentBoard={this.removeComment.bind(this)}>
                                                </PackageChild>
                                            )
                                        }
                                    })
                                    }
                                    </tbody>


                                </table>
                            <center>
                            <div style={{width:'90%', margin:'0 auto'}}>
                                <button type="button" className="btn btn-primary mt-10 pull-right" data-toggle="modal" data-target=".bs-example-modal-lg" onClick={this.clickAdd.bind(this)}>+{t("Add")}</button>
                            </div>
                            </center>



                            <div>
                                        <div className="card-footer ">
                                            <center>
                                                {this.state.packages.length > 0 ?
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
                                                                   activeClassName={"active"} />
                                                    :''}
                                            </center>
                                        </div>
                                    </div>

                                <div className="modal fade bs-example-modal-lg" tabIndex="-1" id="ModalForm" role="dialog" aria-labelledby="myLargeModalLabel" style={{display: this.state.showStore ? 'block' : 'none' }}>
                                    <div className="modal-dialog modal-lg" role="document">
                                        <div className="modal-content panel panel-default">
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span>
                                            </button>
                                            <center>
                                                <h3>{t("Additional")}</h3>
                                                <Message errors={this.state.msg} type={this.state.type}></Message>
                                            </center>
                                            <div className="panel-body">
                                                <div className="row line-1">
                                                    <div className="form-group col-md-6">
                                                        <h5>{t("Start Date")}</h5>
                                                        <div>
                                                            <input
                                                                type="text"
                                                                name="startDate"
                                                                ref={el => {
                                                                    this.input = el;
                                                                }}
                                                                className="form-control"
                                                                placeholder="YYYY-MM-DD"
                                                                value={this.state.value}
                                                                onChange={this.handleInputChange.bind(this)}
                                                                onFocus={this.handleInputFocus.bind(this)}
                                                            />
                                                            {this.state.showOverlay &&
                                                            <div style={{ position: 'absolute',zIndex:1000000,fontSize:'14px'}}>
                                                                <div style={overlayStyle}>
                                                                    <DayPicker
                                                                        ref={el => {
                                                                            this.daypicker = el;
                                                                        }}
                                                                        initialMonth={this.state.selectedDayNew || undefined}
                                                                        onDayClick={this.handleDayClickStartDate.bind(this)}
                                                                        selectedDays={this.state.selectedDayNew}
                                                                        months={MONTHS}
                                                                        weekdaysShort={WEEKDAYS_SHORT}
                                                                    />
                                                                </div>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <h5>{t("End Date")}</h5>
                                                        <div>
                                                            <input
                                                                type="text"
                                                                name="endDate"
                                                                ref={el => {
                                                                    this.input = el;
                                                                }}
                                                                className="form-control"
                                                                placeholder="YYYY-MM-DD"
                                                                value={this.state.value1}
                                                                onChange={this.handleInputChange1.bind(this)}
                                                                onFocus={this.handleInputFocus1.bind(this)}
                                                            />
                                                            {this.state.showOverlay1 &&
                                                            <div style={{ position: 'absolute',zIndex:1000000}}>
                                                                <div style={overlayStyle}>
                                                                    <DayPicker
                                                                        ref={el => {
                                                                            this.daypicker = el;
                                                                        }}
                                                                        initialMonth={this.state.selectedDayEnd || undefined}
                                                                        onDayClick={this.handleDayClickEndDate.bind(this)}
                                                                        selectedDays={this.state.selectedDayEnd}
                                                                        months={MONTHS}
                                                                        weekdaysShort={WEEKDAYS_SHORT}
                                                                    />
                                                                </div>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row line-2">
                                                    <div className="form-group col-md-6">
                                                        <h5>{t("Accommodaton/Night")}</h5>
                                                        <input type="Price"  name="price" className="form-control" id="examplePrice" placeholder="¥" onChange={this.onInputChange.bind(this)} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <h5>{t("Cleaning/Night")}</h5>
                                                        <input type="Price" name="cleaningFee" className="form-control" id="examplePriceClean" placeholder={this.state.cleaningFee}  disabled="disabled"/>
                                                    </div>
                                                </div>
                                                <div className="center">
                                                    <button type="button" className="btn btn-lg button-medium" onClick={this.add.bind(this)}>{t("Confirmation")}</button>
                                                    <button type="button" className="btn btn-lg button-medium second"  data-dismiss="modal">{t("Cancel")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                        </div>
                    </div>
                </section>
        );
        } else {
            return (
                <div className="container" style={{marginTop: "6em"}}>
                    <div className="alert alert-danger alert-dismissable">
                        <span style={{"float": "left", "margin": "0.1em 0.25em 0 0"}} className="glyphicon glyphicon-remove-circle"></span>
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                        <strong>{t("Info")}!</strong> {t("Sorry !  you are not  permission to access this page")}
                    </div>
                </div>
            )
        }
    }
}
export default TranslationWrapper(translate("PriceCalendar")(PriceCalendar))
