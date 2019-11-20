import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Button, Card, Icon, Container} from "semantic-ui-react";


//________ACTIONS________
import {fetchBoard, fetchList} from "../../actions/boardActions";
import AddBoardList from "../modals/AddBoardList";

class BoardView extends Component {

    componentDidMount() {
        this.props.fetchBoard(this.props.match.params.boardId);
    }

    redirectionAddBoardMember = (boardId) => {
        this.props.history.push(`/board/${boardId}/add`);
    };

    render() {

        function EmptyList(props) {

            return <Container>
                <div style={{display: 'inline-block'}}>
                    <Card>
                        <Card.Content>
                            <Card.Header>Hi, I'm a new list !</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Card color={"grey"}>
                                <Card.Content header="Hi ! I'm a new Card" />
                                <Card.Content description="I'm here to make you remember what you have to do..." />
                                <Card.Content extra>
                                    <Icon name='calendar' />Due date
                                    <Icon name='archive' />Archived ?
                                </Card.Content>
                            </Card>
                        </Card.Content>
                        <Card.Content extra>
                            <button>
                                <Icon name={"add circle"}/> Add a new card
                            </button>
                        </Card.Content>
                    </Card>
                </div>
                <div style={{display: 'inline-block'}}>
                    <Card>
                        <Card.Content>
                            <Card.Header>Hi, I'm a second new list !</Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Card color={"grey"}>
                                <Card.Content header="Hi ! I'm a new Card" />
                                <Card.Content description="I'm here to make you remember what you have to do..." />
                                <Card.Content extra>
                                    <Icon name='calendar' />Due date
                                    <Icon name='archive' />Archived ?
                                </Card.Content>
                            </Card>
                        </Card.Content>
                        <Card.Content>
                            <Card color={"grey"}>
                                <Card.Content header="Hi ! I'm a second new Card" />
                                <Card.Content description="I'm here to make you remember what you have to do a second time..." />
                                <Card.Content extra>
                                    <Icon name='calendar' />Due date
                                    <Icon name='archive' />Archived ?
                                </Card.Content>
                            </Card>
                        </Card.Content>
                        <Card.Content extra>
                            <button>
                                <Icon name={"add circle"}/> Add a new card
                            </button>
                        </Card.Content>
                    </Card>
                </div>
                <div style={{display: 'inline-block'}}>
                    <Card link >
                           <AddBoardList />
                    </Card>
                </div>
            </Container>

        }

        return (
            <div>
                <div className={"header"}>
                <section>
                    {this.props.name.toUpperCase()} | {}
                    <Button onClick={() => this.redirectionAddBoardMember(this.props.currentBoard._id)}>Add a member</Button>
                </section>
                </div>
                {this.props.lists.length <= 0 ? <EmptyList /> : this.props.lists.map(list => (
                list.name
                    )
                )}

            </div>
        )
    }
}

BoardView.propTypes = {
    currentBoard: PropTypes.object.isRequired,
    lists: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    fetchBoard: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    fetchLists: PropTypes.func.isRequired
};

BoardView.defaultProps = {
    /**currentBoard: {
        labelNames: "",
        admins: [],
        guestMembers: [],
        isArchived: false,
        lists: []
    } **/
    name: "",
    lists: []
};

const mapStateToProps = state => ({
    currentBoard: state.currentBoard,
    lists: state.currentBoard.lists,
    name: state.currentBoard.name,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {fetchBoard, fetchList}
)(BoardView);
