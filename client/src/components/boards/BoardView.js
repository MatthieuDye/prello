import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Card, Icon, Container } from "semantic-ui-react";

//________ACTIONS________
import { fetchBoard } from "../../actions/boardActions";
import AddBoardList from "../modals/AddBoardList";
import AddListCard from "../modals/AddListCard";
import UpdateCard from "../modals/UpdateCard";

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
        return (
            <div>
                <div className={"header"}>
                    <section>
                        {this.props.name.toUpperCase()} | {}
                        <Button onClick={() => this.redirectionAddBoardMember(this.props.currentBoard._id)}>Add a member</Button>
                        <Button onClick={() => this.redirectionAddBoardTeam(this.props.currentBoard._id)}>Add a team</Button>
                    </section>
                </div>

                <Container>
                    {this.props.lists.map(list => (
                        <React.Fragment>
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
                                                    <Icon name='calendar' />{card.dueDate.date}
                                                    <Icon name='archive' />{card.dueDate.isDone}
                                                </Card.Content>
                                                <Button>
                                                    <UpdateCard 
                                                    currentCardId={card._id}
                                                    currentCardName={card.name}
                                                    currentCardDescription={card.description}
                                                    currentCardDueDate={card.dueDate.date}
                                                    currentCardDueDateIsDone={card.dueDate.isDone}
                                                    currentCardIsArchived={card.isArchived}/>
                                                </Button>
                                            </Card>
                                        </Card.Content>
                                    ))}

                                    <Card.Content extra>
                                        <Button>
                                            <Icon name={"add circle"} />
                                            <AddListCard currentListId={list._id} />
                                        </Button>
                                    </Card.Content>
                                </Card>
                            </div>

                        </React.Fragment>
                    )
                    )}
                    <div style={{ display: 'inline-block' }}>
                        <Card link >
                            <AddBoardList />
                        </Card>
                    </div>
                </Container>

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
