import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Button, Container, Input} from 'semantic-ui-react'

//______ACTIONS______

import { addTeam } from "../../actions/boardActions";

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
    <div id={suggestion._id}>
        {suggestion.name}
    </div>
);

class AddBoardTeam extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            value: "",
            teams: [],
            board: this.props.currentBoard,
            errors: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errors !== prevState.errors) {
            return { errors: nextProps.errors };
        }
        else return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.errors !== this.props.errors) {
            //Perform some operation here
            this.setState({ errors: this.props.errors });
        }
    }

    onSubmit = ()  => {
        this.setState({value: ''});
        this.props.addTeam(this.state.value,this.state.board._id)
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
                .get(`/api/private/team/findByBeginName/${value}`)
                .then(res => {
                    this.setState({
                        isLoading: false,
                        teams: res.data.teams
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

    onSuggestionsClearRequested = () => {
        this.setState({
            teams: []
        });
    };

    render() {

        const { value, teams, isLoading } = this.state;

        const inputProps = {
            placeholder: 'Choose team name',
            value,
            onChange: this.onChange
        };
        const status = (isLoading ? 'Loading...' : 'Type to load teams');
        return (
            <Container>
                <Autosuggest
                    suggestions={teams}
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

AddBoardTeam.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    addTeam: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    errors: state.errors,
});

export default connect(
    mapStateToProps,
    { addTeam }
)(AddBoardTeam);
