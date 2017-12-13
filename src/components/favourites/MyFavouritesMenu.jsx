//external
import React, { Component } from "react"

// internal
import { translate } from "react-translate"
import TranslationWrapper from "../i18n/TranslationWrapper"
import { addFavourite, deleteFavourite } from '../../actions/actions'

class MyFavouritesMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favourites: [],
            favouritesFromDb: []
        }
    }


    componentWillMount() {
        //console.log("From favourites list:"+this.props);
        var self = this;
        this.props.store.subscribe(() => {
            var st = this.props.store.getState();
            //console.log("From favourites list state componentWillMount:");
            //console.log(st.favourites);
            self.setState({
                favourites: st.favourites//self.state.favourites.concat(st.favourites)
            });
        });
    }
    /*
    componentWillReceiveProps(){
        console.log("From favourites list componentWillReceiveProps:"+this.props);
        var self = this;
        this.props.store.subscribe(() => {
            var st = this.props.store.getState();
            console.log("From favourites list state componentWillMount:");
            console.log(st.favourites);
            self.setState({
                favourites: st.favourites//self.state.favourites.concat(st.favourites)
            });
        });
    }
*/
    componentDidMount() {
        this.getFavourites();
       // console.log(this.state.favouritesFromDb)
    }



    getFavourites(){
        var url = baseMVacationApiUrl + "/user/0/favorite?offset=0&size=-1";
        var self = this;

         let onSuccessMethod = (data) => {
             var favourites = [];
             data.items.forEach(function (item) {
                 self.props.store.dispatch(
                     addFavourite(
                         item.id,
                         item.name,
                         item.address.city + "." + ((item.address.country) ? item.address.country.name : ""),
                         zformat(item.displayPrice),
                         item.featuredPicture.url,
                         item.featuredPicture.id,
                         false
                     )
                 );
             });
         }

         let onFailMethod = (err) => {
            console.log(err.responseText);
         }

         ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);
    }

    handleDelete(e){
        e.preventDefault();
        let element = e.target;
        let accommodationId = $(element).attr("id");
        let self = this;

        //console.log(element);
        //console.log("accommodationId: "+accommodationId);
        const {t} = this.props;

        bootbox.confirm({
            title: t("Remove from favourite list?"),
            message: t("Do you want to remove this from you favourite list? This cannot be undone!"),
            size: 'small',
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i>' + t("Cancel")
                },
                confirm: {
                    label: '<i class="fa fa-check"></i>' +  t("Confirm")
                }
            },
            callback: function (result) {
                if(result){
                    self.props.store.dispatch(
                        deleteFavourite(
                            accommodationId
                        )
                    );

                    $("#accommodation-liked-id-" + accommodationId).toggleClass("fa-heart fa-heart-o");
                }
                //console.log('This was logged in the callback: ' + result);
            }
        });
        $(".bootbox").children("div.modal-sm").attr("class", "modal-dialog");
    }

    render() {
        const {t} = this.props;

        return (

            <div>
                <div className="item-title" style={{borderBottom: "none"}}>
                    <h5>{t("Favorite List")}<span className="pull-right">{(this.state.favourites.length)}&nbsp;<a href={ baseCmsUrl + "/favourite-list" }>{t("Items")} </a></span></h5>
                    <div className="divider"></div>
                </div>
                <ul className="scrollable-menu">
                    { (this.state.favourites.length > 0) ?
                        this.state.favourites.map((item, i) => {
                            return (
                                    <li key={i} className="favorite-list">
                                        <div className="item">
                                            <div className="item-left col-sm-3">
                                               <a href={ baseCmsUrl + "/accommodation/"+ item.accommodationId}><img  className="responsive" src={item.accommodationImageId != "" ? baseMVacationApiUrl + "/media/"+ item.accommodationImageId + "/data?size=70x70" : baseCmsUrl + "/storage/app/media/default-images/70x70.png"}  height="70px" width="70px" /></a>
                                            </div>
                                            <div className="item-info pull-right col-sm-9">
                                                <ul>
                                                    <li style={{width:"100%"}}><strong>{item.accommodationName}</strong></li>
                                                    <li style={{width:"100%"}}>{item.accommodationLocation}</li>
                                                    <li style={{width:"100%"}}>{ currencyCode  == "USD" ? "$" : "¥"}{convertCurrency(item.accommodationPrice)}</li>
                                                    <li style={{width:"100%"}}><i className="fa fa-trash-o" onClick={this.handleDelete.bind(this)} id={item.accommodationId} style={{cursor: "pointer",}}></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    )
                        }) : null }
                </ul>
            </div>
        )

    }
}

export default TranslationWrapper(translate("MyFavouritesMenu")(MyFavouritesMenu));
