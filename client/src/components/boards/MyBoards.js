import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Divider, Icon, Header, Container, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { fetchBoards } from "../../actions/boardActions";

class MyBoards extends Component {

  componentDidMount() {
    this.props.fetchBoards(this.props.auth.user.id);
  }

  redirectionBoard = (boardId) => {
    this.props.history.push(`/board/${boardId}`);
  };

  render() {
    return (
      <Container>
        <Header as='h2'>
          <Icon name='columns' />
          <Header.Content>My Boards</Header.Content>
          <Link to='/add/board'>
            <Button primary size='mini' floated='right'>
              <Icon name='add' />
              ADD
                    </Button>
          </Link>
        </Header>

        <br />

        <Divider horizontal>
          <Header as='h3'>
            <Icon name='heart' />
            Favorite boards
      </Header>
        </Divider>
        <Card.Group stackable doubling itemsPerRow={4}>
          <Card>
            <Card.Content textAlign='center' header="Board 1" />
            <Card.Content description="Description for board 1" />
            <Card.Content extra>
              <Icon name='heart' />
            </Card.Content>
          </Card>
          <Card>
            <Card.Content textAlign='center' header="Board 2" />
            <Card.Content description="Description for board 2" />
            <Card.Content extra>
              <Icon name='heart' />
            </Card.Content>
          </Card>
        </Card.Group>

        <br />

        <Divider horizontal>
          <Header as='h3'>
            <Icon name='user' />
            Personal boards
      </Header>
        </Divider>


        <Card.Group stackable doubling itemsPerRow={4}>
          {this.props.guestBoards.map(({ _id, name, description, isFavorite }) => (

            <Card>
              <Card.Content textAlign='center' header={name} />
              <Card.Content description={description} />
              <Card.Content extra>
                <Icon name='user' />
                {isFavorite ? <Icon name='heart' /> : <Icon name='heart outline' />}
                <Button onClick={() => this.redirectionBoard(_id)}> go board </Button>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>

        <br />

        {this.props.teamBoards.map(({ name, boards }) => (
          <React.Fragment>
            {boards.length > 0 ? (
              <React.Fragment>
                <Divider horizontal>
                  <Header as='h3'>
                    <Icon name='users' />
                    {name}
                  </Header>
                </Divider>
                <Card.Group stackable doubling itemsPerRow={4}>
                  {boards.map(({ _id, name, description, isFavorite }) => (
                    <Card>
                      <Card.Content textAlign='center' header={name} />
                      <Card.Content description={description} />
                      <Card.Content extra>
                        <Icon name='user' />
                        {isFavorite ? <Icon name='heart' /> : <Icon name='heart outline' />}
                        <Button onClick={() => this.redirectionBoard(_id)}> go board </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              </React.Fragment>
            ) : (
                <p></p>
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
  auth: PropTypes.object.isRequired,
};

MyBoards.defaultProps = {
  guestBoards: [],
  teamBoards: []
};

const mapStateToProps = state => ({
  guestBoards: state.boards.guestBoards,
  teamBoards: state.boards.teamsBoards,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { fetchBoards }
)(MyBoards);