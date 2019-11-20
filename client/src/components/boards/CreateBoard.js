import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createBoard } from "../../actions/boardActions";

// _______ CREATE BOARD _______

class CreateBoard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            boardName: '',
            description: ''
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const boardInfo = {
            name: this.state.boardName,
            description: this.state.description,
            userId: this.props.auth.user.id
        };

        this.props.createBoard(boardInfo,  this.props.history);
    };

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create a Board</h3>

                <form onSubmit={this.onSubmit}>

                    <div className="form-group">
                        <label>Board Name:  </label>
                        <input
                            onChange={this.onChange}
                            value = {this.state.boardName}
                            id="boardName"
                            type="text"
                            className="form-control"
                            required={true}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description: </label>
                        <input
                            onChange={this.onChange}
                            value = {this.state.description}
                            id="description"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create the board" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

CreateBoard.propTypes = {
    createTeam: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { createBoard }
)(CreateBoard);