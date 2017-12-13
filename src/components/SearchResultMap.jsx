import React, { Component } from 'react';


//internal
import { GoogleMapLoader,GoogleMap, Marker ,InfoWindow } from 'react-google-maps'

class Map  extends Component {

    render() {
        let bounds =new google.maps.LatLngBounds();
        const mapContainer = <div style={{width:'100%' ,height:'100%'}}>A</div>
        const  markers = this.props.markers.map((venue,i) =>{
            const marker = {
                position:{
                    lat: venue.latitude,
                    lng: venue.longitude
                },
                title: ''
            }
            const a = <div>{ currencyCode  == "USD" ? "$" : "¥"} {convertCurrency(parseFloat(venue.price))}</div>;
             bounds.extend(new google.maps.LatLng(venue.latitude,venue.longitude));
            return <Marker key ={i} {...marker}  text={'A'}>
                <InfoWindow >{a}</InfoWindow>
            </Marker>
        })
        return (
            this.props.markers.length > 1 ?
                <GoogleMapLoader
                    containerElement= { mapContainer }
                    googleMapElement = {
                    <GoogleMap
                        ref={(map) => {  map ? map.fitBounds(bounds):'' }}
                        defaultZoom={5}
                        defaultCenter={this.props.center}
                        options={{streetViewControl:true,mapTypeControl:true,scrollwheel: false}}>
                        {markers}
                     </GoogleMap>
                     }
                />:
                <GoogleMapLoader
                    containerElement= { mapContainer }
                    googleMapElement = {
                        <GoogleMap
                            defaultZoom={15}
                            defaultCenter={this.props.center}
                            options={{streetViewControl:true,mapTypeControl:true,scrollwheel: false}}>
                            {markers}
                        </GoogleMap>
                    }
                />
        )
    }
}


class SearchResultMap  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venues : []
        }
    }
    componentDidMount() {
      this.setState({
        })
    }


    render() {
        if (this.props && this.props.geo) {
            return (
                <div>
                    <div align="top" style={{maxWidth: '100%', height: '790px'}}>
                        {this.props.geo.lat ==null?
                            <Map center={ {lat:this.props.geoCode[0].latitude , lng:this.props.geoCode[0].longitude } } markers={this.props.geoCode}/>
                        :
                            <Map center={ this.props.geo } markers={this.props.geoCode}/>
                        }
                    </div>
                </div>
            )
        }else {
            return(<div></div>);
        }
    }
}

export default SearchResultMap;