/**
 * Created by samir on 10/04/2017.
 */
import React from 'react';
import DayPicker from 'react-day-picker';
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
/**
 *  Child Class  for App Parent Class
 *
 */

const overlayStyle = {
    position: 'absolute',
    zIndex:'100000000',
    background: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
};


class PackageChild extends React.Component {
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
            msg: [],
            editing: false,
            showOverlay: false,
            showOverlay1: false,
            value: '',
            value1: '',
            selectedDay: null,
            selectedDay1: null,
        };
    }

    /**
     * status setting for edit and save
     */
    edit () {
        this.setState({type:false, msg:[] });
        if (this.state.editing){
            this.setState({editing:false});
        } else {
            this.setState({editing: true});
        }
    }

    /**
     * update  app data
     *
     */
    save() {
        var val=moment(this.refs.newStart.value).format('YYYY-MM-DD');
        var val1=moment(this.refs.newEnd.value).format('YYYY-MM-DD');
        var val2=this.refs.newPrice1.value;
        var val3=this.refs.newPrice2.value;

        const self = this;
        var data = {
            startDate: val,
            endDate: val1,
            price: val2
        };
        let url = baseMVacationApiUrl + '/accomodation/'+ this.props.accId +'/package/' +this.props.id;
        let onSuccessMethod = (data) => {
            this.setState({editing:false});
            self.props.updateCommentText(self.props.id,val,val1,val2,val3,self.props.index)
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

            //self.setState({type:true});
            //self.setState({msg:errArr});
            self.props.updateError(errArr)
        }

        ajaxCall(url, "PUT", data, onSuccessMethod, onFailMethod);
    }

    changeStatus(){
        this.setState({type:false, msg:[] });
        if (this.state.editing){
            this.setState({editing:false});
            this.props.removeEdit();
        } else {
            this.setState({editing: true});
        }
    }
    /**
     * Remove from apps array
     *
     */
    remove() {
        const { t } = this.props;
            // your deletion code
            const self = this;
            bootbox.confirm({
                title: t("Delete Price Calendar"),
                message:t("Do you want to remove from price Calendar list"),
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
                        let url = baseMVacationApiUrl + '/accomodation/'+ self.props.accId +'/package/' +self.props.id;

                        let onSuccessMethod = (data) => {
                            self.props.deleteComentBoard(self.props.index)
                        }

                        let onFailMethod = (err) => {
                            console.log(err.responseText);
                        }

                        ajaxCall(url, "DELETE", null, onSuccessMethod, onFailMethod);
                    }

                }
            });
            /*
             if (confirm(t("delConfirmation"))) {
                axios.delete(baseMVacationApiUrl + '/accomodation/'+ this.props.accId +'/package/' +this.props.id,{
                    crossDomain: true,
                    withCredentials: true
                }).then(function (response) {
                        self.props.deleteComentBoard(self.props.index)
                    })
                    .catch(function(response) {
                        if(response instanceof Error) {
                            console.log(response.message);
                        } else {
                            console.log(response.data);
                        }
                    });

            }
            return false;
           */
    }

    /**
     * Html render for normal render
     * render
     *  @return {ReactElement} markup
     */
    renderNormal() {
        const { t } = this.props;
        const ind = (this.props.index+1);
        return(
            <tr>
                <td>{ind}</td>
                <td>
                    <h5 className="visible-xs"><b>{t("Start Date")}</b></h5>
                    {moment(this.props.start1).format('YYYY-MM-DD')}
                 </td>
                <td>
                    <h5 className="visible-xs"><b>{t("End Date")}</b></h5>
                    {moment(this.props.end1).format('YYYY-MM-DD')} </td>
                <td>
                    <h5 className="visible-xs"><b>{t("Accommodation")}</b></h5>
                    { currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.props.price2)} <span>/{t("Night")}</span></td>
                <td>
                    <h5 className="visible-xs"><b>{t("Cleaning Fee")}</b></h5>
                    { currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(this.props.price3)} <span>/{t("Night")}</span></td>
                <td>
                    <a href="javascript:void(0)"  className="edit-tag" onClick={this.edit.bind(this)}><i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i></a>
                    <a href="javascript:void(0)"  className="edit-tag" onClick={this.remove.bind(this)}><i className="fa fa-times fa-lg" aria-hidden="true"></i></a>
                </td>
            </tr>
        );
    }

    /**
     *
     */
   componentWillUnmount() {
        clearTimeout(this.clickTimeout);
    }

    input = null;
    daypicker = null;
    clickedInside = false;
    clickTimeout = null;

    handleContainerMouseDown = () => {
        this.clickedInside = true;
        // The input's onBlur method is called from a queue right after onMouseDown event.
        // setTimeout adds another callback in the queue, but is called later than onBlur event
        this.clickTimeout = setTimeout(() => {
            this.clickedInside = false;
        }, 0);
    };
    /**
     *
     */
    handleContainerMouseDown1 = () => {
        this.clickedInside = true;
        // The input's onBlur method is called from a queue right after onMouseDown event.
        // setTimeout adds another callback in the queue, but is called later than onBlur event
        this.clickTimeout = setTimeout(() => {
            this.clickedInside = false;
        }, 0);
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
    /**
     *
     */
    handleInputBlur = () => {
        const showOverlay = this.clickedInside;

        this.setState({
            showOverlay,
        });
        // Force input's focus if blur event was caused by clicking on the calendar
        if (showOverlay) {
            this.input.focus();
        }
    };
    /**
     *
     */
    handleInputBlur1 = () => {
        const showOverlay1 = this.clickedInside;
        this.setState({
            showOverlay1,
        });
        // Force input's focus if blur event was caused by clicking on the calendar
        if (showOverlay1) {
            this.input.focus();
        }
    };
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
                    selectedDay: momentDay.toDate(),
                    value,
                },
                () => {
                    this.daypicker.showMonth(this.state.selectedDay);
                }
            );
        } else {
            this.setState({ value, selectedDay: null });
        }
    };
    /**
     *
     * @param e
     */
    handleInputChange1 = e => {
        const { value } = e.target;
        const momentDay = moment(value, 'L', true);
        if (momentDay.isValid()) {
            this.setState(
                {
                    selectedDay1: momentDay.toDate(),
                    value,
                },
                () => {
                    this.daypicker.showMonth(this.state.selectedDay1);
                }
            );
        } else {
            this.setState({ value, selectedDay1: null });
        }
    };
    /**
     *
     * @param day
     */
    handleDayClick = day => {
        this.setState({
            value:moment(day).format('YYYY-MM-DD'),
            selectedDay: day,
            showOverlay: false,
        });
        this.input.blur();
    };
    /**
     *
     * @param day
     */
    handleDayClick1 = day => {
        this.setState({
            value1:moment(day).format('YYYY-MM-DD'),
            selectedDay1: day,
            showOverlay1: false,
        });
        this.input.blur();
    };
    /**
     *After click edit button new HTML form for Edit
     *render
     *  @return {ReactElement} markup
     */
    renderForm() {
        const { t } = this.props;
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
        const ind = (this.props.index+1);
        return(
            <tr>
                <td>{ind}
                </td>
                <td>
                    <label className="visible-xs">{t("Start Date")}</label>
                    <div onMouseDown={this.handleContainerMouseDown} style={{'z-index':1000000}}>
                        <input
                            type="text"
                            id="newStart"
                            ref="newStart"
                            className="form-control"
                            placeholder="YYYY-MM-DD"
                            value={this.state.value?this.state.value:moment(this.props.start1).format('YYYY-MM-DD')}
                            onChange={this.handleInputChange.bind(this)}
                            onFocus={this.handleInputFocus.bind(this)}
                            onBlur={this.handleInputBlur.bind(this)}
                        />
                        {this.state.showOverlay &&
                        <div style={{ position: 'absolute',zIndex:1000000}}>
                            <div style={overlayStyle}>
                                <DayPicker
                                    ref={el => {
                                        this.daypicker = el;
                                    }}
                                    initialMonth={new Date(moment(this.props.start1).format('YYYY-MM-DD')) || undefined}
                                    onDayClick={this.handleDayClick.bind(this)}
                                    selectedDays={this.state.selectedDay ? this.state.selectedDay:new Date(moment(this.props.start1).format('YYYY-MM-DD'))}
                                    months={MONTHS}
                                    weekdaysShort={WEEKDAYS_SHORT}
                                />
                            </div>
                        </div>}
                    </div>

                </td>
                <td>
                    <label className="visible-xs">{t("End Date")}</label>
                    <div onMouseDown={this.handleContainerMouseDown1} style={{'z-index':1000000}}>
                        <input
                            type="text"
                            id="newEnd"
                            ref="newEnd"
                            className="form-control"
                            placeholder="YYYY-MM-DD"
                            value={this.state.value1?this.state.value1:moment(this.props.end1).format('YYYY-MM-DD')}
                            onChange={this.handleInputChange1.bind(this)}
                            onFocus={this.handleInputFocus1.bind(this)}
                            onBlur={this.handleInputBlur1.bind(this)}
                        />
                        {this.state.showOverlay1 &&
                        <div style={{ position: 'absolute',zIndex:1000000}}>
                            <div style={overlayStyle}>
                                <DayPicker
                                    ref={el => {
                                        this.daypicker = el;
                                    }}
                                    initialMonth={new Date(moment(this.props.end1).format('YYYY-MM-DD')) || undefined}
                                    onDayClick={this.handleDayClick1.bind(this)}
                                    selectedDays={this.state.selectedDay1?this.state.selectedDay1:new Date(moment(this.props.end1).format('YYYY-MM-DD'))}
                                    months={MONTHS}
                                    weekdaysShort={WEEKDAYS_SHORT}
                                />
                            </div>
                        </div>}
                    </div>
                </td>
                <td>
                    <label className="visible-xs">{t("Accommodation")}</label>
                    <input type="text" ref="newPrice1" className="form-control"  defaultValue={this.props.price2}/>
                </td>

                <td>
                    <label className="visible-xs">{t("Cleaning Fee")}</label>
                    <input type="text" ref="newPrice2" className="form-control"  defaultValue={this.props.price3} disabled="disabled"/>
                </td>
                <td style={{float:'left'}}>
                    <a href="javascript:void(0)" className="btn-sm btn-success" style={{backgroundColor:'#ff6043'}} onClick={this.save.bind(this)}><i className="fa fa-check "></i></a>
                    <a href="javascript:void(0)"  className="edit-tag" onClick={this.changeStatus.bind(this)}><i className="fa fa-times fa-lg" aria-hidden="true"></i></a>
                </td>
            </tr>
        );
    }

    /**
     * maintaining normalform and after click edit using editing flag
     * render
     *  @return {ReactElement} markup
     */
    render() {
        if(this.state.editing) {
            return this.renderForm();
        }else {
            return this.renderNormal();
        }
    }
}
export default TranslationWrapper(translate("PackageChild")(PackageChild))
