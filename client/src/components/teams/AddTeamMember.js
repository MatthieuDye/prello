import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button, Input, Container, Icon} from 'semantic-ui-react'

//______ACTIONS______

import {addMember} from "../../actions/teamActions";


const getSuggestionValue = suggestion => suggestion.userName;

const renderSuggestion = suggestion => (
    <div id={suggestion._id}>
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
            errors: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errors !== prevState.errors) {
            return {errors: nextProps.errors};
        } else return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.errors !== this.props.errors) {
            //Perform some operation here
            this.setState({errors: this.props.errors});
        }
    }

    onSubmit = () => {
        this.setState({value: ''});
        this.props.addMember(this.state.value, this.props.currentTeam._id);
    };

    renderInputComponent = inputProps => {
        return (
            <Input
                fluid
                action={{
                    onClick: () => this.onSubmit(),
                    icon: 'add'
                }}
                {...inputProps}
            />
        )
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

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({value}) => {

        this.loadSuggestions(value)

    };

    onSuggestionsClearRequested = () => {
        this.setState({
            users: []
        });
    };

    render() {

        const {value, users, isLoading} = this.state;

        const inputProps = {
            placeholder: 'Search for a username',
            value,
            onChange: this.onChange
        };
        const status = (isLoading && true);
        return (
            <Container>
                {/*status && <Icon loading name='spinner'/>*/}
                <Autosuggest
                    suggestions={users}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    renderInputComponent={this.renderInputComponent}
                />
            </Container>
        );
    }
}

AddTeamMember.propTypes = {
    currentTeam: PropTypes.object.isRequired,
    addMember: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    currentTeam: state.currentTeam,
    errors: state.errors,
});

export default connect(
    mapStateToProps,
    {addMember}
)(AddTeamMember);
