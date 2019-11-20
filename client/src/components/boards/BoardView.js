import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Card, Icon, Container } from "semantic-ui-react";

//________ACTIONS________
import { fetchBoard } from "../../actions/boardActions";
import AddBoardList from "../modals/AddBoardList";

class BoardView extends Component {

    componentDidMount() {
        this.props.fetchBoard(this.props.match.params.boardId);
    }

    redirectionAddBoardMember = (boardId) => {
        this.props.history.push(`/board/${boardId}/add/member`);
    };

    redirectionAddBoardTeam = (boardId) => {
        this.props.history.push(`/board/${boardId}/add/team`);
    };

    render() {

        console.log(this.props.lists.cards)

        return (
            <div>
                <div className={"header"}>
                    <section>
                        {this.props.name.toUpperCase()} | {}
                        <Button onClick={() => this.redirectionAddBoardMember(this.props.currentBoard._id)}>Add a member</Button>
                        <Button onClick={() => this.redirectionAddBoardTeam(this.props.currentBoard._id)}>Add a team</Button>
                    </section>
                </div>
                {console.log("LISTES : " + this.props.lists.length)}
                {this.props.lists.map(list => (
                    <Container>
                        <div style={{ display: 'inline-block' }}>
                            <Card>
                                <Card.Content>
                                    <Card.Header>{list.name}</Card.Header>
                                </Card.Content>
                                {list.cards.map(card => (
                                    <Card.Content>
                                    <Card color={"grey"}>
                                        <Card.Content header={card.name} />
                                        <Card.Content description={card.description} />
                                        <Card.Content extra>
                                            <Icon name='calendar' />Due date
                                        <Icon name='archive' />Archived ?
                                    </Card.Content>
                                    </Card>
                                </Card.Content>
                                ))}
                                
                                <Card.Content extra>
                                    <button>
                                        <Icon name={"add circle"} /> Add a new card
                                </button>
                                </Card.Content>
                            </Card>
                        </div>
                        <div style={{ display: 'inline-block' }}>
                            <Card link >
                                <AddBoardList />
                            </Card>
                        </div>
                    </Container>
                )
                )}
            </div>
        )
    }
}

BoardView.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    lists: PropTypes.arrayOf(PropTypes.object).isRequired,
    name: PropTypes.string.isRequired,
    fetchBoard: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

BoardView.defaultProps = {
    /*currentBoard: {
        labelNames: "",
        admins: [],
        guestMembers: [],
        isArchived: false,
        lists: [],
        id: "",
        name: "",
        description: "",
        _id: ""
    },*/
    name: "",
    lists: [{
        cards: []
    }]
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    lists: state.currentBoard.lists,
    name: state.currentBoard.name,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { fetchBoard }
)(BoardView);
