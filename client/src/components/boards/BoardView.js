import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button, Card, Icon, Container, Divider, Header, Segment, Input} from "semantic-ui-react";

//________ACTIONS________
import {fetchBoard} from "../../actions/boardActions";
import {deleteList} from "../../actions/listActions";
import AddBoardList from "./AddBoardList";
import AddListCard from "../modals/AddListCard";
import UpdateCard from "../modals/UpdateCard";
import UpdateList from "../modals/UpdateList";

class BoardView extends Component {

    componentDidMount() {
        this.props.fetchBoard(this.props.match.params.boardId);
    }

    redirectionBoardDetails = (boardId) => {
        this.props.history.push(`/board/${boardId}/details`);
    };

    handleDeleteList = (listID) => {
        this.props.deleteList(listID, this.props.currentBoard._id);
    };

    submitAddList = () => {

        const newListInfo = {
            name: this.state.name,
            boardId: this.props.boardId
        };

        this.props.addBoardList(newListInfo)
        this.props.fetchBoard(this.props.boardId);
    };

    render() {
        return (
            <Container>

                <Divider hidden/>
                <Header as='h2'>
                    <Segment.Inline>
                        <Icon name='columns'/>
                        <Header.Content>
                            {'Board ' + this.props.currentBoard.name}
                        </Header.Content>

                        <Button primary size='mini' floated='right'
                                onClick={() => this.redirectionBoardDetails(this.props.currentBoard._id)}>
                            <Icon name='eye'/> Details
                        </Button>
                    </Segment.Inline>
                </Header>

                <AddBoardList />


                <Divider/>
                <Divider hidden/>

                {this.props.lists.map(list => (
                        <div style={{display: 'inline-block'}}>
                            <Card>
                                <Card.Content>
                                    <Card.Header textAlign='center'>
                                        {list.name}
                                        <Button inverted floated='right'>
                                            <Icon name='trash' color='red' link
                                                  onClick={() => this.handleDeleteList(list._id)}/>
                                        </Button>
                                        <Button inverted floated='right'>
                                            <UpdateList
                                                currentListId={list._id}
                                                currentListName={list.name}
                                                currentListIsArchived={list.isArchived}/>
                                        </Button>

                                    </Card.Header>

                                </Card.Content>
                                {list.isArchived ? (
                                    <Card.Content extra>
                                        <Icon name='archive' color="red"/>
                                        List Archived
                                    </Card.Content>
                                ) : (
                                    <React.Fragment>
                                        {list.cards.map(card => (
                                            <Card.Content>
                                                <Card color={"grey"}>
                                                    <Card.Content header={card.name}/>
                                                    {card.isArchived ? (
                                                        <Card.Content extra>
                                                            <Icon name='archive' color="red"/>
                                                            Card Archived
                                                        </Card.Content>
                                                    ) : (
                                                        <React.Fragment>
                                                            {(card.description !== undefined && card.description !== "" && card.description !== null) && (
                                                                <Card.Content description={card.description}/>
                                                            )}

                                                            {((card.dueDate.date !== undefined && card.dueDate.date !== "" && card.dueDate.date !== null) || card.dueDate.isDone) && (
                                                                <Card.Content extra>
                                                                    {(card.dueDate.date !== undefined && card.dueDate.date !== "" && card.dueDate.date !== null) && (
                                                                        <React.Fragment>
                                                                            <Icon name='calendar'
                                                                                  color="blue"/>{card.dueDate.date}
                                                                        </React.Fragment>
                                                                    )}
                                                                    {card.dueDate.isDone && (
                                                                        <Icon name='check' color="green"/>
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
                                                            currentCardIsArchived={card.isArchived}/>
                                                    </Button>
                                                </Card>
                                            </Card.Content>
                                        ))}

                                        <Card.Content extra>
                                            <Button>
                                                <Icon name={"add circle"}/>
                                                <AddListCard currentListId={list._id}/>
                                            </Button>
                                        </Card.Content>
                                    </React.Fragment>
                                )}
                            </Card>
                        </div>
                    )
                )}
                <div style={{display: 'inline-block'}}>
                    <Card link>
                        <AddBoardList/>
                    </Card>
                </div>
            </Container>
        )
    }
}

BoardView.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    lists: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetchBoard: PropTypes.func.isRequired,
    deleteList: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

BoardView.defaultProps = {
    lists: [{
        cards: []
    }]
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    lists: state.currentBoard.lists,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {fetchBoard, deleteList}
)(BoardView);
