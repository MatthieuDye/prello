import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Modal, Checkbox, Button } from 'semantic-ui-react'

//______ACTIONS______

import { fetchBoard } from "../../actions/boardActions";
import { updateCard } from "../../actions/cardActions";

class UpdateCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.currentCardName,
            description: this.props.currentCardDescription,
            dueDate: this.props.currentCardDueDate,
            isDone: this.props.currentCardIsDone,
            isArchived: this.props.currentCardIsArchived,
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

    handleIsDoneChange = (bool) => {
        this.setState({ isDone: !bool });
    }

    onSubmit = e => {
        e.preventDefault();

        const newCardInfo = {
            newName: this.state.name,
            newDescription: this.state.description,
            newDueDate: this.state.dueDate,
            newDueDateIsDone: Boolean(this.state.isDone),
            newIsArchived: Boolean(this.state.isArchived),
            id: this.props.currentCardId,
            boardId: this.props.currentBoard.boardId
        };

        this.props.updateCard(newCardInfo)
        this.props.fetchBoard(this.props.boardId);
    };

    render() {
        return <Modal
            trigger={
                <Button icon='edit' content='Update'/>}>
            <Modal.Header>Update a card</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <form onSubmit={this.onSubmit}>

                        <div className="form-group">

                            <label>Card name:  </label>
                            <input
                                onChange={this.onChange}
                                value={this.state.name}
                                id="name"
                                type="text"
                                className="form-control"
                                required={true}
                            />

                            <label>Card description:  </label>
                            <input
                                onChange={this.onChange}
                                value={this.state.description}
                                id="description"
                                type="text"
                                className="form-control"
                                required={false}
                            />

                            <label>Card due date:  </label>
                            <input
                                onChange={this.onChange}
                                value={this.state.dueDate}
                                id="dueDate"
                                type="date"
                                className="form-control"
                                required={false}
                            />

                            <label>Card is done ?  </label>
                            <Checkbox fitted slider
                                defaultChecked={Boolean(this.state.isDone)}
                                onClick={() => this.handleIsDoneChange(this.state.isDone)} />

                            <label>Card is archived ?  </label>
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

UpdateCard.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    updateCard: PropTypes.func.isRequired,
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
    { updateCard, fetchBoard }
)(UpdateCard);
