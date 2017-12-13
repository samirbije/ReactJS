import React from 'react';
import ReactDOM from 'react-dom';
import SignupForm from "../components/SignupForm";
import Login from "../components/Login";
import InboxMenu from "../components/inbox/InboxMenu";
import MyTripsMenu from "../components/MyTripsMenu";
import MyFavouritesMenu from "../components/favourites/MyFavouritesMenu";

class CommonRenderer {

    static render(store){
        ReactDOM.render(<SignupForm translations={translations} />,  document.getElementById("signup"));
        ReactDOM.render(<Login translations={translations} />, document.getElementById('login'));
        if(document.getElementById("inbox-menu-container")){
            ReactDOM.render(<InboxMenu translations={translations} />, document.getElementById("inbox-menu-container"));
        }
        if(document.getElementById("trips-menu-container")){
            ReactDOM.render(<MyTripsMenu translations={translations} />, document.getElementById("trips-menu-container"));
        }
        if(document.getElementById("favourites-menu-container")) {
            ReactDOM.render(<MyFavouritesMenu translations={translations}
                                              store={store}/>, document.getElementById("favourites-menu-container"))
        }
    }
}

export default CommonRenderer;

