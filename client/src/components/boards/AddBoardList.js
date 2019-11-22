import React, {Component} from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Form, Input} from 'semantic-ui-react'

//______ACTIONS______

import {addBoardList, fetchBoard} from "../../actions/boardActions";
import {Formik} from "formik";

class AddBoardList extends Component {

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

                    const newListInfo = {
                        name: values.name,
                        boardId: this.props.boardId
                    };

                    this.props.addBoardList(newListInfo);
                    this.props.fetchBoard(this.props.boardId);
                    reset.resetForm();
                }}
            >

                {({handleChange, handleSubmit, values}) => (

                    <Form onSubmit={handleSubmit}>
                        <Form.Field width={4}>
                            <Input
                                compact
                                action={{icon: 'add'}}
                                placeholder='New list name ...'
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

AddBoardList.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    addBoardList: PropTypes.func.isRequired,
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
    {addBoardList, fetchBoard}
)(AddBoardList);
