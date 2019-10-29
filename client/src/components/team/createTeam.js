import React, { Component } from 'react';

export default  class Create extends Component {

    constructor(props) {
        super(props);

        this.state = {
            teamName: '',
            urlAvatar: '',
            description: ''
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const teamData = {
            name: this.state.teamName,
            urlAvatar: this.state.urlAvatar,
            description: this.state.description
        };

        this.props.loginUser(teamData);
    };

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create a Team</h3>
                <form>
                    <div className="form-group">
                        <label>Team Name:  </label>
                        <input
                            onChange={this.onChange}
                            value = {this.state.teamName}
                            id="teamName"
                            type="text"
                            className="form-control"
                            required={true}
                        />
                    </div>
                    <div className="form-group">
                        <label> Url of the avatar: </label>
                        <input
                            onChange={this.onChange}
                            value = {this.state.urlAvatar}
                            id="urlAvatar"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input
                            onChange={this.onChange}
                            value = {this.state.description}
                            id="description"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Register Business" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}