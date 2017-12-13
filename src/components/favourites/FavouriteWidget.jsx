//external
import React from 'react';

// internal
import { addFavourite, deleteFavourite } from '../../actions/actions'

class FavouriteWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: {
                email: '',
                password: ''
            },
            errors: [],
            isLoading: false,
            invalid: false,
            type: false,
            accommodationId: "",
            alreadyLikedList: []
        }

   }

    componentDidMount() {
            this.getFavourites();
    }

    getFavourites() {
        var url = baseMVacationApiUrl + "/user/0/favorite?offset=0&size=-1";
        var self = this;

        let onSuccessMethod = (data) => {
            var list = [];
            data.items.forEach(function (item) {
                list.push(Number(item.id));
            })

            self.setState({
                alreadyLikedList: list
            });
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }


    clickedIt(e){
        e.preventDefault();
        let element = e.target;
        //console.log("accomodation from props ", this.props.accommodation);
        $(element).toggleClass("fa-heart fa-heart-o");
        let {accommodationId, accommodationName, accommodationLocation, accommodationPrice, accommodationImage, accommodationImageId} = this.props.accommodation;
        if ($(element).hasClass("fa-heart")){
            this.props.store.dispatch(
                addFavourite(
                    accommodationId,
                    accommodationName,
                    accommodationLocation,
                    accommodationPrice,
                    accommodationImage,
                    accommodationImageId
                )
            );
        } else {
            this.props.store.dispatch(
                deleteFavourite(
                    accommodationId,
                    accommodationName,
                    accommodationLocation,
                    accommodationPrice,
                    accommodationImage,
                    accommodationImageId
                )
            );
        }
    }


    componentWillReceiveProps(){
        this.setState({
            accommodationId: this.props.accommodation.accommodationId
        })
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

    render() {
        var alreadyLiked = false;
        var accommodationId = "";
        var {accommodation} = this.props;

        //console.log(accommodation);

        accommodationId = this.state.accommodationId;

        if(accommodationId == ""){
            accommodationId = accommodation.accommodationId;
        }

        if(accommodationId == ""){
            accommodationId = this.getAccommodationId();
        }

        //console.log("accommodation id:" + accommodationId);

        if(this.state.alreadyLikedList.includes(Number(accommodationId))){
            alreadyLiked = true;
        }

        return (
            <div className="col-sm-3 wrapper-pretty-icon pull-right">
                 <div>
                    <i className={alreadyLiked ? "heart fa fa-heart" : "heart fa fa-heart-o"} onClick={this.clickedIt.bind(this)} data-id={accommodationId} id={"accommodation-liked-id-" + accommodationId}></i>
                </div>
            </div>
        );
    }
}

export default FavouriteWidget
