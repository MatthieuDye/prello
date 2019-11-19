import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Input, Form } from 'semantic-ui-react'
import { Formik } from 'formik'
import * as Yup from 'yup'

//______ACTIONS______

import { addTeam } from "../../actions/boardActions";

const SearchTeamSchema = Yup.object().shape({
    teamName: Yup.string()
        .required('Team name is required')
});

class AddBoardTeam extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
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

    render() {

        const { value, isLoading } = this.state;

        const status = (isLoading ? 'Loading...' : 'Type to load teams');
        return (
            <div style={{ marginTop: 40, marginLeft: 50 }}>
                <div>
                    Board : {this.state.board.name}
                </div>
                <div className="status">
                    <strong>Status:</strong> {status}
                </div>

                <Formik
                    initialValues={{
                        teamName: ''
                    }}
                    validationSchema={SearchTeamSchema}
                    onSubmit={values => {
                        this.props.addTeam(values.teamName, this.state.board._id)
                    }}
                >
                    {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Input
                                placeholder='Search team...'
                                value={values.teamName}
                                onChange={handleChange('teamName')}
                            />
                            <Button className="ui button" onPress={handleSubmit}>Submit</Button>
                        </Form>
                    )}
                </Formik>

            </div>
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
