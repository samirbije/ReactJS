// External
import React from 'react';

// Internal
import validateInput from './validation/signin';
import TextFieldGroup from './common/TextFieldGroup';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: {
                email: '',
                password: ''
            },
            errors: {},
            isLoading: false,
            invalid: false
        }
   }

   isValid() {
        const { errors, isValid } = validateInput(this.state.login);
        console.log("ll" + errors);
        if (!isValid) {
            this.setState({ errors });
        }
        return isValid;
    }

     createCookie(name,value,days) {
         if (days) {
             var date = new Date();
             date.setTime(date.getTime()+(days*24*60*60*1000));
             var expires = "; expires="+date.toGMTString();
         }
         else var expires = "";
         document.cookie = name+'='+value+expires+'; path=/';

    };


    onSubmit(e) {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({ errors: {}, isLoading: true });
            let login = this.state.login;
            const self = this;
            axios.post("http://192.168.0.55:7777/token", login)
                .then(function (response) {
                    var tokenHolder=JSON.stringify(response);
                    self.createCookie('tokenHolder', tokenHolder, 8);
                    window.location.assign("room");
                })
                .catch(function (error) {
                    console.log(error.response.data.message);
                    self.setState({ errors:{"email":error.response.data.message , isLoading: false}});
                });
        }
    }

    onInputChange(e) {
        this.state.login[e.target.name] = e.target.value;
    }
    
    render() {
        const { errors } = this.state;
        return (
                <p></p>
        );
    }
}
export default Login;