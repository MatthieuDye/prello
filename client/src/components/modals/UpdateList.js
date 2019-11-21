import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Modal, Checkbox } from 'semantic-ui-react'

//______ACTIONS______

import { fetchBoard } from "../../actions/boardActions";
import { renameList, archiveList } from "../../actions/listActions";

class UpdateList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.currentListName,
            isArchived: this.props.currentListIsArchived,
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

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    handleIsArchivedChange = (bool) => {
        this.setState({ isArchived: !bool });
    }

    onSubmit = e => {
        e.preventDefault();

        const renameListData = {
            name: this.state.name,
            id: this.props.currentListId
        };

        const archiveListData = {
            isArchived: Boolean(this.state.isArchived),
            id: this.props.currentListId
        }

        this.props.renameList(renameListData)
        this.props.archiveList(archiveListData)
        this.props.fetchBoard(this.props.boardId);
    };

    render() {
        return <Modal
            trigger={
                <Card.Content extra>
                    Update a list
                </Card.Content>}>
            <Modal.Header>Update a list</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <form onSubmit={this.onSubmit}>

                        <div className="form-group">

                            <label>List name:  </label>
                            <input
                                onChange={this.onChange}
                                value={this.state.name}
                                id="name"
                                type="text"
                                className="form-control"
                                required={true}
                            />

                            <label>List is archived ?  </label>
                            <Checkbox fitted slider
                                defaultChecked={Boolean(this.state.isArchived)}
                                onClick={() => this.handleIsArchivedChange(this.state.isArchived)} />

                        </div>
                        <div className="form-group">
                            <input type="submit" value="Save" className="btn btn-primary" />
                        </div>
                    </form>

                </Modal.Description>
            </Modal.Content>
        </Modal>
    }
}

UpdateList.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    renameList: PropTypes.func.isRequired,
    archiveList: PropTypes.func.isRequired,
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
    { renameList, archiveList, fetchBoard }
)(UpdateList);
