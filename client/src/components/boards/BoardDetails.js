import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button } from 'semantic-ui-react'

class BoardManagement extends Component {

    redirectionAddBoardMember = (boardId) => {
        this.props.history.push(`/board/${boardId}/add/member`);
    };

    redirectionAddBoardTeam = (boardId) => {
        this.props.history.push(`/board/${boardId}/add/team`);
    };


    render() {
        return (
            <div className={"header"}>
                <section>
                    {this.props.name.toUpperCase()} | {}
                    <Button onClick={() => this.redirectionAddBoardMember(this.props.currentBoard._id)}>Add a member</Button>
                    <Button onClick={() => this.redirectionAddBoardTeam(this.props.currentBoard._id)}>Add a team</Button>
                </section>
            </div>
        );
    }
}

BoardManagement.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    errors: state.errors,
    name: state.currentBoard.name
});

export default connect(
    mapStateToProps,
    { }
)(BoardManagement);
