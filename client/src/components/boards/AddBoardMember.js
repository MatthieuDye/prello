import React, { Component } from 'react';
import Autosuggest from  'react-autosuggest';
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { Button } from 'semantic-ui-react'

//______ACTIONS______

import {addMember} from "../../actions/boardActions";


const getSuggestionValue = suggestion => suggestion.userName;


const renderSuggestion = suggestion => (
    <div id={suggestion._id}>
        {suggestion.userName}
    </div>
);

class AddBoardMember extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            value: '',
            users: [],
            board: this.props.currentBoard,
            errors: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.errors!==prevState.errors){
            return { errors: nextProps.errors};
        }
        else return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.errors!==this.props.errors){
            //Perform some operation here
            this.setState({errors: this.props.errors});
        }
    }

    onSubmit = ()  => {
        this.props.addMember(this.state.value,this.state.board._id)
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
                    Board : {this.state.board.name}
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

AddBoardMember.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    addMember: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    errors: state.errors,
});

export default connect(
    mapStateToProps,
    {addMember}
)(AddBoardMember);
