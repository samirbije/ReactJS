/**
 * Created by syed on 2/15/2017.
 */
import React from 'react';



class UserForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user: []
        };
    }

    handleSubmit(e){
        console.log(e);

        e.preventDefault();
    }


    render() {
        var inputStyle = {padding:'12px'}
        return (
            <div className="well">
                <h3>Add A User</h3>
                <form onSubmit={this.handleSubmit.bind()}>
                    <div className="input-group input-group-lg" style={inputStyle}>
                        <input type="text"  className="form-control col-md-8"  placeholder="User Name"/>
                    </div>
                    <div className="input-group input-group-lg" style={inputStyle}>
                        <input type="text"  className="form-control col-md-8" placeholder="User Email" />
                    </div>
                    <div className="input-group input-group-lg" style={inputStyle}>
                        <input type="submit"  className="btn btn-primary" value="Add User"/>
                    </div>

                </form>
            </div>
        );

    }
}
export default UserForm;