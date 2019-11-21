import React, { Component } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { Card, Modal} from 'semantic-ui-react'

//______ACTIONS______

import {fetchBoard} from "../../actions/boardActions";
import {addListCard} from "../../actions/listActions";

class AddListCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
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

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const newCardInfo = {
            name: this.state.name,
            listId: this.props.currentListId
        };

        this.props.addListCard(newCardInfo)
        this.props.fetchBoard(this.props.boardId);
    };

    render() {
       return <Modal
            trigger={
                <Card.Content extra>
                    Add another card
                </Card.Content>}>
            <Modal.Header>Adding a new card</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <form onSubmit={this.onSubmit}>

                        <div className="form-group">
                            <label>Card Name:  </label>
                            <input
                                onChange={this.onChange}
                                value = {this.state.name}
                                id="name"
                                type="text"
                                className="form-control"
                                required={true}
                            />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Create the List" className="btn btn-primary"/>
                        </div>
                    </form>

                </Modal.Description>
            </Modal.Content>
        </Modal>
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
    {addListCard, fetchBoard}
)(AddListCard);
