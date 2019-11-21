import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Modal } from 'semantic-ui-react'

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
            dueDateIsDone: this.props.currentCardDueDateIsDone,
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

    onSubmit = e => {
        e.preventDefault();

        const newCardInfo = {
            newName: this.state.name,
            newDescription: this.state.description,
            newDueDate: this.state.dueDate,
            newDueDateIsDone: this.state.dueDateIsDone,
            newIsArchived: this.state.isArchived,
            id: this.props.currentCardId
        };

        this.props.updateCard(newCardInfo)
        this.props.fetchBoard(this.props.boardId);
    };

    render() {
        return <Modal
            trigger={
                <Card.Content extra>
                    Update a card
                </Card.Content>}>
            <Modal.Header>Update a new card</Modal.Header>
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

                        </div>
                        <div className="form-group">
                            <input type="submit" value="Create the List" className="btn btn-primary" />
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
