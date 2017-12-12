export const ADD_FAVOURITE = 'ADD_FAVOURITE'
export const DELETE_FAVOURITE = 'DELETE_FAVOURITE'

export function addFavourite(accId, accName, accLocation, accPrice, accImage, accImageId, insertFlag = true) {
    return {
        type: ADD_FAVOURITE,
        accommodationId: accId,
        accommodationName: accName,
        accommodationLocation: accLocation,
        accommodationPrice: accPrice,
        accommodationImage: accImage,
        accommodationImageId: accImageId,
        insertFlag: insertFlag
    };
}

export function deleteFavourite(accId) {
    return {
        type: DELETE_FAVOURITE,
        accommodationId: accId
    };
}