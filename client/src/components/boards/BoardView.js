import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button} from "semantic-ui-react";


//________ACTIONS________
import {fetchBoard} from "../../actions/boardActions";

class BoardView extends Component {

    componentDidMount() {
        this.props.fetchBoard(this.props.match.params.boardId);
    }

    redirectionAddBoardMember = (boardId) => {
        this.props.history.push(`/board/${boardId}/add`);
    };

    render() {
        return (
            <div>
                Board name : {this.props.currentBoard.name}

                <Button onClick={() => this.redirectionAddBoardMember(this.props.currentBoard._id)}>Add a member</Button>
            </div>
        )
    }
}

BoardView.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    fetchBoard: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {fetchBoard}
)(BoardView);
