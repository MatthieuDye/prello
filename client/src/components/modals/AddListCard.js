import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Form, Input } from 'semantic-ui-react'
import { Formik } from "formik";

//______ACTIONS______

import { fetchBoard } from "../../actions/boardActions";
import { addListCard } from "../../actions/listActions";

class AddListCard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Formik
                initialValues={{
                    name: ''
                }}
                onSubmit={(values, reset) => {
                    const newCardInfo = {
                        name: values.name,
                        listId: this.props.currentListId,
                        boardId: this.props.currentBoard._id
                    };

                    this.props.addListCard(newCardInfo)
                    this.props.fetchBoard(this.props.boardId);
                    reset.resetForm();
                }}
            >

                {({ handleChange, handleSubmit, values }) => (

                    <Form onSubmit={handleSubmit}>
                        <Form.Field fluid>
                            <Input
                                compact
                                action={{ icon: 'add' }}
                                placeholder='New card name ...'
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                        </Form.Field>
                    </Form>
                )}
            </Formik>
        )
    }
}

AddListCard.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    addListCard: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    boardId: PropTypes.string.isRequired,
    fetchBoard: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    errors: state.errors,
    auth: state.auth,
    boardId: state.currentBoard._id
});

export default connect(
    mapStateToProps,
    { addListCard, fetchBoard }
)(AddListCard);
