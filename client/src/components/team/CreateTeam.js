import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createTeam } from "../../actions/teamActions";




class CreateTeam extends Component {

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
            description: this.state.description,
            userId: this.props.auth.user.id
        };

        this.props.createTeam(teamData,  this.props.history);
    };

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create a Team</h3>
                <form onSubmit={this.onSubmit}>
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
                        <input type="submit" value="Create the team" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

CreateTeam.propTypes = {
    createTeam: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { createTeam }
)(CreateTeam);
