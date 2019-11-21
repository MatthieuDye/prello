import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Card, Divider, Icon, Header, Container, Button, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

//_______ ACTIONS_______
import {fetchBoards} from "../../actions/boardActions";
import {favoriteBoard} from "../../actions/userActions";


class MyBoards extends Component {

    componentDidMount() {
        this.props.fetchBoards(this.props.auth.user.id);
    }

    redirectionBoard = (boardId) => {
        this.props.history.push(`/board/${boardId}`);
    };

    isFavorite = (boardId) => {
        return (this.props.favoriteBoards.filter(b => b._id === boardId).length !== 0);
    };

    handleFavorite = (boardId) => {
        console.log("IN HANDLE");
        console.log(boardId);

        const isFavorite = this.isFavorite(boardId);
        console.log(isFavorite);
        const userID = this.props.auth.user.id;
        console.log(userID);
        this.props.favoriteBoard(userID, boardId, !isFavorite);
    };

    render() {
        return (
            <Container>
                <Divider hidden/>

                <Header as='h2'>
                    <Segment.Inline>
                        <Icon name='columns'/>
                        <Header.Content>My Boards</Header.Content>
                        <Link to='/add/board'>
                            <Button primary size='mini' floated='right'>
                                <Icon name='add'/>
                                ADD
                            </Button>
                        </Link>
                    </Segment.Inline>
                </Header>

                <Divider hidden/>
                <Divider hidden/>

                {this.props.favoriteBoards.length !== 0
                && <Divider horizontal>
                    <Header as='h3'>
                        <Icon name='heart'/>
                        Favorite boards
                    </Header>
                </Divider>
                }

                <Card.Group stackable doubling itemsPerRow={4}>

                    {this.props.favoriteBoards.map(({_id, name, description}) => (

                        <Card color='red'>
                            <Card.Content as={'a'} onClick={() => this.redirectionBoard(_id)} textAlign='center'
                                          header={name}/>
                            <Card.Content as={'a'} onClick={() => this.redirectionBoard(_id)}
                                          description={description}/>
                            <Card.Content extra>
                                <Icon
                                    size='large'
                                    color='red'
                                    name='heart outlet'
                                    link
                                    onClick={() => this.handleFavorite(_id)}
                                />
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>

                <Divider hidden/>
                <Divider hidden/>

                {this.props.guestBoards.length !== 0 &&
                <Divider horizontal>
                    <Header as='h3'>
                        <Icon name='user'/>
                        Personal boards
                    </Header>
                </Divider>
                }

                <Card.Group stackable doubling itemsPerRow={4}>
                    {this.props.guestBoards.map(({_id, name, description}) => (

                        <Card color='blue'>
                            <Card.Content as={'a'} onClick={() => this.redirectionBoard(_id)} textAlign='center'
                                          header={name}/>
                            <Card.Content as={'a'} onClick={() => this.redirectionBoard(_id)} textAlign='center'
                                          description={description}/>
                            <Card.Content extra>
                                <Icon
                                    size='large'
                                    color='red'
                                    name={this.isFavorite(_id) ? 'heart' : 'heart outline'}
                                    link
                                    onClick={() => this.handleFavorite(_id)}
                                />

                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>

                <Divider hidden/>
                <Divider hidden/>

                {this.props.teamBoards.map(({name, boards}) => (
                    <React.Fragment>
                        {boards.length > 0 && (
                            <React.Fragment>
                                <Divider horizontal>
                                    <Header as='h3'>
                                        <Icon name='users'/>
                                        {name}
                                    </Header>
                                </Divider>
                                <Card.Group stackable doubling itemsPerRow={4}>
                                    {boards.map(({_id, name, description}) => (
                                        <Card color='blue'>
                                            <Card.Content as={'a'} onClick={() => this.redirectionBoard(_id)}
                                                          textAlign='center' header={name}/>
                                            <Card.Content as={'a'} onClick={() => this.redirectionBoard(_id)}
                                                          textAlign='center' description={description}/>
                                            <Card.Content extra>
                                                <Icon
                                                    size='large'
                                                    color='red'
                                                    name={this.isFavorite(_id) ? 'heart' : 'heart outline'}
                                                    link
                                                    onClick={() => this.handleFavorite(_id)}
                                                />
                                            </Card.Content>
                                        </Card>
                                    ))}
                                </Card.Group>
                            </React.Fragment>
                        )}
                    </React.Fragment>

                ))}

            </Container>
        );
    }
}

MyBoards.propTypes = {
    guestBoards: PropTypes.arrayOf(PropTypes.object).isRequired,
    teamBoards: PropTypes.arrayOf(PropTypes.object).isRequired,
    fetchBoards: PropTypes.func.isRequired,
    favoriteBoard: PropTypes.func.isRequired,
    favoriteBoards: PropTypes.arrayOf(PropTypes.object).isRequired,
    auth: PropTypes.object.isRequired,
};

MyBoards.defaultProps = {
    guestBoards: [],
    teamBoards: [],
    favoriteBoards: []
};

const mapStateToProps = state => ({
    guestBoards: state.boards.guestBoards,
    teamBoards: state.boards.teamsBoards,
    favoriteBoards: state.boards.favoriteBoards,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {fetchBoards, favoriteBoard}
)(MyBoards);