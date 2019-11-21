import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Card, Icon, Container } from "semantic-ui-react";

//________ACTIONS________
import { fetchBoard } from "../../actions/boardActions";
import AddBoardList from "../modals/AddBoardList";
import AddListCard from "../modals/AddListCard";
import UpdateCard from "../modals/UpdateCard";
import UpdateList from "../modals/UpdateList";

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
                                        <Button>
                                            <UpdateList
                                                currentListId={list._id}
                                                currentListName={list.name}
                                                currentListIsArchived={list.isArchived} />
                                        </Button>

                                    </Card.Content>
                                    {list.isArchived ? (
                                        <Card.Content extra>
                                            <Icon name='archive' color="red" />
                                            List Archived
                                        </Card.Content>
                                    ) : (
                                            <React.Fragment>
                                                {list.cards.map(card => (
                                                    <Card.Content>
                                                        <Card color={"grey"}>
                                                            <Card.Content header={card.name} />
                                                            {card.isArchived ? (
                                                                <Card.Content extra>
                                                                    <Icon name='archive' color="red" />
                                                                    Card Archived
                                                            </Card.Content>
                                                            ) : (
                                                                    <React.Fragment>
                                                                        {(card.description !== undefined && card.description !== "" && card.description !== null) && (
                                                                            <Card.Content description={card.description} />
                                                                        )}

                                                                        {((card.dueDate.date !== undefined && card.dueDate.date !== "" && card.dueDate.date !== null) || card.dueDate.isDone) && (
                                                                            <Card.Content extra>
                                                                                {(card.dueDate.date !== undefined && card.dueDate.date !== "" && card.dueDate.date !== null) && (
                                                                                    <React.Fragment>
                                                                                        <Icon name='calendar' color="blue" />{card.dueDate.date}
                                                                                    </React.Fragment>
                                                                                )}
                                                                                {card.dueDate.isDone && (
                                                                                    <Icon name='check' color="green" />
                                                                                )}
                                                                            </Card.Content>
                                                                        )}
                                                                    </React.Fragment>
                                                                )}


                                                            <Button>
                                                                <UpdateCard
                                                                    currentCardId={card._id}
                                                                    currentCardName={card.name}
                                                                    currentCardDescription={card.description}
                                                                    currentCardDueDate={card.dueDate.date}
                                                                    currentCardIsDone={card.dueDate.isDone}
                                                                    currentCardIsArchived={card.isArchived} />
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
                                            </React.Fragment>
                                        )}

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
