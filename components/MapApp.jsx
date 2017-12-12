//external
import React, { Component } from 'react';
import { GoogleMapLoader,GoogleMap, Marker,InfoWindow } from 'react-google-maps'
import { translate } from "react-translate";
import TranslationWrapper from "./i18n/TranslationWrapper";
// internal

class MapApp  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venues : []
        }
    }

    render() {
        const { t } = this.props;
        if (this.props && this.props.longitude) {
            const mapContainer = <div style={{width: '100%', height: '100%'}}></div>;
            const marker = {
                position:{
                    lat: this.props.latitude,
                    lng: this.props.longitude
                }
            }
            return (
                <div>
                    {this.props.height ?  '': <div className="divider"></div>}
                    <div className="row mb-100" alt="location-map">
                        <div className="col-sm-3" alt="accomodation-type"><h4><strong>{t("Location")}</strong></h4>
                            <i className="glyphicon glyphicon-map-marker" aria-hidden="true"></i>
                        <i> <label>{this.props.line1  + ' ' + this.props.postcode }</label></i>

                        </div>
                        <div className=" map-body col-sm-12">
                            <div style={{width: '100%', height: this.props.height ? this.props.height :'100%', background: 'white'}}>
                                <GoogleMapLoader
                                    containerElement={ mapContainer }
                                    googleMapElement={
                                        <GoogleMap
                                            defaultZoom={13}
                                            options={{ scrollwheel: false}}
                                            defaultCenter={{lat: parseFloat(this.props.latitude.toFixed(2)), lng: parseFloat(this.props.longitude.toFixed(2))}}>
                                            <Marker  {...marker} >
                                                <InfoWindow >{this.props.city  + ' ' + this.props.state }</InfoWindow>
                                            </Marker>
                                        </GoogleMap>
                                    }/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return(<div></div>);
        }
    }
}
export default TranslationWrapper(translate("MapApp")(MapApp))
//export default MapApp;