import React, { Component } from 'react';
import Autosuggest from  'react-autosuggest';
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { Button } from 'semantic-ui-react'

//______ACTIONS______

import {addMember} from "../../actions/teamActions";


const getSuggestionValue = suggestion => suggestion.userName;


const renderSuggestion = suggestion => (
    <div>
        {suggestion.userName}
    </div>
);

class AddTeamMember extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            value: '',
            users: [],
            team: this.props.teams.filter(t => t._id === this.props.match.params.teamId)[0]
        };
    }

    onSubmit = ()  => {
        this.props.addMember(this.state.users[0].username,this.props.match.params.teamId)
    };

    //__________AUTOCOMPLETE_________


    loadSuggestions(value) {
        // Cancel the previous request
        if (this.lastRequestId !== null) {
            clearTimeout(this.lastRequestId);
        }

        this.setState({
            isLoading: true
        });

        this.lastRequestId = setTimeout(() => {
            axios
                .get(`/api/private/user/findByBeginName/${value}`)
                .then(res => {
                    this.setState({
                        isLoading: false,
                        users: res.data.users
                    });
                })
        });
    };

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({value}) => {

        this.loadSuggestions(value)

    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            users: []
        });
    };

    render() {

        const { value, users, isLoading } = this.state;

        const inputProps = {
            placeholder: 'Choose username',
            value,
            onChange: this.onChange
        };
        const status = (isLoading ? 'Loading...' : 'Type to load users');
        return (
            <div style = {{ marginTop: 40, marginLeft: 50 }}>
                <div>
                team : {this.state.team.name}
                </div>
                <div className="status">
                    <strong>Status:</strong> {status}
                </div>
                <Autosuggest
                    suggestions={users}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />

                <Button className="ui button" onClick={() => this.onSubmit()}>Submit</Button>
            </div>
        );
    }
}

AddTeamMember.propTypes = {
    teams: PropTypes.array.isRequired,
    addMember: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    teams: state.teams,
});

export default connect(
    mapStateToProps,
    {addMember}
)(AddTeamMember);
