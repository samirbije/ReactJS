import { combineReducers } from 'redux'
import { ADD_FAVOURITE } from '../actions/actions'
import { DELETE_FAVOURITE } from '../actions/actions'

function addFavourite(state, action){
    switch (action.type) {
        case ADD_FAVOURITE:
            var retObject = {};
            if (action.insertFlag != null && action.insertFlag == true) {

                let url = baseMVacationApiUrl + "/user/0/favorite/" + action.accommodationId;
                let ctype = "x-www-form";
                let onSuccessMethod = (data) => {

                }

                let onFailMethod = (err) => {
                    console.log(err.responseText);
                }

                ajaxCall(url, "POST", null, onSuccessMethod, onFailMethod, ctype);
            }

            retObject = {
                accommodationId: action.accommodationId,
                accommodationName: action.accommodationName,
                accommodationLocation: action.accommodationLocation,
                accommodationPrice: action.accommodationPrice,
                accommodationImage: action.accommodationImage,
                accommodationImageId: action.accommodationImageId,
            }

            return retObject;

        default:
            return state
    }
}


function favourites(state = [], action){
    switch (action.type) {

        case ADD_FAVOURITE:
            return [
                ...state,
                addFavourite(undefined, action)
            ]
        case DELETE_FAVOURITE:
            let returnArray = [];
            let items = [].concat(state);
            let success = false;

            let url = baseMVacationApiUrl + "/user/0/favorite/" + action.accommodationId;

            let onSuccessMethod = (data) => {
                success =true;
            }

            let onFailMethod = (err) => {
                console.log(err.responseText);
            }

            ajaxCall(url, "DELETE", null, onSuccessMethod, onFailMethod);


            returnArray = $.grep(items , function (value) {
                return value.accommodationId != action.accommodationId;
            });

            return returnArray;

        default:
            return state
    }
}


const containerApp = combineReducers({
    favourites
})

export default containerApp