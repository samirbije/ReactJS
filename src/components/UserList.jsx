/**
 * Created by syed on 2/15/2017.
 */
import React from 'react';



class UserList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }
    showResults(response){
        this.setState({
            users: response
        })
    }

    componentDidMount() {
        var url = "http://localhost/octobermovies/user";
        /*$.get(url, function(result) {
            this.showResults(result);

        }.bind(this));
        */
        var self = this;

        let onSuccessMethod = (data) => {
            self.showResults(data);
        }

        let onFailMethod = (err) => {
            console.log(err.responseText);
        }

        ajaxCall(url, "GET", null, onSuccessMethod, onFailMethod);

    }

    handleNewUserSubmit( newUser ) {
    //this.setState( {users: this.state.users.concat([newUser])} );
        var url = "http://localhost/octobermovies/user/add";

        let onSuccessMethod = (data) => {
            this.setState( {users: this.state.users.concat([data])} );
        }

        let onFailMethod = (err) => {
            console.error(this.props.url, err.status, err.responseText);
        }

        ajaxCall(url, "POST", newUser, onSuccessMethod, onFailMethod);

    }



    render() {
        return (
            <div>
                <Results users={this.state.users} />
                <UserForm onUserSubmit={this.handleNewUserSubmit.bind(this)}/>
            </div>
        );
    }
}


class Results extends React.Component{
    render(){
        var resultItems = this.props.users.map(function(row) {
            return <ResultItem key={row.id} user={row} />
        });
        return(
            <table>
                <thead>
                    <tr>
                        <td>Id</td>
                        <td>Name</td>
                        <td>Email</td>
                    </tr>
                </thead>

                <tbody>
                {resultItems}
                </tbody>
            </table>
        );
    }
}

class ResultItem extends React.Component{
    render(){
        return <tr>
            <td>{this.props.user.id}</td>
            <td>{this.props.user.name}</td>
            <td>{this.props.user.email}</td>
            </tr>;
    }
}

class UserForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userName:'',
            userEmail:''
        };
    }

    handleSubmit(e){
        e.preventDefault();
        console.log(e);


        var newrow = {name: this.state.userName, email: this.state.userEmail};
        this.props.onUserSubmit( newrow );
        return;
    }

    handleNameChange(e){
        this.setState({userName: e.target.value});
    }
    handleEmailChange(e){
        this.setState({userEmail: e.target.value});
    }

    render() {
        var inputStyle = {padding:'12px'}
        return (
            <div className="well">
                <h3>Add A User</h3>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="input-group input-group-lg" style={inputStyle}>
                        <input type="text"  className="form-control col-md-8"  placeholder="User Name" onChange={this.handleNameChange.bind(this)}/>
                    </div>
                    <div className="input-group input-group-lg" style={inputStyle}>
                        <input type="text"  className="form-control col-md-8" placeholder="User Email" onChange={this.handleEmailChange.bind(this)}/>
                    </div>
                    <div className="input-group input-group-lg" style={inputStyle}>
                        <input type="submit"  className="btn btn-primary" value="Add User"/>
                    </div>

                </form>
            </div>
        );

    }
}

export default UserList;